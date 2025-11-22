'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminNavbar } from '@/components/admin-navbar'
import { toast } from '@/hooks/use-toast'
import type { Product } from '@/lib/types/types'

export default function AdminProductDetailView() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [regeneratingQR, setRegeneratingQR] = useState(false)

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

  const downloadQR = async () => {
    if (!product.qr_code_url) return
    try {
      const response = await fetch(product.qr_code_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${product.title}-qr.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const regenerateQR = async () => {
    if (!product) return
    
    setRegeneratingQR(true)
    try {
      const response = await fetch(`/api/products/${id}/regenerate-qr`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to regenerate QR code')
      }
      
      const updatedProduct = await response.json()
      setProduct(updatedProduct)
      
      toast({
        title: 'Success',
        description: 'QR code regenerated successfully',
      })
    } catch (error) {
      console.error('QR regeneration error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to regenerate QR code',
        variant: 'destructive',
      })
    } finally {
      setRegeneratingQR(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Product Details</h1>
          <Link href="/admin/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">
                Label ID: {product.labelId}
              </p>
            </div>

            {product.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2 pt-4">
              <Link href={`/admin/products/${product.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Edit Product
                </Button>
              </Link>
              {/* Removed Public View button */}
            </div>
          </div>

          {/* QR Code */}
          {product.qr_code_url && (
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>Scan this QR code to view product details</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mx-auto" style={{ width: "200px" }}>
                  <Image
                    src={product.qr_code_url || "/placeholder.svg"}
                    alt="Product QR Code"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={downloadQR} className="flex-1">
                    Download QR Code
                  </Button>
                  <Button 
                    onClick={regenerateQR} 
                    disabled={regeneratingQR}
                    variant="outline"
                    className="flex-1"
                  >
                    {regeneratingQR ? 'Regenerating...' : 'Regenerate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}