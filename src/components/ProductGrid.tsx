'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { Spinner } from '@nextui-org/react'

interface Product {
  _id: string
  name: string
  price: number
  description: string
  image: string
  category: string
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product._id}>
          <ProductCard
            _id={product._id}
            name={product.name}
            price={product.price}
            description={product.description}
            image={product.image}
          />
        </div>
      ))}
    </div>
  )
}
