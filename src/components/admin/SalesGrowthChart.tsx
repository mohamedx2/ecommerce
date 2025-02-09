'use client'

import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SalesGrowthProps {
  data: Array<{
    month: string
    year: number
    totalValue: number
    growth: number
  }>
}

export function SalesGrowthChart({ data }: SalesGrowthProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-0 pt-6 px-6">
        <h4 className="font-bold text-large">Sales Growth</h4>
      </CardHeader>
      <CardBody className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0070F3" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0070F3" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(value) => `${value}`}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`$${value}`, 'Total Value']}
              labelFormatter={(label) => `${label}`}
            />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke="#0070F3"
              fillOpacity={1}
              fill="url(#growthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}
