import QRCode from 'qrcode'
import { QRGeneratorOptions, QRContentType, VCARDData, WiFiData } from './types'

/**
 * Normalize content type based on input string
 */
export function normalizeContentType(content: string): QRContentType {
  const trimmed = content.trim().toLowerCase()

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return 'url'
  }
  if (trimmed.startsWith('tel:')) {
    return 'phone'
  }
  if (trimmed.startsWith('mailto:')) {
    return 'email'
  }
  if (trimmed.startsWith('smsto:')) {
    return 'sms'
  }
  if (trimmed.match(/^\+?[\d\s\-()]+$/)) {
    return 'phone'
  }
  if (trimmed.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return 'email'
  }

  return 'text'
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCodeDataURL(
  content: string,
  options: QRGeneratorOptions
): Promise<string> {
  const qrOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel,
    type: 'image/png',
    quality: 1,
    margin: options.margin,
    color: {
      dark: options.foregroundColor,
      light: options.backgroundColor,
    },
    width: options.size,
  }

  let qrDataURL = await QRCode.toDataURL(content, qrOptions)

  // If logo is requested, overlay it (simplified version)
  if (options.includeLogo && options.logoUrl) {
    // Note: Full logo overlay requires canvas manipulation
    // This is a simplified version - for production, use canvas API
    qrDataURL = await overlayLogo(qrDataURL, options.logoUrl, options.size)
  }

  return qrDataURL
}

/**
 * Overlay logo on QR code (simplified)
 */
async function overlayLogo(
  qrDataURL: string,
  logoUrl: string,
  qrSize: number
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve(qrDataURL)
      return
    }

    canvas.width = qrSize
    canvas.height = qrSize

    const qrImage = new Image()
    qrImage.onload = () => {
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize)

      const logoImage = new Image()
      logoImage.crossOrigin = 'anonymous'
      logoImage.onload = () => {
        const logoSize = qrSize * 0.2
        const logoX = (qrSize - logoSize) / 2
        const logoY = (qrSize - logoSize) / 2

        // Draw white circle background
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(qrSize / 2, qrSize / 2, logoSize / 2 + 4, 0, 2 * Math.PI)
        ctx.fill()

        // Draw logo
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)

        resolve(canvas.toDataURL('image/png'))
      }
      logoImage.onerror = () => resolve(qrDataURL)
      logoImage.src = logoUrl
    }
    qrImage.onerror = () => resolve(qrDataURL)
    qrImage.src = qrDataURL
  })
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(
  content: string,
  options: QRGeneratorOptions
): Promise<string> {
  return QRCode.toString(content, {
    type: 'svg',
    errorCorrectionLevel: options.errorCorrectionLevel,
    margin: options.margin,
    color: {
      dark: options.foregroundColor,
      light: options.backgroundColor,
    },
    width: options.size,
  })
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download data URL as PNG
 */
export function downloadDataURLAsPNG(dataURL: string, filename: string): void {
  fetch(dataURL)
    .then((res) => res.blob())
    .then((blob) => downloadBlob(blob, filename))
    .catch((err) => console.error('Download error:', err))
}

/**
 * Download SVG string as file
 */
export function downloadSVG(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  downloadBlob(blob, filename)
}

/**
 * Parse QR code from image file
 */
export async function parseQRCodeFromImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const imageData = e.target?.result
      if (!imageData || typeof imageData !== 'string') {
        reject(new Error('Failed to read image'))
        return
      }

      try {
        // Use jsQR for image decoding
        const { default: jsQR } = await import('jsqr')
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas context not available'))
            return
          }

          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)

          if (code) {
            resolve(code.data)
          } else {
            reject(new Error('No QR code found in image'))
          }
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = imageData
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Format vCard data to string
 */
export function formatVCARD(data: VCARDData): string {
  let vcard = 'BEGIN:VCARD\nVERSION:3.0\n'
  if (data.firstName || data.lastName) {
    vcard += `FN:${data.firstName || ''} ${data.lastName || ''}\n`
    vcard += `N:${data.lastName || ''};${data.firstName || ''};;;\n`
  }
  if (data.organization) vcard += `ORG:${data.organization}\n`
  if (data.phone) vcard += `TEL:${data.phone}\n`
  if (data.email) vcard += `EMAIL:${data.email}\n`
  if (data.url) vcard += `URL:${data.url}\n`
  if (data.address) vcard += `ADR:;;${data.address};;;\n`
  vcard += 'END:VCARD'
  return vcard
}

/**
 * Format WiFi data to string
 */
export function formatWiFi(data: WiFiData): string {
  const security = data.encryption === 'nopass' ? 'nopass' : data.encryption.toLowerCase()
  return `WIFI:T:${security};S:${data.ssid};P:${data.password};H:${data.hidden ? 'true' : 'false'};;`
}

