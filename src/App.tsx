import React, { Fragment, useEffect, useRef, useState } from 'react'
import { getMockData } from './api/products'
import './App.css'
import { MockData } from './types/mock'

function TotalPrice({ totalPrice }: { totalPrice: number }) {
  return <p>TotalPrice: {totalPrice}</p>
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
  const [load, setLoad] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && products.length > 0) {
          console.log('- observer')
          console.log('products:', products)
          console.log('isEnd:', isEnd)
          if (isEnd === true) {
            setLoad(false)
            return
          }

          setLoad(true)
          setPageNum((curr) => curr + 1)
        }
      },
      { threshold: 0.9 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [products, isEnd])
  return (
    <>
      <table>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{index}</td>
              {Object.entries(product).map(([key, value]) => (
                <td key={index + key + value}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={ref}>{load ? 'loading...' : ''}</div>
    </>
  )
}

function App() {
  const [products, setProducts] = useState<MockData[]>([])
  const [isEnd, setIsEnd] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [pageNum, setPageNum] = useState(0)

  useEffect(() => {
    getMockData(pageNum).then((response) => {
      const { datas, isEnd } = response

      if (datas.length === 0 && isEnd === true) {
        return
      }

      setProducts([...products, ...datas])

      let price = 0
      datas.forEach((data) => {
        price += data.price
      })
      setTotalPrice(totalPrice + price)

      setIsEnd(isEnd)
    })
  }, [pageNum])

  return (
    <>
      <header>
        <TotalPrice totalPrice={totalPrice} />
      </header>

      <ProductList products={products} setPageNum={setPageNum} isEnd={isEnd} />
    </>
  )
}

export default App
