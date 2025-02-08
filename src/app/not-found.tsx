import { Button } from "@nextui-org/react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-4xl font-bold mb-4">Product Not Found</h2>
      <p className="text-gray-600 mb-8">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Button
        as={Link}
        href="/products"
        color="primary"
        size="lg"
      >
        View All Products
      </Button>
    </div>
  )
}
