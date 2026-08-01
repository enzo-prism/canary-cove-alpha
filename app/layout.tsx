import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"
import PublicRuntimeServices from "@/components/public-runtime-services"
import { ScrollReset } from "@/components/scroll-reset"
import { SiteStructuredData } from "@/components/structured-data"
import { IMAGES } from "@/lib/images"
import { HOME_SEO } from "@/lib/seo"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config"

// Latin-subset woff2 files (~20 KB each) generated from the full OTFs in
// ../font with fonttools. The raw OTFs are ~5.4 MB each and must never be
// referenced here directly — ten of them added ~54 MB of preloaded fonts to
// every page. Italics are intentionally omitted (nothing in the app uses
// italic styles; browsers synthesize them if content ever does).
const sfPro = localFont({
  variable: "--font-sf",
  display: "swap",
  src: [
    { path: "../font/subset/SF-Pro-Display-Light.subset.woff2", weight: "300", style: "normal" },
    { path: "../font/subset/SF-Pro-Display-Regular.subset.woff2", weight: "400", style: "normal" },
    { path: "../font/subset/SF-Pro-Display-Medium.subset.woff2", weight: "500", style: "normal" },
    { path: "../font/subset/SF-Pro-Display-Semibold.subset.woff2", weight: "600", style: "normal" },
    { path: "../font/subset/SF-Pro-Display-Bold.subset.woff2", weight: "700", style: "normal" },
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
        url: "/favicon-small.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-large.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
    shortcut: "/favicon-small.png",
    apple: [
      {
        url: "/favicon-large.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
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
    // overflow-x-clip, not -hidden: see the note in app/globals.css. `hidden`
    // makes html/body scroll containers and breaks every `position: sticky`.
    <html lang="en" className={`${sfPro.variable} overflow-x-clip`}>
      <head>
        <SiteStructuredData />
      </head>
      <body
        className={`${sfPro.className} overflow-x-clip font-sans antialiased selection:bg-foreground/10 selection:text-foreground`}
      >
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Skip to content
        </a>
        <ScrollReset />
        <div className="min-h-screen">{children}</div>
        <PublicRuntimeServices />
      </body>
    </html>
  )
}
