'use client'

import { useEffect, useState } from 'react'
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react'
import { toast } from 'sonner'

interface Order {
  _id: string;
  userId: string;
  items: { length: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const statusColorMap: Record<Order['status'], 'warning' | 'primary' | 'secondary' | 'success' | 'danger'> = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'danger',
}

export default function AdminOrders() {
  
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrders(data)
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setOrders(orders.map((order:any) => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ))
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      <Card>
        <CardBody>
          <Table aria-label="Orders table">
            <TableHeader>
              <TableColumn>ORDER ID</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>ITEMS</TableColumn>
              <TableColumn>TOTAL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {orders.map((order: Order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip color={statusColorMap[order.status]} variant="flat">
                      {order.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="flat">Update Status</Button>
                      </DropdownTrigger>
                      <DropdownMenu 
                        aria-label="Order status actions"
                        onAction={(key) => updateOrderStatus(order._id, key.toString())}
                      >
                        <DropdownItem key="processing">Processing</DropdownItem>
                        <DropdownItem key="shipped">Shipped</DropdownItem>
                        <DropdownItem key="delivered">Delivered</DropdownItem>
                        <DropdownItem key="cancelled" className="text-danger">
                          Cancel
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}
