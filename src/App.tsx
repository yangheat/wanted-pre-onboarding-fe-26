import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getMockData } from './api/products'
import './App.css'
import { MockData } from './types/mock'

function TotalPrice({ totalPrice }: { totalPrice: number }) {
  const formattedPrice = new Intl.NumberFormat('ko-KR').format(totalPrice)
  return (
    <header>
      <p>TotalPrice: {formattedPrice}</p>
    </header>
  )
}

function ProductItem({ products }: { products: MockData[] }) {
  return (
    <table>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            {Object.entries(product).map(([key, value]) => (
              <td key={`${key}-${value}`}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ProductList({
  products,
  setPageNum,
  isEnd
}: {
  products: MockData[]
  setPageNum: React.Dispatch<React.SetStateAction<number>>
  isEnd: boolean
}) {
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef(null)

  const handleInterSection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && products.length > 0 && !isEnd) {
        setIsLoading(true)
        setPageNum((curr) => curr + 1)
      }
    },
    [products.length, isEnd, setPageNum]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleInterSection, {
      threshold: 0.9
    })
    const currntRef = observerRef.current

    if (currntRef) {
      observer.observe(currntRef)
    }

    return () => {
      if (currntRef) {
        observer.unobserve(currntRef)
      }
    }
  }, [handleInterSection])

  useEffect(() => {
    if (isEnd) {
      setIsLoading(false)
    }
  }, [isEnd])

  return (
    <>
      <ProductItem products={products} />
      <div ref={observerRef}>{isLoading ? 'loading...' : ''}</div>
    </>
  )
}

function App() {
  const [products, setProducts] = useState<MockData[]>([])
  const [isEnd, setIsEnd] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [pageNum, setPageNum] = useState(0)

  const fetchProducts = useCallback(async (page: number) => {
    try {
      const response = await getMockData(page)
      const { datas, isEnd } = response

      if (datas.length === 0 && isEnd) {
        return
      }

      setProducts((prev) => [...prev, ...datas])

      const newPrice = datas.reduce((sum, data) => sum + data.price, 0)
      setTotalPrice((prev) => prev + newPrice)
      setIsEnd(isEnd)
    } catch (error) {
      console.error('product fetch error')
    }
  }, [])

  useEffect(() => {
    fetchProducts(pageNum)
  }, [pageNum, fetchProducts])

  return (
    <>
      <TotalPrice totalPrice={totalPrice} />
      <ProductList products={products} setPageNum={setPageNum} isEnd={isEnd} />
    </>
  )
}

export default App
