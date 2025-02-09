'use client'

import { Card, CardBody, CardHeader, Spinner, Button } from '@nextui-org/react'
import { 
  ShoppingBag, Users, DollarSign, Activity,
  TrendingUp, ShoppingCart 
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Metric } from '@/components/admin/Metric'
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell 
} from 'recharts'
import { SalesGrowthChart } from '@/components/admin/SalesGrowthChart'
import { ProductPerformanceChart } from '@/components/admin/ProductPerformanceChart'

// Define color constants
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface ApiError {
  error: string;
}

interface DashboardData {
  overview: {
    totalProducts: number;
    totalUsers: number;
    totalCartValue: number;
    activeUsers: number;
    topProducts: Array<{
      name: string;
      totalQuantity: number;
      totalUsers: number;
    }>;
  };
  topProducts: Array<{
    name: string;
    totalQuantity: number;
    totalUsers: number;
  }>;
  categoryStats: Array<{ _id: string; count: number }>;
  monthlyStats: Array<{
    month: string;
    year: number;
    totalItems: number;
    uniqueUsers: number;
  }>;
  productPerformance: Array<{
    name: string
    totalSales: number
    revenue: number
    customerCount: number
    averageQuantity: number
    performance: number
  }>
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/metrics')
      const jsonData = await res.json()
      
      if (!res.ok || 'error' in jsonData) {
        throw new Error(jsonData.error || 'Failed to fetch metrics')
      }
      
      setData(jsonData)
      setError(null)
    } catch (error) {
      console.error('Dashboard error:', error)
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data')
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-6"><Spinner size="lg" /></div>
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error || 'Failed to load dashboard data'}</p>
        <Button 
          color="primary" 
          variant="light" 
          onPress={fetchData}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    )
  }

  const { overview } = data

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric 
          title="Products"
          value={overview.totalProducts.toString()}
          icon={<ShoppingBag />}
          trend="+2.1%"
        />
        <Metric 
          title="Users"
          value={overview.totalUsers.toString()}
          icon={<Users />}
          trend="+5.2%"
        />
        <Metric 
          title="Cart Value"
          value={`$${overview.totalCartValue.toFixed(2)}`}
          icon={<DollarSign />}
          trend="+12.5%"
        />
        <Metric 
          title="Active Users"
          value={overview.activeUsers.toString()}
          icon={<Activity />}
          trend="+8.4%"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesGrowthChart data={data?.monthlyStats.map(stat => ({
          month: stat.month,
          year: stat.year,
          totalValue: stat.totalItems,
          growth: 0 // Calculate growth percentage if needed
        })) || []} />

        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-0 pt-6 px-6">
            <h4 className="font-bold text-large">Category Distribution</h4>
          </CardHeader>
          <CardBody className="h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.categoryStats}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.categoryStats.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <ProductPerformanceChart data={data.productPerformance} />

        {/* Top Products */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0 pt-6 px-6">
            <h4 className="font-bold text-large">Top Products</h4>
          </CardHeader>
          <CardBody className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={data.topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalQuantity" fill="#8884d8" name="Quantity Sold" />
                <Bar dataKey="totalUsers" fill="#82ca9d" name="Unique Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
