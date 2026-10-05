import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"
import PublicRuntimeServices from "@/components/public-runtime-services"
import { RevealObserver } from "@/components/motion/reveal-observer"
import { SmoothScroll } from "@/components/motion/smooth-scroll"
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
    { path: "../font/subset/SF-Pro-Display-Regular.subset.woff2", weight: "400", style: "normal" },
    { path: "../font/subset/SF-Pro-Display-Medium.subset.woff2", weight: "500", style: "normal" },
    { path: "../font/subset/SF-Pro-Display-Semibold.subset.woff2", weight: "600", style: "normal" },
    { path: "../font/subset/SF-Pro-Display-Bold.subset.woff2", weight: "700", style: "normal" },
  ],
})

// Display face for headlines (one weight, roman + italic). Body and UI stay in
// SF Pro. Exposed as --font-serif and consumed by --font-display.
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
})

// Runs before first paint: marks the document as scripted so scroll-reveal
// hidden states (app/globals.css, html.js [data-reveal]) only ever apply when
// the observer that reveals them will also run.
const BOOT_SCRIPT = "document.documentElement.classList.add('js')"

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
  // Favicons use the canary from the official logo (the full lockup is
  // illegible at tab size); the Apple icon sits on reef ink because iOS
  // renders transparent touch icons on black.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-small.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-large.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: "/favicon-small.png",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#f7f2e9",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    // overflow-x-clip, not -hidden: see the note in app/globals.css. `hidden`
    // makes html/body scroll containers and breaks every `position: sticky`.
    <html lang="en" className={`${sfPro.variable} ${instrumentSerif.variable} overflow-x-clip`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <SiteStructuredData />
      </head>
      <body
        className={`${sfPro.className} overflow-x-clip font-sans antialiased `}
      >
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-canary px-5 py-2.5 text-sm font-semibold text-ink focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
        >
          Skip to content
        </a>
        <ScrollReset />
        <RevealObserver />
        <SmoothScroll />
        <div className="min-h-screen">{children}</div>
        <PublicRuntimeServices />
      </body>
    </html>
  )
}
