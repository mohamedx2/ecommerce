'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface CartItem {
  product: {
    _id: string  // Add the MongoDB _id
    id: string
    name: string
    price: number
    image: string
  }
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  total: number
  itemsCount: number
  isLoading: boolean
  refresh: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    if (status === 'authenticated' && session?.user) {
      try {
        setIsLoading(true)
        const res = await fetch('/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin'
        })
        
        if (!res.ok) {
          if (res.status === 401) {
            // Handle unauthorized silently
            setItems([])
            return
          }
          const error = await res.json()
          throw new Error(error.error || 'Failed to fetch cart')
        }
        
        const data = await res.json()
        setItems(data.items || [])
      } catch (error) {
        console.error('Cart fetch error:', error)
        // Only show error toast for non-auth errors
        if (error instanceof Error && !error.message.includes('Unauthorized')) {
          toast.error('Failed to load cart')
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      setItems([])
      setIsLoading(false)
    }
  }, [status, session])

  useEffect(() => {
    fetchCart()
  }, [status, session, fetchCart]) // remove fetchCart from dependency array

  const addItem = async (productId: string, quantity: number) => {
    if (!session?.user) {
      toast.error('Please sign in to add items to cart')
      return
    }

    try {
      const payload = { productId, quantity }

      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add item')
      }
      
      setItems(data.items || [])
      toast.success('Added to cart')
    } catch (error) {
      console.error('Add item error:', error)
      toast.error('Failed to add item to cart')
    }
  }

  const removeItem = async (productId: string) => {
    if (!session?.user) {
      toast.error('Please sign in to remove item')
      return
    }

    try {
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to remove item')
      }

      // Update local state immediately
      setItems(prev => prev.filter(item => item.product._id !== productId))
      await refresh()
      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Remove item error:', error)
      toast.error('Failed to remove item')
      // Refresh cart to ensure sync with server
      await fetchCart()
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session?.user) {
      toast.error('Please sign in to update cart')
      return
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ productId, quantity })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setItems(data.items || [])
      // Don't await refresh here
      refresh()
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update cart')
    }
  }

  const refresh = useCallback(async () => {
    if (!session?.user) return
    try {
      const res = await fetch('/api/cart', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
      })
      if (res.ok) {
        const data = await res.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Refresh error:', error)
    }
  }, [session?.user])

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const itemsCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      total,
      itemsCount,
      isLoading,
      refresh
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
