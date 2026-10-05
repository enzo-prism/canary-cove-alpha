import type { ReactNode } from "react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PageStructuredData } from "@/components/structured-data"
import { cn } from "@/lib/utils"

type PageShellProps = {
  path: string
  children: ReactNode
  className?: string
  wash?: boolean
}

export function PageShell({ path, children, className, wash = false }: PageShellProps) {
  return (
    <>
      <Header />
      <main tabIndex={-1} id="main-content" className={cn("outline-none", "min-h-screen bg-background", wash && "page-wash", className)}>
      <PageStructuredData path={path} />
      {children}
    </main>
      <Footer />
    </>
  )
}
