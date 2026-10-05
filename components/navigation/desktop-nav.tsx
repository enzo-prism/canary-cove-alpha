"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"

import type { NavItem } from "@/lib/nav-items"
import { trackNavClick } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DesktopNavProps = {
  items: NavItem[]
  isActive: (href: string) => boolean
  pathname: string
}

const OPEN_DELAY_MS = 150
const CLOSE_DELAY_MS = 120

const linkClass = (active: boolean) =>
  cn(
    "focus-ring rounded-full px-3 py-2 text-[14px] font-medium transition-colors duration-300 motion-reduce:transition-none",
    active
      ? "text-foreground underline decoration-canary-deep decoration-2 underline-offset-[9px]"
      : "text-foreground/70 hover:text-foreground",
  )

function focusPanelLink(panel: HTMLElement | null, index: number) {
  const links = panel ? Array.from(panel.querySelectorAll<HTMLAnchorElement>("a[href]")) : []
  if (links.length === 0) return
  const next = links[(index + links.length) % links.length]
  next?.focus()
}

export function DesktopNav({ items, isActive, pathname }: DesktopNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [preview, setPreview] = useState<Record<string, number>>({})
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelRefs = useRef<Record<string, HTMLElement | null>>({})
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const primary = items.filter((item) => item.type === "dropdown" || (item.type === "link" && !item.cta))

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  useEffect(() => clearTimer, [])

  // A client-side navigation never unmounts the header, so close any open
  // dropdown explicitly when the route changes.
  useEffect(() => {
    setOpenDropdown(null)
  }, [pathname])

  const scheduleOpen = (label: string) => {
    clearTimer()
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return
    timer.current = setTimeout(() => setOpenDropdown(label), OPEN_DELAY_MS)
  }

  const scheduleClose = () => {
    clearTimer()
    timer.current = setTimeout(() => setOpenDropdown(null), CLOSE_DELAY_MS)
  }

  const handlePanelKeyDown = (event: React.KeyboardEvent, label: string) => {
    const panel = panelRefs.current[label]
    const links = panel ? Array.from(panel.querySelectorAll<HTMLAnchorElement>("a[href]")) : []
    const current = links.indexOf(document.activeElement as HTMLAnchorElement)

    if (event.key === "Escape") {
      event.preventDefault()
      setOpenDropdown(null)
      triggerRefs.current[label]?.focus()
      return
    }
    if (event.key === "ArrowDown") {
      event.preventDefault()
      focusPanelLink(panel, current + 1)
      return
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      focusPanelLink(panel, current - 1)
      return
    }
    if (event.key === "Home") {
      event.preventDefault()
      focusPanelLink(panel, 0)
      return
    }
    if (event.key === "End") {
      event.preventDefault()
      focusPanelLink(panel, links.length - 1)
      return
    }
    if (event.key === "Tab") {
      setOpenDropdown(null)
    }
  }

  return (
    <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
      <ul className="flex min-w-0 list-none items-center gap-0.5 xl:gap-1">
        {primary.map((item) => {
          if (item.type === "dropdown") {
            const open = openDropdown === item.label
            const childActive = item.items.some((child) => isActive(child.href))
            const labelActive = isActive(item.href)
            const active = labelActive || childActive

            return (
              <li
                key={item.label}
                className="shrink-0"
                onMouseEnter={() => scheduleOpen(item.label)}
                onMouseLeave={scheduleClose}
              >
                <Popover open={open} onOpenChange={(next) => setOpenDropdown(next ? item.label : null)}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      aria-current={labelActive ? "page" : undefined}
                      onClick={() => {
                        clearTimer()
                        setOpenDropdown(null)
                        trackNavClick("header_desktop", item.href)
                      }}
                      className={cn(linkClass(active), "rounded-r-none py-2 pl-3 pr-1.5")}
                    >
                      {item.label}
                    </Link>
                    <PopoverTrigger asChild>
                      <button
                        ref={(node) => {
                          triggerRefs.current[item.label] = node
                        }}
                        type="button"
                        aria-label={`${item.label} submenu`}
                        aria-expanded={open}
                        data-testid={`desktop-nav-${item.label.toLowerCase()}`}
                        onClick={clearTimer}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault()
                            clearTimer()
                            setOpenDropdown(item.label)
                            requestAnimationFrame(() => focusPanelLink(panelRefs.current[item.label], 0))
                          }
                        }}
                        className={cn(
                          "focus-ring flex h-9 w-7 items-center justify-center rounded-l-none rounded-r-full pointer-coarse:h-11 pointer-coarse:w-10 transition-colors duration-200 motion-reduce:transition-none",
                          active ? "text-foreground" : "text-foreground/60 hover:text-foreground",
                        )}
                      >
                        <ChevronDown
                          className={cn("h-3.5 w-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none", open && "rotate-180")}
                        />
                      </button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent
                    ref={(node) => {
                      panelRefs.current[item.label] = node
                    }}
                    align="center"
                    sideOffset={14}
                    onKeyDown={(event) => handlePanelKeyDown(event, item.label)}
                    onMouseEnter={clearTimer}
                    onMouseLeave={scheduleClose}
                    className="w-[600px] overflow-hidden rounded-[1.5rem] border-border/80 bg-sand-light p-2 shadow-[var(--shadow-lift)]"
                  >
                    <div className="grid grid-cols-[1fr_220px] gap-2">
                      <ul className="flex flex-col py-1">
                        {item.items.map((child, index) => (
                          <li
                            key={child.href}
                            className="enter-up"
                            style={{ "--enter-delay": `${60 + index * 45}ms` } as CSSProperties}
                          >
                            <Link
                              href={child.href}
                              aria-current={isActive(child.href) ? "page" : undefined}
                              onMouseEnter={() => setPreview((prev) => ({ ...prev, [item.label]: index }))}
                              onFocus={() => setPreview((prev) => ({ ...prev, [item.label]: index }))}
                              onClick={() => {
                                clearTimer()
                                setOpenDropdown(null)
                                trackNavClick("header_desktop", child.href)
                              }}
                              className={cn(
                                "group flex min-h-14 items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors duration-300 hover:bg-sand-deep/70 focus-visible:bg-sand-deep/70 focus-visible:outline-none motion-reduce:transition-none",
                                isActive(child.href) && "bg-sand-deep/60",
                              )}
                            >
                              <span className="flex flex-col">
                                <span className="flex items-center gap-1.5 font-display text-[1.45rem] leading-tight text-foreground">
                                  {child.label}
                                  {child.external ? (
                                    <>
                                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                      <span className="sr-only">(external site)</span>
                                    </>
                                  ) : null}
                                </span>
                                <span className="block text-xs text-muted-foreground">{child.caption}</span>
                              </span>
                              <span
                                aria-hidden="true"
                                className="flex h-8 w-8 shrink-0 -translate-x-2 items-center justify-center rounded-full bg-ink text-sand-light opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                              >
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div aria-hidden="true" className="relative min-h-[260px] overflow-hidden rounded-[1.1rem] bg-sand-deep">
                        {item.items.map((child, index) =>
                          child.image ? (
                            <Image
                              key={child.href}
                              src={child.image.src}
                              alt=""
                              fill
                              sizes="220px"
                              className={cn(
                                "object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                                (preview[item.label] ?? 0) === index ? "scale-100 opacity-100" : "scale-110 opacity-0",
                              )}
                            />
                          ) : null,
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 pt-12">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">{item.label}</p>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </li>
            )
          }

          const active = isActive(item.href)

          return (
            <li key={item.label} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => trackNavClick("header_desktop", item.href)}
                className={linkClass(active)}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
