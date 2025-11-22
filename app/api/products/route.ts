import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/admin"
import { createProduct, getAllProducts } from "@/lib/services/product-service"

// ===============================
// GET /api/products
// ===============================
export async function GET() {
  try {
    const { products, error } = await getAllProducts()

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// ===============================
// POST /api/products
// ===============================
export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const labelId = formData.get("labelId") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!labelId || !title)
      return NextResponse.json(
        { error: "Label ID and Title are required" },
        { status: 400 }
      )

    const { product, error } = await createProduct({
      labelId,
      title,
      description: description || undefined,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json(product)
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}