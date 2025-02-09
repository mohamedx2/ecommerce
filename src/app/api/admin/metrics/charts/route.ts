import { connectDB } from '@/lib/mongodb'
import { MongoClient } from 'mongodb'

export async function GET() {
  try {
    await connectDB()
    const client = await MongoClient.connect(process.env.MONGODB_URI!)
    const db = client.db()||client.db(process.env.MONGODB_DB);

    // Get monthly cart data (last 6 months)
    const monthlyData = await db.collection('carts').aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          total: { $sum: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]).toArray()

    // Get top 5 products by quantity in carts
    const topProducts = await db.collection('carts').aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          name: '$productInfo.name',
          totalQuantity: 1
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]).toArray()

    await client.close()

    return Response.json({
      monthlyData: monthlyData.map(item => ({
        month: new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' }),
        total: item.total || 0
      })),
      topProducts: topProducts.map(item => ({
        name: item.name,
        quantity: item.totalQuantity
      }))
    })
  } catch (error) {
    console.error('Charts API error:', error)
    return Response.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
}
