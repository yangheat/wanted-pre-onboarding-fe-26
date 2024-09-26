import { useEffect, useState } from 'react'
import { getMockData } from './api/products'
import './App.css'
import { MockData } from './types/mock'

function TotalPrice({ totalPrice }: { totalPrice: number}) {
  return <p>TotalPrice: { totalPrice }</p>
}

function ProductList({ products }: { products: MockData[]}) {
  return (
    <>
      <table>
        <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                {Object.entries(product).map(([key, value]) => (
                  <td key={index + key + value}>{key}: {value}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      
    </>
  )
}

function App() {
  const [products, setProducts] = useState<MockData[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [pageNum, setpageNum] = useState(0)

  useEffect(() => {
    getMockData(pageNum).then((response) => {
      let price = 0
      response.datas.forEach((data) => {
        price += data.price
      })
      setTotalPrice(price)
      setProducts(response.datas)
    })
  }, [])
  return (
    <>
      <TotalPrice totalPrice={totalPrice}/>
      <ProductList products={products}/>
    </>
  )
}

export default App
