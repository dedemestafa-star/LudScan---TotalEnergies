import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Info-QR',
  description: 'Manage your QR code products',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
