'use client'

import { Button } from "@nextui-org/react"
import { signOut } from "next-auth/react"

export default function SignOut() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-sm w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Sign Out</h1>
        <p className="text-gray-600 mb-6">
          Are you sure you want to sign out?
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            color="danger"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Yes, Sign Out
          </Button>
          <Button
            as="a"
            href="/"
            variant="bordered"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
