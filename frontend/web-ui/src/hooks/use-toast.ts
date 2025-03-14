'use client';

import { toast as sonnerToast } from 'sonner';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading' | 'destructive';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const toast = (options: ToastOptions) => {
    const { title, description, variant = 'default', duration, action } = options;

    const type = variant === 'destructive' ? 'error' : variant;
    
    // Different method call based on type
    if (type === 'success') {
      sonnerToast.success(title || '', {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        className: `toast-${type}`
      });
    } else if (type === 'error') {
      sonnerToast.error(title || '', {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        className: `toast-${type}`
      });
    } else if (type === 'warning') {
      sonnerToast.warning(title || '', {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        className: `toast-${type}`
      });
    } else if (type === 'info') {
      sonnerToast.info(title || '', {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        className: `toast-${type}`
      });
    } else if (type === 'loading') {
      sonnerToast.loading(title || '', {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        className: `toast-${type}`
      });
    } else {
      sonnerToast(title || '', {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        className: `toast-${type}`
      });
    }
  };

  return { toast };
}