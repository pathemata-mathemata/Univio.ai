import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UniVio - AI-Powered Course Planning',
  description: 'Intelligent transfer planning system for community college students',
  icons: {
    icon: '/images/univio-logo.png',
    shortcut: '/images/univio-logo.png',
    apple: '/images/univio-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 