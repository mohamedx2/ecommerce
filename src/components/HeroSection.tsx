'use client'

import { motion } from 'framer-motion'
import { Card } from '@nextui-org/react'
import dynamic from 'next/dynamic'

// Dynamically import ProductGrid for better performance
const ProductGrid = dynamic(() => import('./ProductGrid'), {
  loading: () => (
    <div className="animate-pulse h-96 bg-default-100 rounded-lg" />
  )
})

export default function HeroSection() {
  return (
    <>
      <Card 
        className="bg-gradient-to-br from-primary-50 to-secondary-50 border-none my-8"
        style={{ containIntrinsicSize: '0 300px' }}
      >
        <motion.div 
          className="py-16 px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-5xl font-bold mb-6 inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{
              contentVisibility: 'auto',
              containIntrinsicSize: '0 64px'
            }}
          >
            Welcome to Our Store
          </h1>
          <p className="text-xl text-default-600 max-w-2xl mx-auto">
            Discover amazing products at great prices
          </p>
        </motion.div>
      </Card>
      
      <ProductGrid />
    </>
  )
}
