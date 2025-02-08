import { connectDB } from '@/lib/mongodb'
import { Product } from '@/models/Product'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()
    const categories = await Product.distinct('category')
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
