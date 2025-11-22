'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import type { Product } from '@/lib/types/types'

interface ProductFormProps {
  product?: Product
  isSubmitting?: boolean
}

export function ProductForm({ product, isSubmitting = false }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    labelId: product?.labelId || '',
    title: product?.title || '',
    description: product?.description || '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [regeneratingQR, setRegeneratingQR] = useState(false)
  const [bulletPoint, setBulletPoint] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addBulletPoint = () => {
    if (bulletPoint.trim()) {
      const newDescription = formData.description 
        ? `${formData.description}\n• ${bulletPoint.trim()}`
        : `• ${bulletPoint.trim()}`
      
      setFormData(prev => ({
        ...prev,
        description: newDescription
      }))
      setBulletPoint('')
    }
  }

  const handleBulletPointKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addBulletPoint()
    }
  }

  const regenerateQR = async () => {
    if (!product) return
    
    setRegeneratingQR(true)
    try {
      const response = await fetch(`/api/products/${product.id}/regenerate-qr`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to regenerate QR code')
      }
      
      const updatedProduct = await response.json()
      
      toast({
        title: 'Success',
        description: 'QR code regenerated successfully',
      })
      
      // Refresh the page to show updated QR
      router.refresh()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate required fields
    if (!formData.labelId.trim() || !formData.title.trim()) {
      setError('Label ID and Title are required')
      setLoading(false)
      return
    }

    try {
      const formPayload = new FormData()
      formPayload.append('labelId', formData.labelId)
      formPayload.append('title', formData.title)
      formPayload.append('description', formData.description)

      const url = product
        ? `/api/products/${product.id}`
        : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formPayload,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add Product'}</CardTitle>
        <CardDescription>
          {product ? 'Update product details' : 'Create a new product with QR code'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="labelId">Label ID *</Label>
              <Input
                id="labelId"
                name="labelId"
                value={formData.labelId}
                onChange={handleChange}
                disabled={loading || isSubmitting}
                required
                placeholder="Q7LM2XHF94TB3YP4L0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={loading || isSubmitting}
                required
                placeholder="Total Energies Rubia 7400 Tir 15W40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading || isSubmitting}
              placeholder="Enter product description"
              rows={4}
            />
            
          </div>

          {product && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={regenerateQR}
                disabled={regeneratingQR}
                variant="outline"
                className="flex-1"
              >
                {regeneratingQR ? 'Regenerating QR...' : 'Regenerate QR Code'}
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || isSubmitting}
              className="flex-1"
            >
              {loading || isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading || isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}