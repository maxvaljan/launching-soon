'use client';

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loadingVariants = cva(
  "text-center",
  {
    variants: {
      variant: {
        spinner: "relative inline-flex",
        skeleton: "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
        dots: "inline-flex space-x-1",
        bar: "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
      },
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
        full: "w-full",
        auto: "",
      },
    },
    defaultVariants: {
      variant: "spinner",
      size: "md",
    },
  }
);

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  isLoading?: boolean;
  text?: string;
  textPosition?: 'left' | 'right' | 'top' | 'bottom';
  fullScreen?: boolean;
}

export function Loading({
  className,
  variant,
  size,
  isLoading = true,
  text,
  textPosition = 'right',
  fullScreen = false,
  ...props
}: LoadingProps) {
  if (!isLoading) return null;

  const renderLoadingIndicator = () => {
    switch (variant) {
      case "spinner":
        return (
          <div className={cn(loadingVariants({ variant, size, className }))} {...props}>
            <svg
              className="animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        );
      case "skeleton":
        return (
          <div
            className={cn(loadingVariants({ variant, size, className }))}
            {...props}
          />
        );
      case "dots":
        return (
          <div className={cn(loadingVariants({ variant, size: 'auto', className }))} {...props}>
            <div className={cn(`bg-current rounded-full animate-bounce`, loadingVariants({ size }))}></div>
            <div className={cn(`bg-current rounded-full animate-bounce animation-delay-200`, loadingVariants({ size }))}></div>
            <div className={cn(`bg-current rounded-full animate-bounce animation-delay-400`, loadingVariants({ size }))}></div>
          </div>
        );
      case "bar":
        return (
          <div className={cn(loadingVariants({ variant, size: 'full', className }), "h-2")} {...props}>
            <div
              className="h-full bg-primary animate-bar-progress"
              style={{ width: "30%" }}
            ></div>
          </div>
        );
      default:
        return (
          <div className={cn(loadingVariants({ variant, size, className }))} {...props}>
            <svg
              className="animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        );
    }
  };

  const renderWithText = () => {
    if (!text) return renderLoadingIndicator();

    const flexClasses = {
      'left': 'flex-row-reverse items-center gap-2',
      'right': 'flex items-center gap-2',
      'top': 'flex-col-reverse items-center gap-1',
      'bottom': 'flex-col items-center gap-1',
    };

    return (
      <div className={`flex ${flexClasses[textPosition]}`}>
        {renderLoadingIndicator()}
        <span className="text-sm">{text}</span>
      </div>
    );
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
        {renderWithText()}
      </div>
    );
  }

  return renderWithText();
}

// Add a new variant to our Button component by extending it
export function LoadingButton({
  children,
  isLoading,
  loadingText = "Loading...",
  ...props
}: React.ComponentProps<"button"> & {
  isLoading?: boolean;
  loadingText?: string;
}) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
        props.className
      )}
    >
      {isLoading ? (
        <>
          <Loading variant="spinner" size="xs" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Create a specialized component for page-level loading
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loading variant="spinner" size="lg" className="text-primary mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}