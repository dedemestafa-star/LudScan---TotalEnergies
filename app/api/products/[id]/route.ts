import { NextResponse, type NextRequest } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/admin"
import { getProductById, updateProduct, deleteProduct } from "@/lib/services/product-service"
import { regenerateAndUploadProductQR } from "@/lib/utils/qr-generator-utils"

// ===============================
// GET /api/products/[id]
// ===============================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { product, error } = await getProductById(id)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// ===============================
// PUT /api/products/[id]
// ===============================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()

    const labelId = formData.get("labelId") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!labelId || !title)
      return NextResponse.json(
        { error: "Label ID and Title are required" },
        { status: 400 }
      )

    const { product, error } = await updateProduct(
      id,
      {
        labelId,
        title,
        description: description || undefined,
      }
    )

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json(product)
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// ===============================
// DELETE /api/products/[id]
// ===============================
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { message, error } = await deleteProduct(id)

    if (error) {
      return NextResponse.json({ error }, { status: 404 })
    }

    return NextResponse.json({ message })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}