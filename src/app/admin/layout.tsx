'use client'

import { Tabs, Tab } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div>
      <Tabs 
        aria-label="Admin navigation" 
        selectedKey={pathname}
        onSelectionChange={(key) => router.push(key.toString())}
        className="mb-6"
      >
        <Tab key="/admin" title="Dashboard" />
        <Tab key="/admin/orders" title="Orders" />
        <Tab key="/admin/products" title="Products" />
      </Tabs>
      {children}
    </div>
  )
}
