import type { Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Quicksand } from 'next/font/google'
import './globals.css'
import Header from '@/components/layouts/header'


const quicksand = Quicksand({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: 'Sign1o',
  description: 'Breaking Barriers in the Interview Process',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className={`${quicksand.className} antialiased`}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}