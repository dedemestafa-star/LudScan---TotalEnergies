import { ProductForm } from '@/components/product-form'
import { AdminNavbar } from '@/components/admin-navbar'

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="flex items-center justify-center p-6 py-12">
        <ProductForm />
      </main>
    </div>
  )
}
