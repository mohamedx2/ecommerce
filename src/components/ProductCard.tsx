'use client'

import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react"
import { ShoppingCart } from "lucide-react"
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useState } from 'react'
import { motion } from "framer-motion"

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
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        shadow="sm" 
        className="hover:shadow-lg transition-shadow"
      >
        <Link href={`/products/${name.toLowerCase().replace(/ /g, '-')}`}>
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={name}
              className="w-full object-cover h-[200px]"
              src={image}
            />
          </CardBody>
        </Link>
        <CardFooter className="flex flex-col items-start text-small">
          <Link href={`/products/${name.toLowerCase().replace(/ /g, '-')}`}>
            <div>
              <b className="text-lg">{name}</b>
              <p className="text-default-500 line-clamp-2">{description}</p>
              <p className="text-primary font-bold text-lg mt-2">${price.toFixed(2)}</p>
            </div>
          </Link>
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
    </motion.div>
  );
}
