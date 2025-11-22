'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { signOut } from '@/lib/auth/actions'

export function AdminNavbar() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await signOut()
    router.push('/admin/login')
  }

  return (
    /* Enhanced navbar with gradient background and vibrant styling */
    <nav className="flex items-center justify-between border-b border-border p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-white font-bold">
          QR
        </div>
        <h1 className="text-xl font-bold bg-red-500 hover:bg-red-600 bg-clip-text text-transparent">
          Info-QR Admin
        </h1>
      </div>
      <Button
        onClick={handleLogout}
        disabled={isLoading}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </Button>
    </nav>
  )
}