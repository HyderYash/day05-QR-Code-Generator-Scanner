'use client'

import { QRHistoryItem } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Copy, QrCode, Clock, MapPin } from 'lucide-react'
import { toast } from 'react-toastify'

interface HistoryPanelProps {
  history: QRHistoryItem[]
  onDelete: (id: string) => void
  onClear: () => void
  onRegenerate: (item: QRHistoryItem) => void
}

export function HistoryPanel({ history, onDelete, onClear, onRegenerate }: HistoryPanelProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleClearHistory = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to clear all history?')) {
      onClear()
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-light dark:bg-surface-dark rounded-apple-lg p-6 border border-border-light/50 dark:border-border-dark/50 shadow-apple-lg card-hover"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-text-light dark:text-text-dark">History</h3>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-sm text-red-500 hover:text-red-600 transition-colors"
            aria-label="Clear history"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-text-light/50 dark:text-text-dark/50 text-center py-8">
          No history yet. Generate or scan a QR code to get started!
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-bg-light dark:bg-bg-dark rounded-apple p-4 border border-border-light dark:border-border-dark"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="w-4 h-4 text-accent-light dark:text-accent-dark flex-shrink-0" />
                      <span className="text-xs font-medium text-text-light/70 dark:text-text-dark/70 uppercase">
                        {item.type === 'generated' ? 'Generated' : 'Scanned'} • {item.contentType}
                      </span>
                    </div>
                    <p className="text-sm text-text-light dark:text-text-dark truncate mb-2">
                      {item.content}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-text-light/50 dark:text-text-dark/50">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.timestamp)}
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Location
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.type === 'generated' && (
                      <button
                        onClick={() => onRegenerate(item)}
                        className="p-2 hover:bg-surface-light dark:hover:bg-surface-dark rounded-apple transition-colors"
                        aria-label="Regenerate QR code"
                        title="Regenerate"
                      >
                        <QrCode className="w-4 h-4 text-accent-light dark:text-accent-dark" />
                      </button>
                    )}
                    <button
                      onClick={() => copyToClipboard(item.content)}
                      className="p-2 hover:bg-surface-light dark:hover:bg-surface-dark rounded-apple transition-colors"
                      aria-label="Copy content"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4 text-text-light dark:text-text-dark" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 hover:bg-surface-light dark:hover:bg-surface-dark rounded-apple transition-colors"
                      aria-label="Delete item"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

