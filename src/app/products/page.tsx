import ProductCard from '@/components/ProductCard'
import { Key } from 'react'

async function getProducts(): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Our Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: { _id: { toString: () => Key | null | undefined }; name: string; price: number; description: string; image: string }) => (
            <ProductCard
                key={product._id.toString()}
                _id={String(product._id)}
                name={product.name}
                price={product.price}
                description={product.description}
                image={product.image}
            />
            ))}
        </div>
    </div>
  )
}
