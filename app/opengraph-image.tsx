import { ImageResponse } from 'next/og'

export const alt = 'QR Studio — Premium QR Code Generator & Scanner'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #007AFF 0%, #0A84FF 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ fontSize: 96, marginBottom: 40 }}>📱</div>
        <div style={{ fontSize: 64, fontWeight: 'bold' }}>QR Studio</div>
        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.9 }}>
          Premium QR Code Generator & Scanner
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

