'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Upload,
  X,
  Copy,
  ExternalLink,
  Phone,
  Mail,
  Wifi,
  User,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useCameraScanner } from '@/lib/useCameraScanner'
import { parseQRCodeFromImage, normalizeContentType } from '@/lib/qr'
import { useQRHistory } from '@/lib/useLocalStorage'
import { QRContentType } from '@/lib/types'

interface ScanResult {
  content: string
  contentType: QRContentType
}

export function ScannerCard() {
  const { addHistoryItem, settings } = useQRHistory()
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    containerRef,
    isScanning,
    error: cameraError,
    hasPermission,
    startScanning,
    stopScanning,
    checkPermission,
  } = useCameraScanner({
    onScanSuccess: (decodedText) => {
      const contentType = normalizeContentType(decodedText)
      setScanResult({ content: decodedText, contentType })
      stopScanning()

      // Save to history
      addHistoryItem({
        type: 'scanned',
        contentType,
        content: decodedText,
        ...(settings.enableGeolocation && {
          location: getCurrentLocation(),
        }),
      })

      toast.success('QR code scanned successfully!')
    },
    onScanError: (error) => {
      console.error('Scan error:', error)
    },
  })

  const getCurrentLocation = (): { lat: number; lng: number } | undefined => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      // This would need to be async in real implementation
      return undefined
    }
    return undefined
  }

  const handleStartScan = async () => {
    if (hasPermission === false) {
      toast.error('Camera permission denied. Please allow camera access.')
      return
    }

    if (hasPermission === null) {
      const granted = await checkPermission()
      if (!granted) return
    }

    await startScanning()
  }

  const handleStopScan = () => {
    stopScanning()
    setScanResult(null)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file is too large. Please use an image smaller than 10MB.')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setIsProcessing(true)
    try {
      const decodedText = await parseQRCodeFromImage(file)
      
      if (!decodedText || decodedText.trim() === '') {
        throw new Error('QR code decoded but content is empty')
      }

      const contentType = normalizeContentType(decodedText)
      setScanResult({ content: decodedText, contentType })

      // Save to history
      addHistoryItem({
        type: 'scanned',
        contentType,
        content: decodedText,
      })

      toast.success('QR code decoded successfully!')
    } catch (error: any) {
      console.error('QR decode error:', error)
      const errorMessage = error?.message || 'Failed to decode QR code from image'
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleAction = (action: string, content: string) => {
    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(content)
        toast.success('Copied to clipboard!')
        break
      case 'open-url':
        if (content.startsWith('http://') || content.startsWith('https://')) {
          window.open(content, '_blank', 'noopener,noreferrer')
        }
        break
      case 'call':
        if (content.startsWith('tel:')) {
          window.location.href = content
        } else {
          window.location.href = `tel:${content}`
        }
        break
      case 'email':
        if (content.startsWith('mailto:')) {
          window.location.href = content
        } else {
          window.location.href = `mailto:${content}`
        }
        break
      default:
        break
    }
  }

  const getActionButtons = (result: ScanResult) => {
    const buttons = []

    if (result.contentType === 'url') {
      buttons.push(
        <button
          key="open"
          onClick={() => handleAction('open-url', result.content)}
          className="button-primary flex items-center gap-2 px-4 py-2.5 rounded-apple text-white font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          Open URL
        </button>
      )
    }

    if (result.contentType === 'phone') {
      buttons.push(
        <button
          key="call"
          onClick={() => handleAction('call', result.content)}
          className="button-primary flex items-center gap-2 px-4 py-2.5 rounded-apple text-white font-medium"
        >
          <Phone className="w-4 h-4" />
          Call
        </button>
      )
    }

    if (result.contentType === 'email') {
      buttons.push(
        <button
          key="email"
          onClick={() => handleAction('email', result.content)}
          className="button-primary flex items-center gap-2 px-4 py-2.5 rounded-apple text-white font-medium"
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
      )
    }

    buttons.push(
      <button
        key="copy"
        onClick={() => handleAction('copy', result.content)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-apple border-1.5 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-all font-medium"
      >
        <Copy className="w-4 h-4" />
        Copy
      </button>
    )

    return buttons
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-light dark:bg-surface-dark rounded-apple-lg p-8 border border-border-light/50 dark:border-border-dark/50 shadow-apple-lg card-hover"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-apple bg-gradient-to-br from-accent-light/10 to-accent-light/5 dark:from-accent-dark/20 dark:to-accent-dark/10">
          <Camera className="w-5 h-5 text-accent-light dark:text-accent-dark" />
        </div>
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
          QR Code Scanner
        </h2>
      </div>

      <div className="space-y-4">
        {/* Camera Scanner */}
        <div className="space-y-3">
          {!isScanning ? (
            <div className="bg-gradient-to-br from-bg-light to-surface-light dark:from-bg-dark dark:to-surface-dark rounded-apple-lg p-10 border border-border-light/50 dark:border-border-dark/50 text-center shadow-inner">
              <div className="p-4 rounded-full bg-accent-light/10 dark:bg-accent-dark/10 w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                <Camera className="w-10 h-10 text-accent-light dark:text-accent-dark" />
              </div>
              <p className="text-text-light/70 dark:text-text-dark/70 mb-6 font-medium">
                {cameraError
                  ? cameraError
                  : 'Click the button below to start scanning with your camera'}
              </p>
              <button
                onClick={handleStartScan}
                disabled={isProcessing}
                className="button-primary px-6 py-3 rounded-apple text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center gap-2 mx-auto"
              >
                <Camera className="w-5 h-5" />
                Start Camera Scanner
              </button>
            </div>
          ) : (
            <div className="relative">
              <div
                id="qr-reader"
                ref={containerRef}
                className="w-full rounded-apple-lg overflow-hidden border border-border-light dark:border-border-dark min-h-[300px] bg-black"
              />
              <button
                onClick={handleStopScan}
                className="absolute top-4 right-4 p-2 rounded-apple bg-red-500 text-white hover:bg-red-600 transition-colors z-10"
                aria-label="Stop scanning"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Upload Fallback */}
        <div className="relative">
          <div className="border-2 border-dashed border-border-light/50 dark:border-border-dark/50 rounded-apple-lg p-8 text-center bg-bg-light/30 dark:bg-bg-dark/30 hover:border-accent-light/50 dark:hover:border-accent-dark/50 transition-colors">
            <div className="p-3 rounded-full bg-accent-light/10 dark:bg-accent-dark/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Upload className="w-8 h-8 text-accent-light dark:text-accent-dark" />
            </div>
            <p className="text-sm text-text-light/70 dark:text-text-dark/70 mb-4 font-medium">
              Or upload an image with a QR code
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="qr-file-input"
            />
            <label
              htmlFor="qr-file-input"
              className="inline-block px-5 py-2.5 rounded-apple bg-surface-light dark:bg-surface-dark border-1.5 border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-all font-medium cursor-pointer shadow-sm hover:shadow-md"
            >
              {isProcessing ? 'Processing...' : 'Choose Image'}
            </label>
          </div>
        </div>

        {/* Scan Result */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-bg-light dark:bg-bg-dark rounded-apple-lg p-6 border border-border-light dark:border-border-dark"
            >
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">
                    Scan Successful
                  </h3>
                  <p className="text-sm text-text-light/70 dark:text-text-dark/70 capitalize mb-2">
                    Type: {scanResult.contentType}
                  </p>
                  <div className="bg-surface-light dark:bg-surface-dark rounded-apple p-3 break-all">
                    <p className="text-sm text-text-light dark:text-text-dark">{scanResult.content}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {getActionButtons(scanResult)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Permission Info */}
        {cameraError && hasPermission === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-apple p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-light dark:text-text-dark">
              <p className="font-medium mb-1">Camera Permission Required</p>
              <p className="text-text-light/70 dark:text-text-dark/70">
                Please allow camera access in your browser settings to use the scanner. You can
                still upload images to scan QR codes.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

