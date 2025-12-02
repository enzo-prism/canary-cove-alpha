import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ScrollReset } from "@/components/scroll-reset"

const sfPro = localFont({
  variable: "--font-sf",
  display: "swap",
  src: [
    { path: "../font/SF-Pro-Display-Light.otf", weight: "300", style: "normal" },
    { path: "../font/SF-Pro-Display-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../font/SF-Pro-Display-Regular.otf", weight: "400", style: "normal" },
    { path: "../font/SF-Pro-Display-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "../font/SF-Pro-Display-Medium.otf", weight: "500", style: "normal" },
    { path: "../font/SF-Pro-Display-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../font/SF-Pro-Display-Semibold.otf", weight: "600", style: "normal" },
    { path: "../font/SF-Pro-Display-SemiboldItalic.otf", weight: "600", style: "italic" },
    { path: "../font/SF-Pro-Display-Bold.otf", weight: "700", style: "normal" },
    { path: "../font/SF-Pro-Display-BoldItalic.otf", weight: "700", style: "italic" },
  ],
})

export const metadata: Metadata = {
  title: "Canary Cove - Luxury Island Retreat",
  description:
    "Experience unparalleled luxury at Canary Cove, where pristine beaches meet world-class hospitality. Your exclusive island paradise awaits.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={sfPro.variable}>
      <body className={`${sfPro.className} font-sans antialiased selection:bg-primary/10 selection:text-primary`}>
        <ScrollReset />
        <div className="min-h-screen">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
