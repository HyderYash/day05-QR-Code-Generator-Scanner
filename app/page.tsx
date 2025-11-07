'use client'

import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'
import { GeneratorCard } from '@/components/GeneratorCard'
import { ScannerCard } from '@/components/ScannerCard'
import { QrCode } from 'lucide-react'

export default function Home() {

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-xl border-b border-border-light/50 dark:border-border-dark/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-2 rounded-apple bg-gradient-to-br from-accent-light to-accent-dark/80 dark:from-accent-dark dark:to-accent-dark/60 shadow-lg">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-text-light to-text-light/80 dark:from-text-dark dark:to-text-dark/80 bg-clip-text text-transparent">
                  QR Studio 🍏
                </h1>
                <p className="text-xs text-text-light/60 dark:text-text-dark/60 font-medium mt-0.5">
                  QR Generator & Scanner — Day 5 of #100Days100Projects
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-10">
          {/* Generator and Scanner */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <GeneratorCard />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ScannerCard />
            </motion.div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border-light/50 dark:border-border-dark/50 bg-surface-light/50 dark:bg-surface-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-text-light/60 dark:text-text-dark/60 font-medium">
            Built with ❤️ by <span className="text-accent-light dark:text-accent-dark font-semibold">Yash Sharma</span> 🍏 — #100Days100Projects
          </p>
        </div>
      </footer>
    </div>
  )
}

