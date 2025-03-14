'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  paddingX?: 'none' | 'sm' | 'md' | 'lg';
  paddingY?: 'none' | 'sm' | 'md' | 'lg';
  paddingTop?: 'header' | 'none' | 'sm' | 'md' | 'lg';
  paddingBottom?: 'none' | 'sm' | 'md' | 'lg';
  containerClassName?: string;
  fullHeight?: boolean;
  centered?: boolean;
}

export function PageLayout({
  children,
  className,
  maxWidth = 'xl',
  paddingX = 'md',
  paddingY = 'md',
  paddingTop,
  paddingBottom,
  containerClassName,
  fullHeight = false,
  centered = false,
}: PageLayoutProps) {
  const maxWidthClasses = {
    'xs': 'max-w-xs',
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    'full': 'max-w-full',
    'none': '',
  };

  const paddingXClasses = {
    'none': 'px-0',
    'sm': 'px-4',
    'md': 'px-4 sm:px-6 lg:px-8',
    'lg': 'px-6 sm:px-8 lg:px-12',
  };

  const paddingYClasses = {
    'none': 'py-0',
    'sm': 'py-4',
    'md': 'py-6 sm:py-8',
    'lg': 'py-8 sm:py-12',
  };

  const paddingTopClasses = {
    'none': 'pt-0',
    'sm': 'pt-4',
    'md': 'pt-6 sm:pt-8',
    'lg': 'pt-8 sm:pt-12',
    'header': 'pt-20 sm:pt-24',
  };

  const paddingBottomClasses = {
    'none': 'pb-0',
    'sm': 'pb-4',
    'md': 'pb-6 sm:pb-8',
    'lg': 'pb-8 sm:pb-12',
  };

  return (
    <div 
      className={cn(
        fullHeight ? 'min-h-screen' : '',
        className
      )}
    >
      <div 
        className={cn(
          "mx-auto",
          maxWidthClasses[maxWidth],
          !paddingTop && !paddingBottom ? paddingYClasses[paddingY] : '',
          !paddingTop ? '' : paddingTopClasses[paddingTop],
          !paddingBottom ? '' : paddingBottomClasses[paddingBottom],
          paddingXClasses[paddingX],
          centered ? 'flex flex-col justify-center items-center' : '',
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function PageSection({
  children,
  className,
  maxWidth = 'none',
  paddingX = 'none',
  paddingY = 'md',
  containerClassName,
  id,
}: PageLayoutProps & { id?: string }) {
  const maxWidthClasses = {
    'xs': 'max-w-xs',
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    'full': 'max-w-full',
    'none': '',
  };

  const paddingXClasses = {
    'none': 'px-0',
    'sm': 'px-4',
    'md': 'px-4 sm:px-6 lg:px-8',
    'lg': 'px-6 sm:px-8 lg:px-12',
  };

  const paddingYClasses = {
    'none': 'py-0',
    'sm': 'py-4',
    'md': 'py-6 sm:py-8',
    'lg': 'py-8 sm:py-12',
  };

  return (
    <section 
      id={id}
      className={cn(
        paddingYClasses[paddingY],
        className
      )}
    >
      <div 
        className={cn(
          "mx-auto",
          maxWidthClasses[maxWidth],
          paddingXClasses[paddingX],
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function PageHeader({ 
  title, 
  description,
  className,
  action,
}: { 
  title: string; 
  description?: string;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 text-base text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="ml-4 flex-shrink-0">{action}</div>
        )}
      </div>
    </div>
  );
}