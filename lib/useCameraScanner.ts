import { useEffect, useRef, useState, useCallback } from 'react'

export interface UseCameraScannerOptions {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (error: string) => void
  fps?: number
}

export function useCameraScanner({
  onScanSuccess,
  onScanError,
  fps = 10,
}: UseCameraScannerOptions) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const scannerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const startScanning = useCallback(async () => {
    if (!containerRef.current) {
      setError('Scanner container not found')
      return
    }

    try {
      // Dynamically import html5-qrcode
      const { Html5Qrcode } = await import('html5-qrcode')

      // Ensure container has an ID
      if (!containerRef.current.id) {
        containerRef.current.id = 'qr-reader-' + Date.now()
      }

      const html5QrCode = new Html5Qrcode(containerRef.current.id)

      const config = {
        fps,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
      }

      // Try to get available cameras first, fallback to facingMode
      let cameraId: string | { facingMode: string }
      try {
        const devices = await Html5Qrcode.getCameras()
        cameraId = devices.length > 0 ? devices[0].id : { facingMode: 'environment' }
      } catch {
        cameraId = { facingMode: 'environment' }
      }

      await html5QrCode.start(
        cameraId,
        config,
        (decodedText) => {
          onScanSuccess(decodedText)
        },
        (errorMessage) => {
          // Ignore not found errors (they're expected while scanning)
          if (!errorMessage.includes('No QR code found') && !errorMessage.includes('NotFoundException')) {
            // Only log actual errors, not scanning attempts
            console.debug('Scan attempt:', errorMessage)
          }
        }
      )

      scannerRef.current = html5QrCode
      setIsScanning(true)
      setError(null)
      setHasPermission(true)
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to start camera'
      setError(errorMessage)
      setHasPermission(false)

      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setError('Camera permission denied. Please allow camera access in your browser settings.')
      } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('DevicesNotFound')) {
        setError('No camera found. Please use the image upload option instead.')
      } else {
        setError(`Camera error: ${errorMessage}`)
      }
    }
  }, [fps, onScanSuccess, onScanError])

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        await scannerRef.current.clear()
        scannerRef.current = null
        setIsScanning(false)
        setError(null)
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
  }, [])

  const checkPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())
      setHasPermission(true)
      return true
    } catch (err: any) {
      setHasPermission(false)
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found')
      } else {
        setError('Unable to access camera')
      }
      return false
    }
  }, [])

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [stopScanning])

  return {
    containerRef,
    isScanning,
    error,
    hasPermission,
    startScanning,
    stopScanning,
    checkPermission,
  }
}

