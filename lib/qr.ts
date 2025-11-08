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
  const outputFormat = options.outputFormat || 'png'
  const mimeType = outputFormat === 'svg' ? 'image/svg+xml' : `image/${outputFormat}`

  const qrOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel,
    type: mimeType as any,
    margin: options.margin,
    color: {
      dark: options.foregroundColor,
      light: options.backgroundColor,
    },
    width: options.size,
  }

  // Add version if specified
  if (options.version) {
    qrOptions.version = options.version
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
 * Resize QR code image
 */
async function resizeQRCode(dataURL: string, targetSize: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataURL)
        return
      }
      canvas.width = targetSize
      canvas.height = targetSize
      ctx.drawImage(img, 0, 0, targetSize, targetSize)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(dataURL)
    img.src = dataURL
  })
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
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file')
  }

  // First try html5-qrcode
  try {
    const { Html5Qrcode } = await import('html5-qrcode')
    const html5QrCode = new Html5Qrcode('qr-file-scanner')

    try {
      // scanFile - try with verbose first, then without
      let decodedText: string | null = null

      try {
        decodedText = await html5QrCode.scanFile(file, true) // verbose = true
      } catch (e1: any) {
        try {
          decodedText = await html5QrCode.scanFile(file, false) // verbose = false
        } catch (e2: any) {
          console.log('html5-qrcode scanFile failed with both verbose settings')
          throw e2
        }
      }

      if (decodedText && decodedText.trim() !== '') {
        // Clean up before returning
        try {
          await html5QrCode.clear()
        } catch (e) {
          // Ignore cleanup errors
        }
        return decodedText.trim()
      }
    } catch (html5Error: any) {
      // html5-qrcode failed, will try jsQR fallback
      console.log('html5-qrcode scanFile failed:', html5Error?.message || html5Error)
      // Clean up html5-qrcode instance
      try {
        await html5QrCode.clear()
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  } catch (importError: any) {
    console.log('html5-qrcode import failed, using jsQR only:', importError?.message)
  }

  // Fallback to jsQR
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const imageData = e.target?.result
      if (!imageData || typeof imageData !== 'string') {
        reject(new Error('Failed to read image file'))
        return
      }

      try {
        // Use jsQR as fallback
        const { default: jsQR } = await import('jsqr')
        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d', { willReadFrequently: true })
            if (!ctx) {
              reject(new Error('Canvas context not available'))
              return
            }

            // Calculate optimal canvas size (max 1000px to avoid memory issues)
            const maxSize = 1000
            let width = img.width
            let height = img.height

            if (width > maxSize || height > maxSize) {
              const ratio = Math.min(maxSize / width, maxSize / height)
              width = Math.floor(width * ratio)
              height = Math.floor(height * ratio)
            }

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)

            // Get image data
            const imageData = ctx.getImageData(0, 0, width, height)

            // Try multiple inversion attempts for better detection
            let code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'attemptBoth',
            })

            if (!code) {
              // Try with different inversion settings
              code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'invertFirst',
              })
            }

            if (!code) {
              // Try without inversion
              code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
              })
            }

            if (!code) {
              // Try with onlyInvert
              code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'onlyInvert',
              })
            }

            if (code && code.data) {
              resolve(code.data.trim())
            } else {
              reject(new Error('No QR code found in image. Please ensure the image contains a clear, unobstructed QR code.'))
            }
          } catch (canvasError: any) {
            reject(new Error(`Canvas processing error: ${canvasError.message || 'Unknown error'}`))
          }
        }

        img.onerror = (err) => {
          reject(new Error('Failed to load image. Please ensure the file is a valid image.'))
        }

        img.src = imageData
      } catch (err: any) {
        reject(new Error(`Failed to import QR decoder: ${err.message || 'Unknown error'}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file. Please try a different image file.'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Format vCard data to string
 * vCard 3.0 format specification
 */
export function formatVCARD(data: VCARDData): string {
  // Escape special characters in vCard values
  const escapeValue = (value: string): string => {
    return value.replace(/[\\;,]/g, (match) => `\\${match}`).replace(/\n/g, '\\n')
  }

  let vcard = 'BEGIN:VCARD\r\n'
  vcard += 'VERSION:3.0\r\n'

  // Full name (required for display)
  if (data.firstName || data.lastName) {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim()
    if (fullName) {
      vcard += `FN:${escapeValue(fullName)}\r\n`
    }
    // Structured name: N:LastName;FirstName;MiddleName;Prefix;Suffix
    vcard += `N:${escapeValue(data.lastName || '')};${escapeValue(data.firstName || '')};;;\r\n`
  }

  // Organization
  if (data.organization) {
    vcard += `ORG:${escapeValue(data.organization)}\r\n`
  }

  // Phone (can have multiple, using TEL type)
  if (data.phone) {
    // Remove tel: prefix if present
    const phone = data.phone.replace(/^tel:/i, '').trim()
    vcard += `TEL:${escapeValue(phone)}\r\n`
  }

  // Email
  if (data.email) {
    // Remove mailto: prefix if present
    const email = data.email.replace(/^mailto:/i, '').trim()
    vcard += `EMAIL:${escapeValue(email)}\r\n`
  }

  // URL
  if (data.url) {
    // Ensure URL has protocol
    let url = data.url.trim()
    if (!url.match(/^https?:\/\//i)) {
      url = `https://${url}`
    }
    vcard += `URL:${escapeValue(url)}\r\n`
  }

  // Address (ADR format: ;;;street;city;state;postal;country)
  if (data.address) {
    vcard += `ADR:;;;${escapeValue(data.address)};;;\r\n`
  }

  vcard += 'END:VCARD\r\n'
  return vcard
}

