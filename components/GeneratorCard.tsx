'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Download,
    Copy,
    QrCode,
    Settings,
    FileDown,
    Palette,
    Zap,
} from 'lucide-react'
import { toast } from 'react-toastify'
import {
    generateQRCodeDataURL,
    generateQRCodeSVG,
    downloadDataURLAsPNG,
    downloadSVG,
    normalizeContentType,
    formatVCARD,
    formatWiFi,
    formatPhone,
    formatEmail,
    formatSMS,
} from '@/lib/qr'
import { QRGeneratorOptions, QRContentType, VCARDData, WiFiData } from '@/lib/types'

interface GeneratorCardProps {
    prefilledContent?: string | null
}

export function GeneratorCard({ prefilledContent }: GeneratorCardProps) {
    const [content, setContent] = useState(prefilledContent || '')
    const [contentType, setContentType] = useState<QRContentType>('text')
    const [qrDataURL, setQrDataURL] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showAdvanced, setShowAdvanced] = useState(false)

    // Generator options
    const [options, setOptions] = useState<QRGeneratorOptions>({
        size: 256,
        margin: 4,
        errorCorrectionLevel: 'M',
        foregroundColor: '#007AFF',
        backgroundColor: '#FFFFFF',
        includeLogo: false,
        outputFormat: 'png',
    })

    // Form data for structured types
    const [vcardData, setVcardData] = useState<VCARDData>({})
    const [wifiData, setWifiData] = useState<WiFiData>({
        ssid: '',
        password: '',
        encryption: 'WPA',
    })

    // Generate QR code function
    const generateQR = async () => {
        if (!content.trim() && contentType !== 'vcard' && contentType !== 'wifi') {
            toast.error('Please enter content to generate QR code')
            return
        }

        setIsGenerating(true)
        try {
            let qrContent = content

            // Format content based on type
            if (contentType === 'vcard') {
                if (!vcardData.firstName && !vcardData.lastName && !vcardData.phone && !vcardData.email) {
                    toast.error('Please fill in at least one vCard field')
                    setIsGenerating(false)
                    return
                }
                qrContent = formatVCARD(vcardData)
            } else if (contentType === 'wifi') {
                if (!wifiData.ssid) {
                    toast.error('Please enter WiFi network name (SSID)')
                    setIsGenerating(false)
                    return
                }
                qrContent = formatWiFi(wifiData)
            } else if (contentType === 'phone') {
                if (!content.trim()) {
                    toast.error('Please enter a phone number')
                    setIsGenerating(false)
                    return
                }
                qrContent = formatPhone(content)
            } else if (contentType === 'email') {
                if (!content.trim()) {
                    toast.error('Please enter an email address')
                    setIsGenerating(false)
                    return
                }
                qrContent = formatEmail(content)
            } else if (contentType === 'sms') {
                if (!content.trim()) {
                    toast.error('Please enter a phone number')
                    setIsGenerating(false)
                    return
                }
                // For SMS, split phone and message if provided
                const parts = content.split(/\s+/)
                const phone = parts[0]
                const message = parts.slice(1).join(' ')
                qrContent = formatSMS(phone, message || undefined)
            } else if (contentType === 'url') {
                if (!content.trim()) {
                    toast.error('Please enter a URL')
                    setIsGenerating(false)
                    return
                }
                // Ensure URL has protocol
                if (!content.match(/^https?:\/\//i)) {
                    qrContent = `https://${content}`
                }
            } else if (contentType === 'text') {
                if (!content.trim()) {
                    toast.error('Please enter text')
                    setIsGenerating(false)
                    return
                }
            }

            const dataURL = await generateQRCodeDataURL(qrContent, options)
            setQrDataURL(dataURL)
            toast.success('QR code generated successfully!')
        } catch (error) {
            console.error('Error generating QR code:', error)
            toast.error('Failed to generate QR code')
        } finally {
            setIsGenerating(false)
        }
    }

    // Handle prefilled content
    useEffect(() => {
        if (prefilledContent && prefilledContent !== content) {
            setContent(prefilledContent)
            const detected = normalizeContentType(prefilledContent)
            setContentType(detected)
        }
    }, [prefilledContent, content])

    // Auto-detect content type
    useEffect(() => {
        if (contentType === 'text' && content.trim()) {
            const detected = normalizeContentType(content)
            if (detected !== 'text') {
                setContentType(detected)
            }
        }
    }, [content, contentType])

    const handleDownload = async () => {
        if (!qrDataURL || !content.trim()) return

        try {
            let qrContent = content
            if (contentType === 'vcard') {
                qrContent = formatVCARD(vcardData)
            } else if (contentType === 'wifi') {
                qrContent = formatWiFi(wifiData)
            } else if (contentType === 'phone') {
                qrContent = formatPhone(content)
            } else if (contentType === 'email') {
                qrContent = formatEmail(content)
            } else if (contentType === 'sms') {
                const parts = content.split(/\s+/)
                const phone = parts[0]
                const message = parts.slice(1).join(' ')
                qrContent = formatSMS(phone, message || undefined)
            } else if (contentType === 'url') {
                if (!content.match(/^https?:\/\//i)) {
                    qrContent = `https://${content}`
                }
            }

            const outputFormat = options.outputFormat || 'png'

            if (outputFormat === 'svg') {
                const svg = await generateQRCodeSVG(qrContent, options)
                downloadSVG(svg, `qr-code-${Date.now()}.svg`)
                toast.success('QR code downloaded as SVG!')
            } else if (outputFormat === 'jpeg') {
                // Convert PNG to JPEG
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    if (ctx) {
                        canvas.width = img.width
                        canvas.height = img.height
                        ctx.fillStyle = options.backgroundColor
                        ctx.fillRect(0, 0, canvas.width, canvas.height)
                        ctx.drawImage(img, 0, 0)
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `qr-code-${Date.now()}.jpg`
                                a.click()
                                URL.revokeObjectURL(url)
                                toast.success('QR code downloaded as JPEG!')
                            }
                        }, 'image/jpeg', 0.92)
                    }
                }
                img.onerror = () => toast.error('Failed to convert to JPEG')
                img.src = qrDataURL
            } else {
                downloadDataURLAsPNG(qrDataURL, `qr-code-${Date.now()}.png`)
                toast.success('QR code downloaded as PNG!')
            }
        } catch (error) {
            toast.error('Failed to download QR code')
        }
    }

    const handleCopy = () => {
        if (!qrDataURL) return
        fetch(qrDataURL)
            .then((res) => res.blob())
            .then((blob) => {
                navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob,
                    }),
                ])
                toast.success('QR code copied to clipboard!')
            })
            .catch(() => {
                toast.error('Failed to copy QR code')
            })
    }


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-light dark:bg-surface-dark rounded-apple-lg p-8 border border-border-light/50 dark:border-border-dark/50 shadow-apple-lg card-hover"
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-apple bg-gradient-to-br from-accent-light/10 to-accent-light/5 dark:from-accent-dark/20 dark:to-accent-dark/10">
                    <QrCode className="w-5 h-5 text-accent-light dark:text-accent-dark" />
                </div>
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                    QR Code Generator
                </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                            Content Type
                        </label>
                        <select
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value as QRContentType)}
                            className="input-field w-full px-4 py-2.5 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-medium"
                        >
                            <option value="text">Text</option>
                            <option value="url">URL</option>
                            <option value="phone">Phone</option>
                            <option value="email">Email</option>
                            <option value="vcard">vCard</option>
                            <option value="wifi">WiFi</option>
                            <option value="sms">SMS</option>
                        </select>
                    </div>

                    {contentType === 'vcard' ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={vcardData.firstName || ''}
                                onChange={(e) => setVcardData({ ...vcardData, firstName: e.target.value })}
                                className="input-field w-full px-4 py-2.5 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={vcardData.lastName || ''}
                                onChange={(e) => setVcardData({ ...vcardData, lastName: e.target.value })}
                                className="input-field w-full px-4 py-2.5 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                value={vcardData.phone || ''}
                                onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                                className="input-field w-full px-4 py-2.5 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={vcardData.email || ''}
                                onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                                className="input-field w-full px-4 py-2.5 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                            />
                        </div>
                    ) : contentType === 'wifi' ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="SSID (Network Name)"
                                value={wifiData.ssid}
                                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                                className="input-field w-full px-4 py-2.5 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={wifiData.password}
                                onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                                className="input-field w-full px-4 py-2.5 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                            />
                            <select
                                value={wifiData.encryption}
                                onChange={(e) =>
                                    setWifiData({ ...wifiData, encryption: e.target.value as WiFiData['encryption'] })
                                }
                                className="input-field w-full px-4 py-2.5 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                            >
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">No Password</option>
                            </select>
                        </div>
                    ) : (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter text, URL, phone number, or email..."
                            rows={6}
                            className="input-field w-full px-4 py-3 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark resize-none"
                        />
                    )}

                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 text-sm text-accent-light dark:text-accent-dark hover:opacity-80 transition-opacity"
                        >
                            <Settings className="w-4 h-4" />
                            Advanced Options
                        </button>
                        <button
                            onClick={generateQR}
                            disabled={isGenerating}
                            className="button-primary flex items-center gap-2 px-6 py-2.5 rounded-apple text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            <QrCode className="w-4 h-4" />
                            {isGenerating ? 'Generating...' : 'Generate QR Code'}
                        </button>
                    </div>

                    {showAdvanced && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-6 pt-4 border-t border-border-light dark:border-border-dark"
                        >
                            {/* Size & Dimensions Section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-text-light dark:text-text-dark flex items-center gap-2">
                                    <div className="w-1 h-4 bg-accent-light dark:bg-accent-dark rounded-full" />
                                    Size & Dimensions
                                </h3>
                                <div className="grid grid-cols-2 gap-3 pl-3">
                                    <div>
                                        <label className="block text-xs text-text-light/70 dark:text-text-dark/70 mb-1">
                                            Size (px)
                                        </label>
                                        <input
                                            type="number"
                                            min="100"
                                            max="2000"
                                            step="10"
                                            value={options.size}
                                            onChange={(e) =>
                                                setOptions({ ...options, size: parseInt(e.target.value) || 256 })
                                            }
                                            className="input-field w-full px-3 py-2 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                                        />
                                        <div className="flex gap-1 mt-1">
                                            {[256, 512, 768, 1024].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setOptions({ ...options, size })}
                                                    className="text-xs px-2 py-1 rounded bg-surface-light dark:bg-surface-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-colors text-text-light/70 dark:text-text-dark/70"
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-text-light/70 dark:text-text-dark/70 mb-1">
                                            Margin
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={options.margin}
                                            onChange={(e) =>
                                                setOptions({ ...options, margin: parseInt(e.target.value) || 4 })
                                            }
                                            className="input-field w-full px-3 py-2 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                                        />
                                    </div>
                                </div>

                                {/* QR Code Settings Section */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-text-light dark:text-text-dark flex items-center gap-2">
                                        <div className="w-1 h-4 bg-accent-light dark:bg-accent-dark rounded-full" />
                                        QR Code Settings
                                    </h3>
                                    <div className="pl-3 space-y-3">
                                        {/* Error Correction Level */}
                                        <div>
                                            <label className="text-xs text-text-light/70 dark:text-text-dark/70 mb-1 flex items-center gap-1">
                                                <Zap className="w-3 h-3" />
                                                Error Correction Level
                                            </label>
                                            <select
                                                value={options.errorCorrectionLevel}
                                                onChange={(e) =>
                                                    setOptions({
                                                        ...options,
                                                        errorCorrectionLevel: e.target.value as QRGeneratorOptions['errorCorrectionLevel'],
                                                    })
                                                }
                                                className="input-field w-full px-3 py-2 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                                            >
                                                <option value="L">Low (L) - ~7% recovery</option>
                                                <option value="M">Medium (M) - ~15% recovery</option>
                                                <option value="Q">Quartile (Q) - ~25% recovery</option>
                                                <option value="H">High (H) - ~30% recovery</option>
                                            </select>
                                            <p className="text-xs text-text-light/50 dark:text-text-dark/50 mt-1">
                                                Higher levels allow more damage/obstruction but increase QR code size
                                            </p>
                                        </div>

                                        {/* QR Code Version */}
                                        <div>
                                            <label className="text-xs font-medium text-text-light dark:text-text-dark mb-2 flex items-center gap-1">
                                                <QrCode className="w-3.5 h-3.5 text-accent-light dark:text-accent-dark" />
                                                QR Code Version
                                            </label>
                                            <select
                                                value={options.version || 'auto'}
                                                onChange={(e) =>
                                                    setOptions({
                                                        ...options,
                                                        version: e.target.value === 'auto' ? undefined : parseInt(e.target.value),
                                                    })
                                                }
                                                className="input-field w-full px-3 py-2 rounded-apple bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                                            >
                                                <option value="auto">Auto (Recommended)</option>
                                                {Array.from({ length: 40 }, (_, i) => i + 1).map((v) => (
                                                    <option key={v} value={v}>
                                                        Version {v}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-text-light/50 dark:text-text-dark/50 mt-1">
                                                Higher versions support more data but create larger QR codes
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Colors & Appearance Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-text-light dark:text-text-dark flex items-center gap-2">
                                        <div className="w-1 h-4 bg-accent-light dark:bg-accent-dark rounded-full" />
                                        Colors & Appearance
                                    </h3>
                                    <div className="pl-3 space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-text-light dark:text-text-dark mb-2 flex items-center gap-1">
                                                <Palette className="w-3.5 h-3.5 text-accent-light dark:text-accent-dark" />
                                                Foreground Color
                                            </label>
                                            <div className="bg-bg-light dark:bg-bg-dark rounded-apple-lg p-3 border border-border-light/50 dark:border-border-dark/50">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="relative">
                                                        <input
                                                            type="color"
                                                            value={options.foregroundColor}
                                                            onChange={(e) => setOptions({ ...options, foregroundColor: e.target.value })}
                                                            className="h-12 w-12 rounded-apple border-2 border-border-light dark:border-border-dark cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                                                            style={{ backgroundColor: options.foregroundColor }}
                                                        />
                                                        <div className="absolute inset-0 rounded-apple border-2 border-white dark:border-black pointer-events-none" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={options.foregroundColor}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                                                setOptions({ ...options, foregroundColor: value || '#000000' })
                                                            }
                                                        }}
                                                        className="input-field flex-1 px-3 py-2 rounded-apple bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark text-sm font-mono"
                                                        placeholder="#000000"
                                                        maxLength={7}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-text-light/50 dark:text-text-dark/50">Presets:</span>
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {['#000000', '#007AFF', '#FF3B30', '#34C759', '#FF9500', '#AF52DE', '#5856D6'].map((color) => (
                                                            <button
                                                                key={color}
                                                                onClick={() => setOptions({ ...options, foregroundColor: color })}
                                                                className={`w-7 h-7 rounded-apple border-2 transition-all hover:scale-110 ${options.foregroundColor.toUpperCase() === color.toUpperCase()
                                                                    ? 'border-accent-light dark:border-accent-dark ring-2 ring-accent-light/20 dark:ring-accent-dark/20'
                                                                    : 'border-border-light dark:border-border-dark'
                                                                    }`}
                                                                style={{ backgroundColor: color }}
                                                                title={color}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-text-light dark:text-text-dark mb-2 flex items-center gap-1">
                                                <Palette className="w-3.5 h-3.5 text-accent-light dark:text-accent-dark" />
                                                Background Color
                                            </label>
                                            <div className="bg-bg-light dark:bg-bg-dark rounded-apple-lg p-3 border border-border-light/50 dark:border-border-dark/50">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="relative">
                                                        <input
                                                            type="color"
                                                            value={options.backgroundColor}
                                                            onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                                                            className="h-12 w-12 rounded-apple border-2 border-border-light dark:border-border-dark cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                                                            style={{ backgroundColor: options.backgroundColor }}
                                                        />
                                                        <div className="absolute inset-0 rounded-apple border-2 border-white dark:border-black pointer-events-none" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={options.backgroundColor}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                                                setOptions({ ...options, backgroundColor: value || '#FFFFFF' })
                                                            }
                                                        }}
                                                        className="input-field flex-1 px-3 py-2 rounded-apple bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark text-sm font-mono"
                                                        placeholder="#FFFFFF"
                                                        maxLength={7}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-text-light/50 dark:text-text-dark/50">Presets:</span>
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {['#FFFFFF', '#F5F5F7', '#000000', '#1C1C1E', '#F0F0F0', '#E5E5EA', '#D1D1D6'].map((color) => (
                                                            <button
                                                                key={color}
                                                                onClick={() => setOptions({ ...options, backgroundColor: color })}
                                                                className={`w-7 h-7 rounded-apple border-2 transition-all hover:scale-110 ${options.backgroundColor.toUpperCase() === color.toUpperCase()
                                                                    ? 'border-accent-light dark:border-accent-dark ring-2 ring-accent-light/20 dark:ring-accent-dark/20'
                                                                    : 'border-border-light dark:border-border-dark'
                                                                    }`}
                                                                style={{ backgroundColor: color }}
                                                                title={color}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-text-light dark:text-text-dark mb-2 flex items-center gap-1">
                                                <Palette className="w-3.5 h-3.5 text-accent-light dark:text-accent-dark" />
                                                Background Color
                                            </label>
                                            <div className="bg-bg-light dark:bg-bg-dark rounded-apple-lg p-3 border border-border-light/50 dark:border-border-dark/50">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="relative">
                                                        <input
                                                            type="color"
                                                            value={options.backgroundColor}
                                                            onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                                                            className="h-12 w-12 rounded-apple border-2 border-border-light dark:border-border-dark cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                                                            style={{ backgroundColor: options.backgroundColor }}
                                                        />
                                                        <div className="absolute inset-0 rounded-apple border-2 border-white dark:border-black pointer-events-none" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={options.backgroundColor}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                                                setOptions({ ...options, backgroundColor: value || '#FFFFFF' })
                                                            }
                                                        }}
                                                        className="input-field flex-1 px-3 py-2 rounded-apple bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark text-sm font-mono"
                                                        placeholder="#FFFFFF"
                                                        maxLength={7}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-text-light/50 dark:text-text-dark/50">Presets:</span>
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {['#FFFFFF', '#F5F5F7', '#000000', '#1C1C1E', '#F0F0F0', '#E5E5EA', '#D1D1D6'].map((color) => (
                                                            <button
                                                                key={color}
                                                                onClick={() => setOptions({ ...options, backgroundColor: color })}
                                                                className={`w-7 h-7 rounded-apple border-2 transition-all hover:scale-110 ${options.backgroundColor.toUpperCase() === color.toUpperCase()
                                                                    ? 'border-accent-light dark:border-accent-dark ring-2 ring-accent-light/20 dark:ring-accent-dark/20'
                                                                    : 'border-border-light dark:border-border-dark'
                                                                    }`}
                                                                style={{ backgroundColor: color }}
                                                                title={color}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Output & Format Section */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-text-light dark:text-text-dark flex items-center gap-2">
                                        <div className="w-1 h-4 bg-accent-light dark:bg-accent-dark rounded-full" />
                                        Output & Format
                                    </h3>
                                    <div className="pl-3 space-y-3">
                                        {/* Output Format */}
                                        <div>
                                            <label className="text-xs font-medium text-text-light dark:text-text-dark mb-2 flex items-center gap-1">
                                                <FileDown className="w-3.5 h-3.5 text-accent-light dark:text-accent-dark" />
                                                Output Format
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { value: 'png', label: 'PNG', desc: 'Best quality' },
                                                    { value: 'svg', label: 'SVG', desc: 'Scalable' },
                                                    { value: 'jpeg', label: 'JPEG', desc: 'Smaller size' },
                                                ].map((format) => (
                                                    <button
                                                        key={format.value}
                                                        onClick={() => setOptions({ ...options, outputFormat: format.value as 'png' | 'svg' | 'jpeg' })}
                                                        className={`px-3 py-2 rounded-apple border-2 transition-all text-xs font-medium ${(options.outputFormat || 'png') === format.value
                                                            ? 'border-accent-light dark:border-accent-dark bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark'
                                                            : 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark'
                                                            }`}
                                                    >
                                                        <div className="font-semibold">{format.label}</div>
                                                        <div className="text-[10px] opacity-70">{format.desc}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Themes Section */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-text-light dark:text-text-dark flex items-center gap-2">
                                            <div className="w-1 h-4 bg-accent-light dark:bg-accent-dark rounded-full" />
                                            Quick Themes
                                        </h3>
                                        <div className="pl-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { name: 'Classic', fg: '#000000', bg: '#FFFFFF' },
                                                    { name: 'Apple Blue', fg: '#007AFF', bg: '#FFFFFF' },
                                                    { name: 'Dark Mode', fg: '#FFFFFF', bg: '#000000' },
                                                    { name: 'Green', fg: '#34C759', bg: '#FFFFFF' },
                                                    { name: 'Red', fg: '#FF3B30', bg: '#FFFFFF' },
                                                    { name: 'Purple', fg: '#AF52DE', bg: '#FFFFFF' },
                                                ].map((theme) => (
                                                    <button
                                                        key={theme.name}
                                                        onClick={() =>
                                                            setOptions({
                                                                ...options,
                                                                foregroundColor: theme.fg,
                                                                backgroundColor: theme.bg,
                                                            })
                                                        }
                                                        className="px-3 py-2 rounded-apple border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-all text-xs text-left"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded border border-border-light dark:border-border-dark"
                                                                style={{ backgroundColor: theme.fg }}
                                                            />
                                                            <div
                                                                className="w-4 h-4 rounded border border-border-light dark:border-border-dark"
                                                                style={{ backgroundColor: theme.bg }}
                                                            />
                                                            <span className="font-medium text-text-light dark:text-text-dark">{theme.name}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Preview Section */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-bg-light to-surface-light dark:from-bg-dark dark:to-surface-dark rounded-apple-lg p-8 flex items-center justify-center min-h-[320px] border border-border-light/50 dark:border-border-dark/50 shadow-inner">
                        {isGenerating ? (
                            <div className="text-text-light/50 dark:text-text-dark/50">Generating...</div>
                        ) : qrDataURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={qrDataURL} alt="QR Code" className="max-w-full h-auto" />
                        ) : (
                            <div className="text-text-light/50 dark:text-text-dark/50 text-center">
                                <QrCode className="w-16 h-16 mx-auto mb-2 opacity-30" />
                                <p>Enter content to generate QR code</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        <button
                            onClick={handleDownload}
                            disabled={!qrDataURL}
                            className="button-primary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-apple text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            <Download className="w-4 h-4" />
                            Download as {(options.outputFormat || 'png').toUpperCase()}
                        </button>
                        <button
                            onClick={handleCopy}
                            disabled={!qrDataURL}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-apple border-1.5 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Copy className="w-4 h-4" />
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

