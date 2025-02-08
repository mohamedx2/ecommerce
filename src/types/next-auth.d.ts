import  { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      provider?: string
    } & DefaultSession["user"]
  }
}
