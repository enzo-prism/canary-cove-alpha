'use client'

import * as React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = React.HTMLAttributes<HTMLDivElement> & {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  orientation: 'horizontal' | 'vertical'
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }
  return context
}

function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: CarouselProps) {
  const { tabIndex, ...rest } = props
  const keyThrottleRef = React.useRef<number>(0)
  const resolvedOptions: CarouselOptions = {
    duration: 25,
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    skipSnaps: false,
    slidesToScroll: 1,
    ...opts,
    axis: orientation === 'horizontal' ? 'x' : 'y',
  }
  const [carouselRef, api] = useEmblaCarousel(
    resolvedOptions,
    plugins,
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api])

  const onSelect = React.useCallback(
    (emblaApi: CarouselApi) => {
      if (!emblaApi) return
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    },
    [],
  )

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api, onSelect])

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const now = Date.now()
      if (now - keyThrottleRef.current < 250) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
        keyThrottleRef.current = now
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
        keyThrottleRef.current = now
      }
    },
    [scrollPrev, scrollNext],
  )

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        orientation,
      }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        tabIndex={tabIndex ?? 0}
        {...rest}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation, api } = useCarousel()
  const panClass = orientation === 'horizontal' ? 'touch-pan-y' : 'touch-pan-x'
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const wheelLockRef = React.useRef<number | null>(null)
  const hoverRef = React.useRef(false)

  const handleWheel = React.useCallback(
    (event: WheelEvent) => {
      if (!api) return
      if (wheelLockRef.current) return

      const absX = Math.abs(event.deltaX)
      const absY = Math.abs(event.deltaY)
      const dominance = 1.2
      let delta = 0

      if (orientation === 'horizontal') {
        if (absX > absY * dominance) {
          delta = event.deltaX
        } else if (event.shiftKey && absY > 0) {
          delta = event.deltaY
        }
      } else if (absY > absX * dominance) {
        delta = event.deltaY
      } else if (event.shiftKey && absX > 0) {
        delta = event.deltaX
      }

      if (Math.abs(delta) < 12) return

      event.preventDefault()
      event.stopPropagation()
      wheelLockRef.current = window.setTimeout(() => {
        wheelLockRef.current = null
      }, 350)

      if (delta > 0) {
        api.scrollNext()
      } else {
        api.scrollPrev()
      }
    },
    [api, orientation],
  )

  React.useEffect(() => {
    const node = viewportRef.current
    if (!node) return
    const handleWindowWheel = (event: WheelEvent) => {
      const target = event.target as Node | null
      if (!hoverRef.current && (!target || !node.contains(target))) return
      handleWheel(event)
    }

    window.addEventListener('wheel', handleWindowWheel, { passive: false, capture: true })
    return () => {
      window.removeEventListener('wheel', handleWindowWheel, { capture: true })
      if (wheelLockRef.current) {
        window.clearTimeout(wheelLockRef.current)
        wheelLockRef.current = null
      }
    }
  }, [handleWheel])

  return (
    <div
      ref={(node) => {
        viewportRef.current = node
        carouselRef(node)
      }}
      className={cn(
        'overflow-hidden overscroll-x-contain overscroll-y-contain carousel-viewport',
        panClass,
        'cursor-grab select-none active:cursor-grabbing',
      )}
      onPointerEnter={() => {
        hoverRef.current = true
      }}
      onPointerLeave={() => {
        hoverRef.current = false
      }}
      data-slot="carousel-viewport"
    >
      <div
        ref={ref}
        className={cn(
          'flex carousel-track',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          className,
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = 'CarouselContent'

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full carousel-slide',
        className,
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = 'CarouselItem'

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        'absolute left-0 top-1/2 -translate-y-1/2 hover:opacity-80 motion-safe:hover:-translate-y-1/2 motion-safe:active:-translate-y-1/2',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        'absolute right-0 top-1/2 -translate-y-1/2 hover:opacity-80 motion-safe:hover:-translate-y-1/2 motion-safe:active:-translate-y-1/2',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRightIcon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = 'CarouselNext'

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
}
