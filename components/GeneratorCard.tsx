'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Download,
    Copy,
    QrCode,
    Settings,
    Image as ImageIcon,
    FileDown,
    Palette,
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
} from '@/lib/qr'
import { QRGeneratorOptions, QRContentType, VCARDData, WiFiData } from '@/lib/types'
import { useQRHistory } from '@/lib/useLocalStorage'

interface GeneratorCardProps {
    prefilledContent?: string | null
}

export function GeneratorCard({ prefilledContent }: GeneratorCardProps) {
    const { addHistoryItem, settings } = useQRHistory()
    const [content, setContent] = useState(prefilledContent || '')
    const [contentType, setContentType] = useState<QRContentType>('text')
    const [qrDataURL, setQrDataURL] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showAdvanced, setShowAdvanced] = useState(false)

    // Generator options
    const [options, setOptions] = useState<QRGeneratorOptions>({
        size: settings.defaultSize,
        margin: 4,
        errorCorrectionLevel: 'M', // Fixed to Medium
        foregroundColor: '#007AFF',
        backgroundColor: '#FFFFFF',
        includeLogo: false,
    })

    // Form data for structured types
    const [vcardData, setVcardData] = useState<VCARDData>({})
    const [wifiData, setWifiData] = useState<WiFiData>({
        ssid: '',
        password: '',
        encryption: 'WPA',
    })

    // Generate QR code when content or options change
    useEffect(() => {
        if (!content.trim()) {
            setQrDataURL(null)
            return
        }

        const generateQR = async () => {
            setIsGenerating(true)
            try {
                let qrContent = content

                // Format content based on type
                if (contentType === 'vcard') {
                    qrContent = formatVCARD(vcardData)
                } else if (contentType === 'wifi') {
                    qrContent = formatWiFi(wifiData)
                }

                const dataURL = await generateQRCodeDataURL(qrContent, options)
                setQrDataURL(dataURL)
            } catch (error) {
                console.error('Error generating QR code:', error)
                toast.error('Failed to generate QR code')
            } finally {
                setIsGenerating(false)
            }
        }

        const timeoutId = setTimeout(generateQR, 300)
        return () => clearTimeout(timeoutId)
    }, [content, contentType, options, vcardData, wifiData])

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

    const handleDownloadPNG = () => {
        if (!qrDataURL) return
        downloadDataURLAsPNG(qrDataURL, `qr-code-${Date.now()}.png`)
        toast.success('QR code downloaded as PNG!')
    }

    const handleDownloadSVG = async () => {
        if (!content.trim()) return
        try {
            let qrContent = content
            if (contentType === 'vcard') {
                qrContent = formatVCARD(vcardData)
            } else if (contentType === 'wifi') {
                qrContent = formatWiFi(wifiData)
            }
            const svg = await generateQRCodeSVG(qrContent, options)
            downloadSVG(svg, `qr-code-${Date.now()}.svg`)
            toast.success('QR code downloaded as SVG!')
        } catch (error) {
            toast.error('Failed to download SVG')
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

    const handleSave = () => {
        if (!qrDataURL || !content.trim()) return

        let qrContent = content
        if (contentType === 'vcard') {
            qrContent = formatVCARD(vcardData)
        } else if (contentType === 'wifi') {
            qrContent = formatWiFi(wifiData)
        }

        addHistoryItem({
            type: 'generated',
            contentType: normalizeContentType(qrContent),
            content: qrContent,
            metadata: {
                size: options.size,
                errorCorrectionLevel: options.errorCorrectionLevel,
                foregroundColor: options.foregroundColor,
                backgroundColor: options.backgroundColor,
            },
        })

        toast.success('QR code saved to history!')
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

                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-sm text-accent-light dark:text-accent-dark hover:opacity-80 transition-opacity"
                    >
                        <Settings className="w-4 h-4" />
                        Advanced Options
                    </button>

                    {showAdvanced && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-3 pt-3 border-t border-border-light dark:border-border-dark"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-text-light/70 dark:text-text-dark/70 mb-1">
                                        Size (px)
                                    </label>
                                    <input
                                        type="number"
                                        min="100"
                                        max="1000"
                                        value={options.size}
                                        onChange={(e) =>
                                            setOptions({ ...options, size: parseInt(e.target.value) || 256 })
                                        }
                                        className="w-full px-3 py-2 rounded-apple border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                                    />
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
                                        className="w-full px-3 py-2 rounded-apple border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-text-light/70 dark:text-text-dark/70 mb-1 flex items-center gap-1">
                                        <Palette className="w-3 h-3" />
                                        Foreground
                                    </label>
                                    <input
                                        type="color"
                                        value={options.foregroundColor}
                                        onChange={(e) => setOptions({ ...options, foregroundColor: e.target.value })}
                                        className="w-full h-10 rounded-apple border border-border-light dark:border-border-dark cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-text-light/70 dark:text-text-dark/70 mb-1 flex items-center gap-1">
                                        <Palette className="w-3 h-3" />
                                        Background
                                    </label>
                                    <input
                                        type="color"
                                        value={options.backgroundColor}
                                        onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                                        className="w-full h-10 rounded-apple border border-border-light dark:border-border-dark cursor-pointer"
                                    />
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
                            onClick={handleDownloadPNG}
                            disabled={!qrDataURL}
                            className="button-primary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-apple text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            <Download className="w-4 h-4" />
                            PNG
                        </button>
                        <button
                            onClick={handleDownloadSVG}
                            disabled={!content.trim()}
                            className="button-primary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-apple text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            <FileDown className="w-4 h-4" />
                            SVG
                        </button>
                        <button
                            onClick={handleCopy}
                            disabled={!qrDataURL}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-apple border-1.5 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Copy className="w-4 h-4" />
                            Copy
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!qrDataURL || !content.trim()}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-apple border-1.5 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ImageIcon className="w-4 h-4" />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

