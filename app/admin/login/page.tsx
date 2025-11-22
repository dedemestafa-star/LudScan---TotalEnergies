import Link from 'next/link'
import { LoginForm } from '@/components/login-form'
import { Button } from '@/components/ui/button'

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-end">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}