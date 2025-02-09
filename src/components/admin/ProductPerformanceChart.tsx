'use client'

import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ReferenceLine 
} from "recharts"

interface ProductPerformanceProps {
  data: Array<{
    name: string
    totalSales: number
    revenue: number
    customerCount: number
    averageQuantity: number
    performance: number
  }>
}

export function ProductPerformanceChart({ data }: ProductPerformanceProps) {
  // Calculate average performance for reference line
  const avgPerformance = data.reduce((sum, item) => sum + item.performance, 0) / data.length

  return (
    <Card className="w-full">
      <CardHeader className="pb-0 pt-6 px-6 flex flex-col">
        <h4 className="font-bold text-large">Product Performance</h4>
        <p className="text-small text-default-500">Sales, Revenue and Customer Analysis</p>
      </CardHeader>
      <CardBody className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              scale="point"
            />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip
              formatter={(value, name) => {
                switch(name) {
                  case 'Revenue':
                    return [`$${value}`, name]
                  case 'Performance Score':
                    return [typeof value === 'number' ? value.toFixed(2) : value, name]
                  default:
                    return [value, name]
                }
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="totalSales" 
              fill="#8884d8" 
              name="Total Sales"
              barSize={20}
            />
            <Bar 
              yAxisId="right" 
              dataKey="customerCount" 
              fill="#82ca9d" 
              name="Customer Count"
              barSize={20}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="performance"
              stroke="#ff7300"
              name="Performance Score"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <ReferenceLine 
              y={avgPerformance} 
              yAxisId="right"
              stroke="red" 
              strokeDasharray="3 3"
              label={{ 
                value: 'Avg Performance',
                position: 'insideBottomRight'
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}