/**
 * Format phone number to tel: URI
 */
export function formatPhone(phone: string): string {
  // Remove any existing tel: prefix
  const cleaned = phone.replace(/^tel:/i, '').trim()
  // Remove spaces, dashes, parentheses for cleaner format
  const normalized = cleaned.replace(/[\s\-()]/g, '')
  return `tel:${normalized}`
}

/**
 * Format email to mailto: URI
 */
export function formatEmail(email: string): string {
  // Remove any existing mailto: prefix
  const cleaned = email.replace(/^mailto:/i, '').trim()
  return `mailto:${cleaned}`
}

/**
 * Format SMS to sms: URI
 * Format: sms:<phone>?body=<message>
 */
export function formatSMS(phone: string, message?: string): string {
  // Remove any existing sms: or smsto: prefix
  const cleaned = phone.replace(/^(sms|smsto):/i, '').trim()
  // Remove spaces, dashes, parentheses
  const normalized = cleaned.replace(/[\s\-()]/g, '')

  if (message && message.trim()) {
    // URL encode the message
    const encodedMessage = encodeURIComponent(message.trim())
    return `sms:${normalized}?body=${encodedMessage}`
  }

  return `sms:${normalized}`
}

/**
 * Format WiFi data to string
 * Format: WIFI:T:<type>;S:<ssid>;P:<password>;H:<hidden>;;
 */
export function formatWiFi(data: WiFiData): string {
  // Escape special characters in SSID and password
  const escapeValue = (value: string): string => {
    return value.replace(/[\\;:,"]/g, (match) => `\\${match}`)
  }

  const ssid = escapeValue(data.ssid)
  const password = escapeValue(data.password || '')

  // Encryption type should be uppercase for WPA/WPA2, lowercase for nopass
  let security: string
  if (data.encryption === 'nopass') {
    security = 'nopass'
  } else if (data.encryption === 'WPA') {
    security = 'WPA' // Keep uppercase for WPA/WPA2
  } else {
    security = data.encryption.toUpperCase()
  }

  // Build the WiFi string
  let wifiString = `WIFI:T:${security};S:${ssid}`

  // Only add password if not nopass
  if (data.encryption !== 'nopass' && password) {
    wifiString += `;P:${password}`
  }

  // Only add hidden if true
  if (data.hidden) {
    wifiString += `;H:true`
  }

  // End with ;;
  wifiString += ';;'

  return wifiString
}

