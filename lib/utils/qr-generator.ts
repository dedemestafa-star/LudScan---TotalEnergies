import QRCode from 'qrcode'

// Generate QR code as data URL
export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000FF',
        light: '#FFFFFFFF'
      }
    })
    return dataUrl
  } catch (error) {
    throw new Error('Failed to generate QR code')
  }
}

// Generate QR code as SVG
export async function generateQRCodeSvg(text: string): Promise<string> {
  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      width: 300,
      margin: 2
    })
    return svg
  } catch (error) {
    throw new Error('Failed to generate QR code')
  }
}