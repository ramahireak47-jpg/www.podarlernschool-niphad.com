import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Podar Learn School ERP - Niphad',
  description: 'Complete School Management System for Podar Learn School Niphad',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
