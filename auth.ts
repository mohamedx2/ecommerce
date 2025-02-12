import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import Google from "next-auth/providers/google"
import clientPromise from "@/lib/mongodb-adapter"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET??"",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn({ user: _user, account, profile: _profile }) {
      // Allow all Google sign-ins
      if (account?.provider === "google") {
        return true
      }
      return false
    }
  },
  pages: {
    error: '/auth/error',
    signIn: '/auth/signin',
  }
})
