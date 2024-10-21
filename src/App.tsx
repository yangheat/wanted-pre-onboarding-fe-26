import { useEffect, useRef, useState } from 'react'
import { getMockData } from './api/products'
import { MockData } from './types/mock'

function App() {
  const [products, setProducts] = useState<MockData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const page = useRef(0)
  const observerRef = useRef(null)

  // 현재 isEnd, isLoading은 useEffect 내부에서만 값이 변경되기 때문에 의존성 배열에 설정할 필요가 없음
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      ([entrie]) => {
        if (!entrie.isIntersecting || !isLoading || isEnd) {
          return
        }

        setIsLoading(true)

        getMockData(page.current)
          .then((result) => {
            setProducts((prev) => [...prev, ...result.datas])
            setIsEnd(result.isEnd)
            page.current += 1
            setTotalPrice((prev) =>
              result.datas.reduce((acc, cur) => acc + cur.price, prev)
            )
          })
          .catch((error) => console.log(error))
          .finally(() => setIsLoading(false))
      },
      { threshold: 0.9 }
    )

    const currentRef = observerRef.current
    if (currentRef) {
      intersectionObserver.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        intersectionObserver.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <>
      <>Total Price: {totalPrice}</>
      <section>
        {products.map((product, index) => (
          <div key={product.productId + index}>
            {Object.entries(product).map(([key, value]) => (
              <p key={`${key}-${value}`}>{value}</p>
            ))}
          </div>
        ))}
      </section>
      <div ref={observerRef}>{isLoading ? 'loading...' : ''}</div>
    </>
  )
}

export default App
