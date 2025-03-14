'use client';

import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type FormErrorProps = {
  id?: string;
  message?: string | null;
  type?: 'error' | 'warning' | 'info';
  className?: string;
};

export function FormError({ 
  id, 
  message, 
  type = 'error',
  className,
}: FormErrorProps) {
  if (!message) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-center gap-x-2 rounded text-sm font-medium";
    
    switch (type) {
      case 'error':
        return "text-destructive";
      case 'warning':
        return "text-yellow-600";
      case 'info':
        return "text-blue-600";
      default:
        return "text-destructive";
    }
  };

  return (
    <div 
      id={id} 
      aria-live="polite" 
      className={cn(
        "flex items-center gap-x-2 text-sm", 
        getStyles(),
        className
      )}
    >
      {getIcon()}
      <p>{message}</p>
    </div>
  );
}

export function FormErrors({ 
  errors 
}: { 
  errors?: Record<string, string[] | undefined> 
}) {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      {Object.entries(errors).map(([key, value]) => (
        value?.map((error, i) => (
          <FormError
            key={`${key}-${i}`}
            message={error}
          />
        ))
      ))}
    </div>
  );
}

export function FormSuccess({ 
  message,
}: { 
  message?: string | null;
}) {
  if (!message) {
    return null;
  }

  return (
    <div 
      className="flex items-center gap-x-2 rounded text-sm font-medium text-emerald-600"
    >
      <Info className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}