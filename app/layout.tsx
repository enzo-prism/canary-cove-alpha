import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { GoogleAnalyticsScripts } from "@/components/google-analytics-scripts"
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
  title: "Canary Cove | Private All-Inclusive Estate in Belize",
  description:
    "Canary Cove is a private, fully staffed beachfront estate on Ambergris Caye with private-chef service, boats, dock access, and on-site gear - reserved for one group at a time. Provisions and excursions are billed separately.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/favicon%20small.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/Favicon%20large.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
    apple: "/Favicon%20large.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#faf7f0",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={`${sfPro.variable} overflow-x-hidden`}>
      <head>
        <GoogleAnalyticsScripts />
      </head>
      <body
        className={`${sfPro.className} overflow-x-hidden font-sans antialiased selection:bg-foreground/10 selection:text-foreground`}
      >
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Skip to content
        </a>
        <ScrollReset />
        <div className="min-h-screen">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
