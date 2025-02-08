import { connectDB } from '@/lib/mongodb'
import { Cart } from '@/models/Cart'
import { Product } from '@/models/Product'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import mongoose from 'mongoose'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    await connectDB()
    const cart = await Cart.findOne({ userId: session.user.id })
      .populate({
        path: 'items.product',
        select: 'name price image description'
      })

    if (!cart) {
      return NextResponse.json({ userId: session.user.id, items: [] })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('Cart error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { productId, quantity } = body
    if (!productId) {
      console.error('Missing productId in request') // Debug log
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
    }

    if (typeof quantity !== 'number') {
      console.error('Invalid quantity in request:', quantity) // Debug log
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
    }

    await connectDB()

    // Find product first
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: session.user.id })
    if (!cart) {
      cart = new Cart({
        userId: session.user.id,
        items: []
      })
    }

    // Update cart items
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    )

    if (existingItemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(existingItemIndex, 1)
      } else {
        cart.items[existingItemIndex].quantity = quantity
      }
    } else if (quantity > 0) {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity
      })
    }

    await cart.save()

    // Return populated cart
    const updatedCart = await Cart.findById(cart._id).populate('items.product')
    return NextResponse.json(updatedCart)

  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart', details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity } = await request.json()

    if (!productId || typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    await connectDB()

    const cart = await Cart.findOne({ userId: session.user.id })
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
    }

    cart.items[itemIndex].quantity = quantity
    await cart.save()

    const updatedCart = await Cart.findById(cart._id).populate('items.product')
    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error('Cart update error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    await connectDB()

    const cart = await Cart.findOne({ userId: session.user.id })
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
    }

    cart.items.splice(itemIndex, 1)
    await cart.save()

    const updatedCart = await Cart.findById(cart._id).populate('items.product')
    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error('Cart delete error:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}
