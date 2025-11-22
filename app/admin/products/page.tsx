'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AdminNavbar } from '@/components/admin-navbar'
import { ProductTable } from '@/components/product-table'
import type { Product } from '@/lib/types/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        // Ensure data is an array and handle null/undefined cases
        const productsArray = Array.isArray(data) ? data : (data ? [data] : [])
        setProducts(productsArray)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground">Manage your QR code products</p>
            </div>
            <Link href="/admin/products/new">
              <Button>Add Product</Button>
            </Link>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-4 text-destructive">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              Loading products...
            </div>
          ) : (
            <ProductTable products={products} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </div>
  )
}