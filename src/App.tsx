import { Fragment, useEffect, useState } from 'react'
import { getMockData } from './api/products'
import './App.css'
import { MockData } from './types/mock'

const PER_PAGE = 10

function App() {
  const [products, setProducts] = useState<MockData[]>([])

  useEffect(() => {
    getMockData(PER_PAGE).then((response) => {
      setProducts(response.datas)
    })
  }, [])
  return (
    <>
      {products.map((product, index) => (
        <Fragment key={index}>
          {Object.entries(product).map(([key, value]) => (
            <p key={key}>
              {key}: {value}
            </p>
          ))}
          <hr />
        </Fragment>
      ))}
    </>
  )
}

export default App
