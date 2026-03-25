import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { GoogleAnalyticsScripts } from "@/components/google-analytics-scripts"
import { ScrollReset } from "@/components/scroll-reset"
import { SiteStructuredData } from "@/components/structured-data"
import { VercelAnalytics } from "@/components/vercel-analytics"
import { IMAGES } from "@/lib/images"
import { HOME_SEO } from "@/lib/seo"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config"

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
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: HOME_SEO.title,
  description: HOME_SEO.description ?? SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: HOME_SEO.title,
    description: HOME_SEO.description ?? SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: IMAGES.heroVillaSeating.src,
        alt: IMAGES.heroVillaSeating.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO.title,
    description: HOME_SEO.description ?? SITE_DESCRIPTION,
    images: [IMAGES.heroVillaSeating.src],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon-256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
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
        <SiteStructuredData />
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
        <VercelAnalytics />
      </body>
    </html>
  )
}
