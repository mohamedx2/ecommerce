'use client'

import { useSession } from "next-auth/react"
import { Card, CardBody, Avatar, Button } from "@nextui-org/react"
import { Settings, Package } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardBody className="flex flex-col items-center gap-4 p-8">
          <Avatar
            src={session.user.image || undefined}
            name={session.user.name || "User"}
            size="lg"
            className="w-24 h-24 text-2xl"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold">{session.user.name}</h1>
            <p className="text-default-500">{session.user.email}</p>
          </div>
          
          <div className="flex gap-4 mt-4">
            <Button
              as={Link}
              href="/profile/settings"
              color="primary"
              startContent={<Settings size={20} />}
            >
              Settings
            </Button>
            <Button
              as={Link}
              href="/orders"
              variant="bordered"
              startContent={<Package size={20} />}
            >
              My Orders
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
