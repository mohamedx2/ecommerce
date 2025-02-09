import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export const config = {
  matcher: [
    "/profile/:path*",
    "/cart/:path*",
    "/orders/:path*",
    "/admin/:path*"  // Also protect admin routes
  ],
}
