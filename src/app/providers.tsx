'use client'

import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from 'sonner'
import dynamic from 'next/dynamic'

// Dynamically import non-critical providers
const DynamicCartProvider = dynamic(() => 
  import('@/contexts/CartContext').then(mod => mod.CartProvider), {
    ssr: false
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <DynamicCartProvider>
          {children}
          <Toaster richColors position="top-center" />
        </DynamicCartProvider>
      </NextUIProvider>
    </SessionProvider>
  )
}

export default Providers
