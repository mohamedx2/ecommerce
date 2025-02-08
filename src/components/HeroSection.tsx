'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-5xl font-bold mb-6">Welcome to Our Store</h1>
      <p className="text-xl text-default-600 mb-8 max-w-2xl">
        Discover our amazing collection of products with great prices and exceptional quality.
      </p>
      {isMounted ? (
        <Link 
          href="/products"
          className="inline-block bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-secondary transition-colors"
        >
          Shop Now
        </Link>
      ) : (
        <span className="inline-block bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold">
          Shop Now
        </span>
      )}
    </div>
  )
}
