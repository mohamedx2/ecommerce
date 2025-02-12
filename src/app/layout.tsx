import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import type { Metadata, Viewport } from 'next'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0070F3',
}

export const metadata: Metadata = {
  title: {
    template: '%s | Hamroun Store',
    default: 'Hamroun Store',
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
    <html lang="en" className={inter.className}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link 
          rel="preload" 
          href="/favicon/favicon.svg" 
          as="image" 
          type="image/svg+xml"
        />
        <link 
          rel="preload"
          href={inter.style.fontFamily}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical CSS */
          :root {
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
          }
          body {
            margin: 0;
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
          }
          h1 {
            font-family: ${inter.style.fontFamily};
            opacity: 0;
            animation: fadeIn 0.5s ease-in forwards;
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
        `}} />
      </head>
      <body>
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
