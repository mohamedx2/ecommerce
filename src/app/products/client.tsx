'use client'

import ProductCard from '@/components/ProductCard'
import { Spinner } from '@nextui-org/react'
import { useEffect, useState } from 'react'

export default function ClientProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product: any) => (
          <ProductCard
            key={product._id}
            name={product.name}
            price={product.price}
            description={product.description}
            image={product.image} _id={product._id}         />
        ))}
      </div>
    </div>
  )
}
