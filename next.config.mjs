import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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
  async redirects() {
    return [
      { source: "/stay/suites", destination: "/stay#suites", permanent: true },
      { source: "/stay/villa", destination: "/stay#villa", permanent: true },
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
      { source: "/gallery", destination: "/about#gallery", permanent: true },
    ]
  },
}

export default nextConfig
