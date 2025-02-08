'use client'

import { Button } from "@nextui-org/react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SignInContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: true
      })
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-sm w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        {error === "OAuthAccountNotLinked" && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            <p>This email is already associated with an account.</p>
            <p>Please sign in with your original provider.</p>
          </div>
        )}
        <Button
          color="primary"
          variant="shadow"
          className="w-full"
          size="lg"
          onPress={handleGoogleSignIn}
        >
          Continue with Google
        </Button>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  )
}
