import { Product } from '@/models/Product'
import { connectDB } from '@/lib/mongodb'
import ProductDetail from '@/components/ProductDetail'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getProduct(params: Promise<{ slug: string }>) {
  const resolvedParams = await params
  await connectDB()
  const productName = resolvedParams.slug.replace(/-/g, ' ')
  
  const product = await Product.findOne({
    name: { $regex: new RegExp(`^${productName}$`, 'i') }
  }).lean()

  return product as {_id: string, name: string, price: number, description: string, image: string, category: string} | null
}

export default async function ProductPage(props: PageProps) {
  const product = await getProduct(props.params)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={{
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category
  }} />
}

export const dynamic = 'force-dynamic'
