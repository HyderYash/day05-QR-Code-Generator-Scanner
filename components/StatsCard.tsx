'use client'

import { useState, useEffect } from 'react'
import { QRHistoryItem, QRContentType } from '@/lib/types'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, FileText } from 'lucide-react'

interface StatsCardProps {
  history: QRHistoryItem[]
}

export function StatsCard({ history }: StatsCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const generated = history.filter((item) => item.type === 'generated').length
  const scanned = history.filter((item) => item.type === 'scanned').length

  const contentTypeCounts: Record<QRContentType, number> = {
    text: 0,
    url: 0,
    phone: 0,
    email: 0,
    vcard: 0,
    wifi: 0,
    sms: 0,
  }

  history.forEach((item) => {
    contentTypeCounts[item.contentType] = (contentTypeCounts[item.contentType] || 0) + 1
  })

  const mostCommon = Object.entries(contentTypeCounts).reduce(
    (a, b) => (contentTypeCounts[a[0] as QRContentType] > contentTypeCounts[b[0] as QRContentType] ? a : b),
    ['text', 0] as [string, number]
  )

  if (!mounted) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-apple-lg p-6 border border-border-light/50 dark:border-border-dark/50 shadow-apple-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-apple bg-gradient-to-br from-accent-light/10 to-accent-light/5 dark:from-accent-dark/20 dark:to-accent-dark/10">
            <BarChart3 className="w-5 h-5 text-accent-light dark:text-accent-dark" />
          </div>
          <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
            Statistics
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-bg-light dark:bg-bg-dark rounded-apple p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-accent-light dark:text-accent-dark" />
              <span className="text-sm text-text-light/70 dark:text-text-dark/70">Generated</span>
            </div>
            <p className="text-2xl font-bold text-text-light dark:text-text-dark">0</p>
          </div>
          <div className="bg-bg-light dark:bg-bg-dark rounded-apple p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-accent-light dark:text-accent-dark" />
              <span className="text-sm text-text-light/70 dark:text-text-dark/70">Scanned</span>
            </div>
            <p className="text-2xl font-bold text-text-light dark:text-text-dark">0</p>
          </div>
        </div>
        <div className="pt-4 border-t border-border-light dark:border-border-dark">
          <p className="text-sm text-text-light/70 dark:text-text-dark/70 mb-1">Most Common Type</p>
          <p className="text-lg font-semibold text-text-light dark:text-text-dark capitalize">
            text
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-light dark:bg-surface-dark rounded-apple-lg p-6 border border-border-light/50 dark:border-border-dark/50 shadow-apple-lg card-hover"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-apple bg-gradient-to-br from-accent-light/10 to-accent-light/5 dark:from-accent-dark/20 dark:to-accent-dark/10">
          <BarChart3 className="w-5 h-5 text-accent-light dark:text-accent-dark" />
        </div>
        <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
          Statistics
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-bg-light dark:bg-bg-dark rounded-apple p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-accent-light dark:text-accent-dark" />
            <span className="text-sm text-text-light/70 dark:text-text-dark/70">Generated</span>
          </div>
          <p className="text-2xl font-bold text-text-light dark:text-text-dark">{generated}</p>
        </div>

        <div className="bg-bg-light dark:bg-bg-dark rounded-apple p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-accent-light dark:text-accent-dark" />
            <span className="text-sm text-text-light/70 dark:text-text-dark/70">Scanned</span>
          </div>
          <p className="text-2xl font-bold text-text-light dark:text-text-dark">{scanned}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-border-light dark:border-border-dark">
        <p className="text-sm text-text-light/70 dark:text-text-dark/70 mb-1">Most Common Type</p>
        <p className="text-lg font-semibold text-text-light dark:text-text-dark capitalize">
          {mostCommon[0]}
        </p>
      </div>
    </motion.div>
  )
}

