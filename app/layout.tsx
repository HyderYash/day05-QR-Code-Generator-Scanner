import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { StructuredData } from './structured-data'
import { RegisterServiceWorker } from './register-sw'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#007AFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A84FF' },
  ],
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://qr-studio.vercel.app'),
  title: {
    default: 'QR Studio — Premium QR Code Generator & Scanner',
    template: '%s | QR Studio',
  },
  description: 'Generate and scan QR codes instantly. Free, fast, and beautiful QR code generator with Apple-inspired design. Create QR codes for URLs, WiFi, vCard, SMS, email, and more. No registration required.',
  keywords: [
    'QR code generator',
    'QR code scanner',
    'QR code maker',
    'free QR code',
    'QR code creator',
    'QR code online',
    'QR code WiFi',
    'QR code vCard',
    'QR code scanner online',
    'generate QR code',
    'create QR code',
    'QR code tool',
  ],
  authors: [{ name: 'Yash Sharma' }],
  creator: 'Yash Sharma',
  publisher: 'Yash Sharma',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'QR Studio',
    title: 'QR Studio — Premium QR Code Generator & Scanner',
    description: 'Generate and scan QR codes instantly. Free, fast, and beautiful QR code generator with Apple-inspired design.',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'QR Studio Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Studio — Premium QR Code Generator & Scanner',
    description: 'Generate and scan QR codes instantly. Free, fast, and beautiful QR code generator.',
    images: ['/android-chrome-512x512.png'],
    creator: '@yashsharma',
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
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QR Studio',
  },
  category: 'utility',
  classification: 'QR Code Generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QR Studio" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="QR Studio" />
        <meta name="msapplication-TileColor" content="#007AFF" />
        <meta name="msapplication-TileImage" content="/android-chrome-192x192.png" />
        <meta name="theme-color" content="#007AFF" />
      </head>
      <body className={inter.className}>
        <StructuredData />
        <RegisterServiceWorker />
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  )
}

