'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ProductForm } from '@/components/product-form'
import { AdminNavbar } from '@/components/admin-navbar'
import type { Product } from '@/lib/types/types'

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) throw new Error('Product not found')
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar />
        <main className="flex items-center justify-center p-6 py-12">
          <div>Loading...</div>
        </main>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar />
        <main className="flex items-center justify-center p-6 py-12">
          <div className="text-destructive">Error: {error || 'Product not found'}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="flex items-center justify-center p-6 py-12">
        <ProductForm product={product} />
      </main>
    </div>
  )
}
