import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
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
