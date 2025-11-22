"use client";

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import QRScanner from '@/components/qr-scanner'
import { Toaster } from '@/components/ui/toaster'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleScan = (code: string) => {
    // Prevent multiple scans while processing
    if (isProcessing) return
    
    setIsProcessing(true)
    
    console.log("Scanned code:", code);
    
    // First, try to parse as a URL
    try {
      const url = new URL(code)
      console.log("Parsed URL:", url);
      console.log("URL origin:", url.origin);
      console.log("URL pathname:", url.pathname);
      
      // Check if it's a product URL - simplified approach
      // Just check if pathname starts with /p/ regardless of domain
      if (url.pathname.startsWith('/p/')) {
        // Extract the product ID from the path
        const pathParts = url.pathname.split('/');
        const productId = pathParts[2];
        console.log("Product ID:", productId);
        
        if (productId) {
          // Navigate to the product page
          toast({
            title: "Product Found",
            description: "Redirecting to product page...",
          })
          router.push(url.pathname)
          return; // Important: return here to prevent setIsProcessing(false)
        } else {
          // Invalid product URL format
          toast({
            title: "Invalid Product URL",
            description: "The scanned QR code has an invalid product URL format.",
            variant: "destructive",
          })
        }
      } else {
        // For external URLs or other formats, open in a new tab
        window.open(code, '_blank')
        toast({
          title: "QR Code Scanned",
          description: "Opening link in new tab...",
        })
        setIsProcessing(false)
        return;
      }
    } catch (e) {
      console.log("Not a valid URL, treating as raw content:", code);
      // If it's not a valid URL, treat it as a raw code
      toast({
        title: "Code Scanned",
        description: `Content: ${code}`,
      })
    }
    
    // Reset processing state if we didn't navigate
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            LubScan
          </Link>
          <Link href="/admin/login">
            <Button variant="outline">
              Admin
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Scan QR Code</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Verify product authenticity by scanning the QR code with your device's camera
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>How to Scan</CardTitle>
              <CardDescription>Follow these simple steps to verify your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                <div>
                  <h3 className="font-medium">Allow Camera Access</h3>
                  <p className="text-sm text-muted-foreground">Grant permission when prompted</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                <div>
                  <h3 className="font-medium">Position the QR Code</h3>
                  <p className="text-sm text-muted-foreground">Hold your device so the QR code is visible in the camera view</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                <div>
                  <h3 className="font-medium">Automatic Detection</h3>
                  <p className="text-sm text-muted-foreground">The scanner will automatically detect and verify the QR code</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Scan Your Product</h2>
            <p className="text-muted-foreground mb-6">
              Point your camera at the QR code to verify authenticity
            </p>
          </div>

          <div className="relative">
            <QRScanner onScan={handleScan} />
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <p className="text-white">Processing...</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}