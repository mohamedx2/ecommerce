'use client'

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User
} from "@nextui-org/react"
import { signIn, signOut, useSession } from "next-auth/react"
import { UserCircle, LogOut, User as UserIcon, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AuthButton() {
  const { data: session, status } = useSession()

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/',
      redirect: true
    })
  }

  if (status === "loading") {
    return <Button isLoading variant="flat" size="sm">Loading...</Button>
  }

  if (session?.user) {
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button className="rounded-full">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <Avatar
                name={session.user.name || "User"}
                size="sm"
                className="transition-transform"
              />
            )}
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <User
              name={session.user.name}
              description={session.user.email}
              avatarProps={{
                src: session.user.image || undefined,
                size: "sm"
              }}
            />
          </DropdownItem>
          <DropdownItem key="settings" startContent={<Settings size={16} />}>
            <Link href="/profile">My Profile</Link>
          </DropdownItem>
          <DropdownItem key="orders" startContent={<UserIcon size={16} />}>
            <Link href="/orders">My Orders</Link>
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            startContent={<LogOut size={16} />}
            onClick={handleSignOut}
          >
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }

  return (
    <Button
      color="primary"
      variant="flat"
      onClick={() => signIn('google')}
      startContent={<UserCircle className="w-5 h-5" />}
      size="sm"
    >
      Sign In
    </Button>
  )
}
