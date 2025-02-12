'use client'

import { CartProvider, useCart } from '@/contexts/CartContext'
import { Card, CardBody, Button, Spinner } from '@nextui-org/react'
import { ShoppingBag } from 'lucide-react'
import CartItem from '../../components/CartItem'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function CartPage() {
  const { items, total, refresh } = useCart()
  const { status } = useSession()

  useEffect(() => {
    refresh()
  }, [refresh])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is waiting</h1>
        <p className="text-gray-600 mb-6">Please sign in to view your cart</p>
        <Button
          as={Link}
          href="/auth/signin"
          color="primary"
          variant="shadow"
        >
          Sign In
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some items to get started</p>
        <Button
          as={Link}
          href="/products"
          color="primary"
          variant="shadow"
        >
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <CartProvider>
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <CartItem 
              key={item.product._id || `item-${index}`}
              item={item} 
            />
          ))}
        </div>

        <div>
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button
                color="primary"
                size="lg"
                className="w-full"
                href="/checkout"
                as={Link}
              >
                Proceed to Checkout
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
    </CartProvider>
  )
}
