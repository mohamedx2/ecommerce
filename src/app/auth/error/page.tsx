'use client'

import { Button } from "@nextui-org/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-sm w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Authentication Error</h1>
        <div className="mb-6 text-center">
          <p className="text-red-600">
            {error === "Configuration" && "There is a problem with the server configuration."}
            {error === "AccessDenied" && "Access denied. You do not have permission to sign in."}
            {error === "Verification" && "The verification link was invalid or has expired."}
            {!error && "An unknown error occurred."}
          </p>
        </div>
        <Button
          as={Link}
          href="/auth/signin"
          color="primary"
          variant="shadow"
          className="w-full"
          size="lg"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
