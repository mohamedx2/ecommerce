'use client'

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Badge,
  Button,
} from "@nextui-org/react"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AuthButton from './AuthButton'
import { useCart } from '@/contexts/CartContext'

export default function Navbar() {
  const pathname = usePathname()
  const { itemsCount } = useCart()

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarBrand>
        <Link href="/" className="font-bold text-inherit">STORE</Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === '/products'}>
          <Link href="/products" className="text-foreground">Products</Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/categories'}>
          <Link href="/categories" className="text-foreground">Categories</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <AuthButton />
        </NavbarItem>
        <NavbarItem>
          <Badge
            content={itemsCount}
            color="primary"
            shape="circle"
            className={itemsCount === 0 ? 'hidden' : ''}
          >
            <Button
              as={Link}
              href="/cart"
              variant="light"
              startContent={<ShoppingCart />}
              className="min-w-0"
            >
              Cart
            </Button>
          </Badge>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  )
}
