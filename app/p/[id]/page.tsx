'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/types/types'

export default function ProductDetailPage() {
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
        <nav className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-2 py-4 flex items-center justify-between">
            <div className="flex-grow-0">
              <Link href="/scan">
                <Button variant="link" className="text-red-500 p-0 h-auto">
                  &lt; Scan
                </Button>
              </Link>
            </div>
            <div className="flex-grow flex justify-center">
              <span className="text-xl font-semibold text-red-500">LubScan</span>
            </div>
            <div className="flex-grow-0 w-16"></div>
          </div>
        </nav>
        <main className="flex items-center justify-center py-12">
          <div>Loading...</div>
        </main>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-2 py-4 flex items-center justify-between">
            <div className="flex-grow-0">
              <Link href="/scan">
                <Button variant="link" className="text-red-500 p-0 h-auto">
                  &lt; Scan
                </Button>
              </Link>
            </div>
            <div className="flex-grow flex justify-center">
              <span className="text-xl font-semibold text-red-500">LubScan</span>
            </div>
            <div className="flex-grow-0 w-16"></div>
          </div>
        </nav>
        <main className="flex items-center justify-center py-12">
          <div className="text-destructive">Error: {error || 'Product not found'}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-2 py-4 flex items-center justify-between">
          <div className="flex-grow-0">
            <Link href="/scan">
              <Button variant="link" className="text-red-500 p-0 h-auto">
                &lt; Scan
              </Button>
            </Link>
          </div>
          <div className="flex-grow flex justify-center">
            <span className="text-xl font-semibold text-red-500">LubScan</span>
          </div>
          <div className="flex-grow-0 w-16"></div>
        </div>
      </nav>

      <main className="w-full">
        <div className="max-w-md mx-auto">
          <ProductCard product={product} />
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold text-green-600">THIS IS A GENUINE PRODUCT</p>
            <div className="flex justify-center">
              <Image 
                src="/logo.png" 
                alt="LubScan Logo" 
                width={150} 
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}