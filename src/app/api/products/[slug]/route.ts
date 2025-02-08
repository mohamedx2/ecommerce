import { connectDB } from '@/lib/mongodb'
import { Product } from '@/models/Product'

interface ProductType {
  _id: string
  name: string
  price: number
  description: string
  image: string
  category: string
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function GET(
  _request: Request,
  props: PageProps
) {
  try {
    await connectDB()
    const resolvedParams = await props.params
    const productName = resolvedParams.slug.replace(/-/g, ' ')
    
    const product = await Product.findOne({
      name: { $regex: new RegExp(`^${productName}$`, 'i') }
    }).lean() as ProductType | null

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    return Response.json({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category
    })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

