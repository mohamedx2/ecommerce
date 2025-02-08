'use client'

import { useCart } from '@/contexts/CartContext'
import { Card, CardBody, Button, Image } from '@nextui-org/react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface CartItemProps {
  item: {
    product: {
      _id: string    // Changed from id to _id
      name: string
      price: number
      image: string
    }
    quantity: number
  }
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const [isRemoving, setIsRemoving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localQuantity, setLocalQuantity] = useState(item.quantity)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return
    setIsLoading(true)
    setLocalQuantity(newQuantity) // Update local state immediately
    
    try {
      await updateQuantity(item.product._id, newQuantity)
    } catch (error) {
      setLocalQuantity(item.quantity) // Revert on error
      console.error('Update failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await removeItem(item.product._id)
      await new Promise(resolve => setTimeout(resolve, 500)) // Delay for better UX
      setIsRemoving(false)
      // No need to set isRemoving to false as component will unmount
    } catch (error) {
      console.error('Failed to remove item:', error)
      setIsRemoving(false)
    }
  }

  return (
    <Card>
      <CardBody>
        <div className="flex gap-4">
          <div className="w-24 h-24 relative flex-shrink-0">
            <Image
              src={item.product.image}
              alt={item.product.name}
              radius="sm"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-grow">
            <Link 
              href={`/products/${item.product.name.toLowerCase().replace(/ /g, '-')}`}
              className="font-semibold hover:text-primary transition-colors"
            >
              {item.product.name}
            </Link>
            <p className="text-default-500">${item.product.price}</p>
            <div className="flex items-center gap-2 mt-2">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleQuantityChange(localQuantity - 1)}
                isDisabled={isLoading || localQuantity <= 1}
                isLoading={isLoading}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center">
                {localQuantity}
              </span>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleQuantityChange(localQuantity + 1)}
                isDisabled={isLoading}
                isLoading={isLoading}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="light"
                onPress={handleRemove}
                isDisabled={isRemoving}
                isLoading={isRemoving}
                className="ml-4"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              ${(item.product.price * localQuantity).toFixed(2)}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
