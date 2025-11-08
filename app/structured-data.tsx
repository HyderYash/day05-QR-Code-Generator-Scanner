'use client'

import { useEffect } from 'react'

export function StructuredData() {
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'QR Studio',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Generate and scan QR codes instantly. Free, fast, and beautiful QR code generator with Apple-inspired design.',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://qr-studio.vercel.app',
      author: {
        '@type': 'Person',
        name: 'Yash Sharma',
      },
      featureList: [
        'QR Code Generation',
        'QR Code Scanning',
        'Multiple Content Types (URL, WiFi, vCard, SMS, Email)',
        'Customizable Colors',
        'Multiple Output Formats (PNG, SVG, JPEG)',
        'No Registration Required',
      ],
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '1.0.0',
      releaseNotes: 'Initial release of QR Studio',
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}

