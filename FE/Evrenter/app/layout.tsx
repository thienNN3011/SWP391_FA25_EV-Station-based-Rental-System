import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/auth-context"
import { QueryProvider } from "@/components/providers/query-provider"


const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Thuê xe điện",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <Analytics />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
