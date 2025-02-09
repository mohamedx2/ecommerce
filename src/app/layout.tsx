import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Your Store Name',
    default: 'Your Store Name',
  },
  description: 'Modern ecommerce store built with Next.js',
  icons: {
    icon: [
      {
        rel: 'icon',
        url: '/favicon/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        rel: 'icon',
        url: '/favicon/favicon.ico',
        sizes: 'any',
      },
    ],
    apple: {
      url: '/favicon/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
  manifest: '/favicon/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="container mx-auto max-w-7xl pt-16 px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
