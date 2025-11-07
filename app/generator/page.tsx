'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { GeneratorCard } from '@/components/GeneratorCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import { QrCode, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function GeneratorContent() {
  const searchParams = useSearchParams()
  const [prefilledContent, setPrefilledContent] = useState<string | null>(null)

  useEffect(() => {
    const content = searchParams.get('content')
    if (content) {
      setPrefilledContent(decodeURIComponent(content))
    }
  }, [searchParams])

  return <GeneratorCard prefilledContent={prefilledContent} />
}

export default function GeneratorPage() {

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark transition-colors">
      <header className="sticky top-0 z-50 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-apple border-b border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 hover:bg-bg-light dark:hover:bg-bg-dark rounded-apple transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5 text-text-light dark:text-text-dark" />
              </Link>
              <QrCode className="w-8 h-8 text-accent-light dark:text-accent-dark" />
              <div>
                <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
                  QR Generator
                </h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <GeneratorContent />
        </Suspense>
      </main>
    </div>
  )
}

