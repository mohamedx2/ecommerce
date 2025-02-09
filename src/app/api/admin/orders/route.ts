import { connectDB } from '@/lib/mongodb'
import { Order } from '@/models/Order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    // TODO: Add proper admin check
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const orders = await Order.find({})
      .populate('items.product')
      .sort({ createdAt: -1 })
      .lean()

    return Response.json(orders)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, status } = await request.json()
    
    await connectDB()
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('items.product')

    return Response.json(order)
  } catch (error) {
    return Response.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
