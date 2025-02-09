import { connectDB } from '@/lib/mongodb'
import { Product } from '@/models/Product'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type RouteParams = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    await connectDB()
    const resolvedParams = await params
    const product = await Product.findById(resolvedParams.id).lean()

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    return Response.json(product)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    await connectDB()
    const body = await request.json()
    
    const product = await Product.findByIdAndUpdate(
      resolvedParams.id,
      { ...body },
      { new: true }
    )

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    return Response.json(product)
  } catch (error) {
    return Response.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    await connectDB()
    
    const product = await Product.findByIdAndDelete(resolvedParams.id)

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    return Response.json({ message: 'Product deleted successfully' })
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
