import { uploadFileToStorage, generateUniqueFilename } from "@/lib/utils/file-upload-utils"
import { generateQRCodeDataUrl } from "@/lib/utils/qr-generator"

/**
 * Generate and upload a QR code for a product
 * @param productId - The database ID of the product
 * @param labelId - The label ID of the product (used for filename)
 * @param title - The title of the product (used for filename)
 * @returns The URL of the uploaded QR code or null if generation failed
 */
export async function generateAndUploadProductQR(
  productId: string,
  labelId: string,
  title: string
): Promise<{ qrUrl: string | null; error: string | null }> {
  try {
    // Generate QR code with the actual product ID
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
    const productUrl = `${baseUrl}/p/${productId}`
    const qrDataUrl = await generateQRCodeDataUrl(productUrl)
    const base64 = qrDataUrl.replace("data:image/png;base64,", "")
    const buffer = Buffer.from(base64, "base64")

    const qrFile = new File([buffer], `qr-${Date.now()}.png`, {
      type: "image/png",
    })

    const qrFileName = generateUniqueFilename("qr", `${labelId}-${title.substring(0, 20)}`, "png")
    const { url: qrUrl, error: qrError } = await uploadFileToStorage(
      qrFile,
      "product-qr",
      qrFileName
    )

    if (qrError) {
      return { qrUrl: null, error: "QR upload failed" }
    }

    return { qrUrl, error: null }
  } catch (error) {
    console.error("QR generation error:", error)
    return { qrUrl: null, error: "Failed to generate QR code" }
  }
}

/**
 * Regenerate and upload a QR code for an existing product
 * @param productId - The database ID of the product
 * @param labelId - The label ID of the product (used for filename)
 * @param title - The title of the product (used for filename)
 * @returns The URL of the uploaded QR code or null if regeneration failed
 */
export async function regenerateAndUploadProductQR(
  productId: string,
  labelId: string,
  title: string
): Promise<{ qrUrl: string | null; error: string | null }> {
  return generateAndUploadProductQR(productId, labelId, title)
}