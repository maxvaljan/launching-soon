"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const bannerVariants = cva(
  "relative w-full",
  {
    variants: {
      variant: {
        default: "bg-background border border-border",
        muted: "bg-muted",
        primary: "bg-primary text-primary-foreground",
        border: "border-b border-border",
      },
      size: {
        sm: "px-4 py-2",
        default: "px-4 py-3",
        lg: "px-4 py-3 md:py-2",
      },
      rounded: {
        none: "",
        default: "rounded-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "none",
    }
  }
)

interface BannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof bannerVariants> {
  icon?: React.ReactNode
  action?: React.ReactNode
  onClose?: () => void
  isClosable?: boolean
  layout?: "row" | "center" | "complex"
  title?: React.ReactNode
  description?: React.ReactNode
  show?: boolean
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded, 
    icon, 
    action, 
    onClose, 
    isClosable = true, 
    layout = "row", 
    title,
    description,
    show = true,
    children, 
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(show)

    React.useEffect(() => {
      setIsVisible(show)
    }, [show])

    if (!isVisible) return null

    const handleClose = () => {
      setIsVisible(false)
      onClose?.()
    }

    const innerContent = (
      <div className={cn(
        "flex gap-2",
        layout === "center" && "justify-center",
        layout === "complex" && "md:items-center"
      )}>
        {layout === "complex" ? (
          <div className="flex grow gap-3 md:items-center">
            {icon && (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 max-md:mt-0.5">
                {icon}
              </div>
            )}
            <div className={cn(
              "flex grow",
              layout === "complex" && "flex-col justify-between gap-3 md:flex-row md:items-center"
            )}>
              {title && <div className="space-y-0.5">
                <p className="text-sm font-medium">{title}</p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>}
              {children}
              {action && (
                <div className="flex gap-2 max-md:flex-wrap">
                  {action}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {icon && (
              <div className="flex shrink-0 items-center gap-3">
                {icon}
              </div>
            )}
            <div className="flex grow items-center justify-between gap-3">
              {title && <p className="text-sm font-medium">{title}</p>}
              {children}
            </div>
          </>
        )}
        {isClosable && (
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={handleClose}
            aria-label="Close banner"
          >
            <X
              size={16}
              strokeWidth={2}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        )}
      </div>
    )

    return (
      <div
        ref={ref}
        className={cn(bannerVariants({ variant, size, rounded }), className)}
        {...props}
      >
        {innerContent}
      </div>
    )
  }
)
Banner.displayName = "Banner"

export { Banner, type BannerProps } 