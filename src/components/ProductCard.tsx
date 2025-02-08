'use client'

import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react"
import { ShoppingCart } from "lucide-react"
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useState } from 'react'

interface ProductCardProps {
  _id: string
  name: string
  price: number
  description: string
  image: string
}

export default function ProductCard({ _id, name, price, description, image }: ProductCardProps) {
  const { addItem } = useCart()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!session) {
      toast.error('Please sign in to add items to cart')
      return
    }

    setIsLoading(true)
    try {
      await addItem(_id, 1)
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="group relative">
      <Card className="border-none" shadow="none">
        <CardBody className="p-0">
          <Link href={`/products/${name.toLowerCase().replace(/ /g, '-')}`}>
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={name}
              className="w-full object-cover h-[200px] transition-transform group-hover:scale-100 overflow-hidden"
              src={image}
            />
          </Link>
        </CardBody>
        <CardFooter className="flex-col items-start px-4 pt-4 pb-6">
          <Link 
            href={`/products/${name.toLowerCase().replace(/ /g, '-')}`}
            className="text-large font-bold hover:text-primary transition-colors"
          >
            {name}
          </Link>
          <p className="text-default-500">${price}</p>
          <p className="text-small text-default-500">{description}</p>
          <Button
            className="mt-4 w-full"
            color="primary"
            isLoading={isLoading}
            endContent={<ShoppingCart className="w-4 h-4" />}
            onPress={handleAddToCart}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
