import { connectDB } from '@/lib/mongodb'
import { Order } from '@/models/Order'
import { Cart } from '@/models/Cart'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const orders = await Order.find({ userId: session.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 })

    return Response.json(orders)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { shippingAddress } = await request.json()
    
    await connectDB()
    
    // Get user's cart
    const cart = await Cart.findOne({ userId: session.user.id }).populate('items.product')
    if (!cart || cart.items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Create order from cart
    const orderItems = cart.items.map((item:any) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }))

    const order = new Order({
      userId: session.user.id,
      items: orderItems,
      shippingAddress
    })

    await order.save()

    // Clear cart after order creation
    cart.items = []
    await cart.save()

    return Response.json(order)
  } catch (error) {
    return Response.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
