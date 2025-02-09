'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'

interface ChartData {
  month: string
  total: number
}

export function SalesChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/metrics/charts')
        const json = await res.json()
        setData(json.monthlyData)
      } catch (error) {
        console.error('Failed to fetch chart data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return <div className="h-full flex items-center justify-center">Loading...</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value}`} />
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="#006FEE" 
          fill="#006FEE" 
          fillOpacity={0.3} 
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
