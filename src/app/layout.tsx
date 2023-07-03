import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Project Polish - ASL',
  description: 'Created by SMUBIA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      {/* TODO: Shift Bottom Logo Here */}
    </html>
  )
}
