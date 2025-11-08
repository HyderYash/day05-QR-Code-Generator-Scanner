export type QRContentType = 'text' | 'url' | 'phone' | 'email' | 'vcard' | 'wifi' | 'sms'

export interface QRHistoryItem {
  id: string
  type: 'generated' | 'scanned'
  contentType: QRContentType
  content: string
  timestamp: number
  metadata?: {
    size?: number
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    foregroundColor?: string
    backgroundColor?: string
  }
  location?: {
    lat: number
    lng: number
  }
}

export interface QRSettings {
  maxHistoryItems: number
  enableGeolocation: boolean
  defaultSize: number
  defaultErrorCorrection: 'L' | 'M' | 'Q' | 'H'
}

export interface QRGeneratorOptions {
  size: number
  margin: number
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  foregroundColor: string
  backgroundColor: string
  includeLogo?: boolean
  logoUrl?: string
  version?: number
  outputFormat?: 'png' | 'svg' | 'jpeg'
}

export interface VCARDData {
  firstName?: string
  lastName?: string
  organization?: string
  phone?: string
  email?: string
  url?: string
  address?: string
}

export interface WiFiData {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
  hidden?: boolean
}

