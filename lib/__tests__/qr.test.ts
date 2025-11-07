import { describe, it, expect } from 'vitest'
import { normalizeContentType, formatVCARD, formatWiFi } from '../qr'
import type { VCARDData, WiFiData } from '../types'

describe('QR Utilities', () => {
  describe('normalizeContentType', () => {
    it('should detect URLs', () => {
      expect(normalizeContentType('https://example.com')).toBe('url')
      expect(normalizeContentType('http://example.com')).toBe('url')
    })

    it('should detect phone numbers', () => {
      expect(normalizeContentType('+1234567890')).toBe('phone')
      expect(normalizeContentType('tel:+1234567890')).toBe('phone')
    })

    it('should detect emails', () => {
      expect(normalizeContentType('test@example.com')).toBe('email')
      expect(normalizeContentType('mailto:test@example.com')).toBe('email')
    })

    it('should default to text for other content', () => {
      expect(normalizeContentType('Hello World')).toBe('text')
    })
  })

  describe('formatVCARD', () => {
    it('should format vCard correctly', () => {
      const data: VCARDData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        email: 'john@example.com',
      }

      const vcard = formatVCARD(data)
      expect(vcard).toContain('BEGIN:VCARD')
      expect(vcard).toContain('END:VCARD')
      expect(vcard).toContain('FN:John Doe')
      expect(vcard).toContain('N:Doe;John;;;')
      expect(vcard).toContain('TEL:+1234567890')
      expect(vcard).toContain('EMAIL:john@example.com')
    })
  })

  describe('formatWiFi', () => {
    it('should format WiFi credentials correctly', () => {
      const data: WiFiData = {
        ssid: 'MyNetwork',
        password: 'MyPassword',
        encryption: 'WPA',
      }

      const wifi = formatWiFi(data)
      expect(wifi).toContain('WIFI:')
      expect(wifi).toContain('T:wpa')
      expect(wifi).toContain('S:MyNetwork')
      expect(wifi).toContain('P:MyPassword')
    })

    it('should handle no password', () => {
      const data: WiFiData = {
        ssid: 'OpenNetwork',
        password: '',
        encryption: 'nopass',
      }

      const wifi = formatWiFi(data)
      expect(wifi).toContain('T:nopass')
    })
  })
})

