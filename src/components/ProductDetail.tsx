'use client'

import { Button, Image } from "@nextui-org/react"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

interface ProductDetailProps {
  product: {
    id: string
    name: string
    price: number
    description: string
    image: string
    category: string
  }
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (productName: string, quantity: number) => {
    // Implement the logic to add the product to the cart
    alert(`Add to cart: ${productName}, Quantity: ${quantity}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-[400px] md:h-[600px]">
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary mb-4">
              ${product.price}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Category</p>
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm">
                {product.category}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="flat"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="text-lg font-semibold">{quantity}</span>
              <Button
                size="sm"
                variant="flat"
                onPress={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
            
            <Button
              onPress={() => handleAddToCart(product.name, quantity)}
              color="primary"
              className="w-full"
              size="lg"
              endContent={<ShoppingCart className="w-5 h-5" />}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
