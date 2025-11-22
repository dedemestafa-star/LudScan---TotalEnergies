import { NextResponse } from "next/server"
import { getProductById } from "@/lib/services/product-service"
import { regenerateAndUploadProductQR } from "@/lib/utils/qr-generator-utils"
import { createServiceRoleClient } from "@/lib/supabase/admin"

// ===============================
// POST /api/products/[id]/regenerate-qr
// ===============================
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Fetch existing product
    const { product, error: fetchError } = await getProductById(id)

    if (fetchError) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Regenerate QR code
    const { qrUrl, error: qrError } = await regenerateAndUploadProductQR(
      id,
      product.labelId,
      product.title
    )

    if (qrError) {
      return NextResponse.json(
        { error: qrError },
        { status: 500 }
      )
    }

    // Update product with new QR code URL
    const supabase = await createServiceRoleClient()
    const { data, error } = await supabase
      .from("products")
      .update({
        qr_code_url: qrUrl,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("QR regeneration error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}