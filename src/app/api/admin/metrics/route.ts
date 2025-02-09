import { connectDB } from '@/lib/mongodb'
import { Product } from '@/models/Product'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await connectDB()
    const db = mongoose.connection.db

    if (!db) {
      return Response.json({ error: 'Database connection failed' }, { status: 500 })
    }

    try {
      // Get current timestamp for active session check (24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

      // Update users query with proper session tracking
      const userStats = await db.collection('sessions').aggregate([
        {
          $match: {
            expires: { $gt: new Date() } // Only count non-expired sessions
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $group: {
            _id: null,
            activeUsers: { $addToSet: '$userId' }, // Unique active users
            recentSessions: {
              $sum: {
                $cond: [
                  { $gt: ['$expires', oneDayAgo] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]).toArray()

      // Get total users count
      const totalUsers = await db.collection('users').countDocuments()

      // Get cart total value with product prices
      const cartValue = await db.collection('carts').aggregate([
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'productInfo'
          }
        },
        { $unwind: '$productInfo' },
        {
          $group: {
            _id: null,
            totalValue: {
              $sum: {
                $multiply: ['$items.quantity', '$productInfo.price']
              }
            }
          }
        }
      ]).toArray()

      // Get top products by quantity in carts
      const topProducts = await db.collection('carts').aggregate([
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$product.name' },
            totalQuantity: { $sum: '$items.quantity' },
            totalValue: { 
              $sum: { $multiply: ['$items.quantity', '$product.price'] }
            },
            uniqueUsers: { $addToSet: '$userId' }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            totalQuantity: 1,
            totalValue: 1,
            totalUsers: { $size: '$uniqueUsers' }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 }
      ]).toArray()

      const [productsCount, categoryData] = await Promise.all([
        Product.countDocuments(),
        Product.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ])
      ])

      // Get monthly trends from carts
      const monthlyData = await db.collection('carts').aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
            }
          }
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            totalItems: { $sum: '$items.quantity' },
            totalValue: {
              $sum: { $multiply: ['$items.quantity', '$product.price'] }
            },
            uniqueUsers: { $addToSet: '$userId' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]).toArray()

      // Generate complete months array with real and zero values
      const now = new Date()
      const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6))
      const months = []

      for (let d = new Date(sixMonthsAgo); d <= new Date(); d.setMonth(d.getMonth() + 1)) {
        const existingData = monthlyData.find(m => 
          m._id.year === d.getFullYear() && 
          m._id.month === d.getMonth() + 1
        )

        months.push({
          month: d.toLocaleString('default', { month: 'short' }),
          year: d.getFullYear(),
          totalItems: existingData?.totalItems || 0,
          totalValue: existingData?.totalValue || 0,
          uniqueUsers: existingData?.uniqueUsers?.length || 0
        })
      }

      // Fix product performance metrics aggregation
      const productPerformance = await db.collection('carts').aggregate([
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product._id',
            name: { $first: '$product.name' },
            totalSales: { $sum: '$items.quantity' },
            revenue: {
              $sum: { $multiply: ['$items.quantity', '$product.price'] }
            },
            uniqueCustomers: { $addToSet: '$userId' },
            averageQuantityPerOrder: { $avg: '$items.quantity' }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            totalSales: 1, // Fix: Reference the field from $group stage
            revenue: { $round: ['$revenue', 2] },
            customerCount: { $size: '$uniqueCustomers' },
            averageQuantity: { $round: ['$averageQuantityPerOrder', 1] },
            performance: {
              $multiply: [
                { $divide: ['$revenue', { $add: [{ $size: '$uniqueCustomers' }, 0.1] }] },
                '$averageQuantityPerOrder'
              ]
            }
          }
        },
        { $sort: { performance: -1 } },
        { $limit: 10 }
      ]).toArray()

      const overview = {
        totalProducts: productsCount || 0,
        totalUsers: totalUsers || 0,
        totalCartValue: cartValue[0]?.totalValue || 0,
        activeUsers: userStats[0]?.activeUsers?.length || 0,
        recentSessions: userStats[0]?.recentSessions || 0
      }

      return Response.json({
        overview,
        categoryStats: categoryData || [],
        monthlyStats: months,
        topProducts: topProducts.map(product => ({
          name: product.name,
          totalQuantity: product.totalQuantity,
          totalUsers: product.totalUsers,
          totalValue: product.totalValue
        })),
        productPerformance,
      })

    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      return Response.json(
        { error: 'Failed to fetch metrics data' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Server error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
