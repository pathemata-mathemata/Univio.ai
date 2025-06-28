import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SEOStructuredData from '@/components/SEOStructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UniVio - AI-Powered Course Planning',
  description: 'Navigate your community college to university transfer journey with intelligent course planning, real-time requirements analysis, and personalized recommendations.',
  keywords: ['college transfer', 'course planning', 'AI education', 'university transfer', 'community college', 'academic planning', 'ASSIST.org', 'transfer requirements'],
  authors: [{ name: 'UniVio Team' }],
  creator: 'UniVio',
  publisher: 'UniVio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://univio.ai'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/univio-logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://univio.ai',
    title: 'UniVio - AI-Powered Course Planning',
    description: 'Navigate your community college to university transfer journey with intelligent course planning, real-time requirements analysis, and personalized recommendations.',
    siteName: 'UniVio',
    images: [
      {
        url: '/images/univio-logo.png',
        width: 1200,
        height: 630,
        alt: 'UniVio - AI-Powered Course Planning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniVio - AI-Powered Course Planning',
    description: 'Navigate your community college to university transfer journey with intelligent course planning, real-time requirements analysis, and personalized recommendations.',
    images: ['/images/univio-logo.png'],
    creator: '@univio_ai',
  },
  verification: {
    google: 'your-google-site-verification-code', // Replace with actual verification code
    yandex: 'your-yandex-verification-code', // Replace with actual verification code
    yahoo: 'your-yahoo-verification-code', // Replace with actual verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <SEOStructuredData />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 