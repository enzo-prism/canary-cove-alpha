import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cloudinary does the resizing (see lib/cloudinary-loader.ts), so no
    // Vercel image-optimization invocations are consumed. Do not switch back
    // to `unoptimized: true` — that serves multi-MB original uploads with no
    // srcset at all.
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  turbopack: {
    // Fix Turbopack root detection when multiple lockfiles exist in parent dirs
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/guest/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: "/about/photo-gallery", destination: "/stay", permanent: true },
      { source: "/stay/suites", destination: "/stay#suites", permanent: true },
      { source: "/stay/villa", destination: "/stay#villa", permanent: true },
      { source: "/stay/villa/inside", destination: "/stay#inside-the-villa", permanent: true },
      { source: "/stay/amenities", destination: "/stay#amenities", permanent: true },
      { source: "/experiences/power-boating", destination: "/experiences#power-boating", permanent: true },
      { source: "/experiences/land", destination: "/experiences#land", permanent: true },
      { source: "/experiences/on-the-water", destination: "/experiences#on-the-water", permanent: true },
      { source: "/experiences/diving-fishing", destination: "/experiences#diving-fishing", permanent: true },
      { source: "/dining/breakfast", destination: "/dining#breakfast-snacks", permanent: true },
      { source: "/dining/special-moments", destination: "/dining#special-moments", permanent: true },
      { source: "/dining/private-chef", destination: "/dining#private-chef", permanent: true },
      { source: "/dining/provisioning", destination: "/dining#provisioning", permanent: true },
      { source: "/dining/eating-out", destination: "/dining#eating-out", permanent: true },
      { source: "/adventures/fishing", destination: "/adventures#fishing", permanent: true },
      { source: "/adventures/day-trips", destination: "/adventures#day-trips", permanent: true },
      { source: "/adventures/diving", destination: "/adventures#diving", permanent: true },
      { source: "/adventures/boats-crew", destination: "/adventures#boats-crew", permanent: true },
      { source: "/about/reviews", destination: "/about#reviews", permanent: true },
      { source: "/about/getting-here", destination: "/about#getting-here", permanent: true },
      { source: "/about/faq", destination: "/about#faq", permanent: true },
      { source: "/gallery", destination: "/stay", permanent: true },
      { source: "/lms.txt", destination: "/llms.txt", permanent: true },
    ]
  },
  async rewrites() {
    return [
      { source: "/llms.txt", destination: "/llms" },
      { source: "/llms-full.txt", destination: "/llms-full" },
    ]
  },
}

export default nextConfig
