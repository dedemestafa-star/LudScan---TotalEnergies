import { createServiceRoleClient } from "@/lib/supabase/admin"
import { generateAndUploadProductQR } from "@/lib/utils/qr-generator-utils"
import { uploadFileToStorage, generateUniqueFilename } from "@/lib/utils/file-upload-utils"
import type { Product } from "@/lib/types/types"

/**
 * Create a new product with associated QR code
 * @param productData - The product data to create
 * @returns The created product or error information
 */
export async function createProduct(
  productData: {
    labelId: string
    title: string
    description?: string
  }
): Promise<{ product: Product | null; error: string | null }> {
  try {
    const supabase = await createServiceRoleClient()

    // Insert product first to get the actual ID
    const { data: productWithoutQR, error: insertError } = await supabase
      .from("products")
      .insert({
        labelId: productData.labelId,
        title: productData.title,
        description: productData.description || null,
      })
      .select()
      .single()

    if (insertError) {
      return { product: null, error: insertError.message }
    }

    // Generate QR code with the actual product ID
    const { qrUrl, error: qrError } = await generateAndUploadProductQR(
      productWithoutQR.id,
      productData.labelId,
      productData.title
    )

    if (qrError) {
      // Clean up the product if QR generation fails
      await supabase.from("products").delete().eq("id", productWithoutQR.id)
      return { product: null, error: qrError }
    }

    // Update product with QR code URL
    const { data: finalProduct, error: updateError } = await supabase
      .from("products")
      .update({ qr_code_url: qrUrl })
      .eq("id", productWithoutQR.id)
      .select()
      .single()

    if (updateError) {
      return { product: null, error: updateError.message }
    }

    return { product: finalProduct, error: null }
  } catch (error) {
    console.error("Product creation error:", error)
    return { product: null, error: "Server error" }
  }
}

/**
 * Update an existing product
 * @param productId - The ID of the product to update
 * @param productData - The product data to update
 * @returns The updated product or error information
 */
export async function updateProduct(
  productId: string,
  productData: {
    labelId: string
    title: string
    description?: string
  }
): Promise<{ product: Product | null; error: string | null }> {
  try {
    const supabase = await createServiceRoleClient()

    // Update product
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update({
        labelId: productData.labelId,
        title: productData.title,
        description: productData.description || null,
      })
      .eq("id", productId)
      .select()
      .single()

    if (updateError) {
      return { product: null, error: updateError.message }
    }

    return { product: updatedProduct, error: null }
  } catch (error) {
    console.error("Product update error:", error)
    return { product: null, error: "Server error" }
  }
}

/**
 * Delete a product
 * @param productId - The ID of the product to delete
 * @returns Success message or error information
 */
export async function deleteProduct(
  productId: string
): Promise<{ message: string | null; error: string | null }> {
  try {
    const supabase = await createServiceRoleClient()

    // Fetch product to get image URLs before deletion
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("qr_code_url")
      .eq("id", productId)
      .single()

    if (fetchError) {
      return { message: null, error: "Product not found" }
    }

    // Delete the product
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)

    if (deleteError) {
      return { message: null, error: deleteError.message }
    }

    return { message: "Product deleted", error: null }
  } catch (error) {
    console.error("Product deletion error:", error)
    return { message: null, error: "Server error" }
  }
}

/**
 * Get all products
 * @returns Array of products or error information
 */
export async function getAllProducts(): Promise<{
  products: Product[] | null
  error: string | null
}> {
  try {
    const supabase = await createServiceRoleClient()

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return { products: null, error: error.message }
    }

    return { products: data, error: null }
  } catch (error) {
    console.error("Get all products error:", error)
    return { products: null, error: "Server error" }
  }
}

/**
 * Get a single product by ID
 * @param productId - The ID of the product to retrieve
 * @returns The product or error information
 */
export async function getProductById(
  productId: string
): Promise<{ product: Product | null; error: string | null }> {
  try {
    const supabase = await createServiceRoleClient()

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (error) {
      return { product: null, error: error.message }
    }

    return { product: data, error: null }
  } catch (error) {
    console.error("Get product by ID error:", error)
    return { product: null, error: "Server error" }
  }
}