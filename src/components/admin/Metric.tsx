import { Card, CardBody } from '@nextui-org/react'
import { ReactNode } from 'react'

interface MetricProps {
  title: string
  value: string
  icon: ReactNode
  trend: string
}

export function Metric({ title, value, icon, trend }: MetricProps) {
  const isPositive = trend.startsWith('+')
  
  return (
    <Card>
      <CardBody className="flex flex-row items-center gap-4">
        <div className="p-3 rounded-lg bg-primary text-white">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
          <p className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend} from last month
          </p>
        </div>
      </CardBody>
    </Card>
  )
}
