'use client';

import React, { forwardRef } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './select';
import { Checkbox } from './checkbox';
import { Switch } from './switch';
import { Label } from './label';
import { FormError } from './form-error';
import { Eye, EyeOff, HelpCircle, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

// Base Field Props
interface BaseFieldProps {
  label?: string;
  id: string;
  error?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  hideLabel?: boolean;
  showRequiredIndicator?: boolean;
}

// Text Field Props
export interface TextFieldProps extends BaseFieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showPasswordToggle?: boolean;
}

// Textarea Field Props
export interface TextareaFieldProps extends BaseFieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  rows?: number;
}

// Select Field Props
export interface SelectFieldProps extends BaseFieldProps {
  options: { value: string; label: string; disabled?: boolean }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

// Checkbox Field Props
export interface CheckboxFieldProps extends BaseFieldProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

// Switch Field Props
export interface SwitchFieldProps extends BaseFieldProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

// Text Field Component
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ 
    label, 
    id, 
    error, 
    description, 
    required, 
    disabled, 
    className, 
    labelClassName,
    type = 'text',
    icon,
    iconPosition = 'left',
    showPasswordToggle = false,
    hideLabel = false,
    showRequiredIndicator = true,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className={cn("space-y-2", className)}>
        {label && !hideLabel && (
          <div className="flex items-center justify-between">
            <Label 
              htmlFor={id} 
              className={cn(
                "text-sm font-medium flex items-center gap-1", 
                error ? "text-destructive" : "",
                labelClassName
              )}
            >
              {label}
              {required && showRequiredIndicator && (
                <span className="text-destructive">*</span>
              )}
              {description && (
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              )}
            </Label>
          </div>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <Input
            id={id}
            type={inputType}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
            required={required}
            className={cn(
              error ? "border-destructive focus-visible:ring-destructive" : "",
              icon && iconPosition === 'left' ? "pl-10" : "",
              (icon && iconPosition === 'right') || (type === 'password' && showPasswordToggle) ? "pr-10" : ""
            )}
            ref={ref}
            {...props}
          />
          
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          
          {icon && iconPosition === 'right' && !showPasswordToggle && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
        </div>
        
        {description && !error && (
          <p id={`${id}-description`} className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        
        {error && (
          <FormError id={`${id}-error`} message={error} />
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

// Textarea Field Component
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ 
    label, 
    id, 
    error, 
    description, 
    required, 
    disabled, 
    className, 
    labelClassName,
    rows = 3,
    hideLabel = false,
    showRequiredIndicator = true,
    ...props 
  }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && !hideLabel && (
          <div className="flex items-center justify-between">
            <Label 
              htmlFor={id} 
              className={cn(
                "text-sm font-medium flex items-center gap-1", 
                error ? "text-destructive" : "",
                labelClassName
              )}
            >
              {label}
              {required && showRequiredIndicator && (
                <span className="text-destructive">*</span>
              )}
              {description && (
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              )}
            </Label>
          </div>
        )}
        
        <Textarea
          id={id}
          disabled={disabled}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
          required={required}
          className={cn(
            error ? "border-destructive focus-visible:ring-destructive" : ""
          )}
          ref={ref}
          {...props}
        />
        
        {description && !error && (
          <p id={`${id}-description`} className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        
        {error && (
          <FormError id={`${id}-error`} message={error} />
        )}
      </div>
    );
  }
);

TextareaField.displayName = 'TextareaField';

// Select Field Component
export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  ({ 
    label, 
    id, 
    error, 
    description, 
    required, 
    disabled, 
    className, 
    labelClassName,
    options,
    value,
    onChange,
    placeholder,
    hideLabel = false,
    showRequiredIndicator = true,
    ...props 
  }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && !hideLabel && (
          <div className="flex items-center justify-between">
            <Label 
              htmlFor={id} 
              className={cn(
                "text-sm font-medium flex items-center gap-1", 
                error ? "text-destructive" : "",
                labelClassName
              )}
            >
              {label}
              {required && showRequiredIndicator && (
                <span className="text-destructive">*</span>
              )}
              {description && (
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              )}
            </Label>
          </div>
        )}
        
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger 
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
            ref={ref}
            className={cn(
              error ? "border-destructive focus-visible:ring-destructive" : ""
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {description && !error && (
          <p id={`${id}-description`} className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        
        {error && (
          <FormError id={`${id}-error`} message={error} />
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

// Checkbox Field Component
export const CheckboxField = forwardRef<HTMLButtonElement, CheckboxFieldProps>(
  ({ 
    label, 
    id, 
    error, 
    description, 
    required, 
    disabled, 
    className, 
    labelClassName,
    checked,
    onCheckedChange,
    hideLabel = false,
    showRequiredIndicator = true,
    ...props 
  }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            ref={ref}
            className={cn(
              error ? "border-destructive focus-visible:ring-destructive" : ""
            )}
          />
          {label && (
            <Label 
              htmlFor={id} 
              className={cn(
                "text-sm font-medium flex items-center gap-1", 
                error ? "text-destructive" : "",
                labelClassName
              )}
            >
              {label}
              {required && showRequiredIndicator && (
                <span className="text-destructive">*</span>
              )}
            </Label>
          )}
        </div>
        
        {description && !error && (
          <p id={`${id}-description`} className="text-xs text-muted-foreground pl-6">
            {description}
          </p>
        )}
        
        {error && (
          <div className="pl-6">
            <FormError id={`${id}-error`} message={error} />
          </div>
        )}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

// Switch Field Component
export const SwitchField = forwardRef<HTMLButtonElement, SwitchFieldProps>(
  ({ 
    label, 
    id, 
    error, 
    description, 
    required, 
    disabled, 
    className, 
    labelClassName,
    checked,
    onCheckedChange,
    hideLabel = false,
    showRequiredIndicator = true,
    ...props 
  }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          {label && (
            <Label 
              htmlFor={id} 
              className={cn(
                "text-sm font-medium flex items-center gap-1", 
                error ? "text-destructive" : "",
                labelClassName
              )}
            >
              {label}
              {required && showRequiredIndicator && (
                <span className="text-destructive">*</span>
              )}
            </Label>
          )}
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            ref={ref}
            className={cn(
              error ? "border-destructive focus-visible:ring-destructive" : ""
            )}
          />
        </div>
        
        {description && !error && (
          <p id={`${id}-description`} className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        
        {error && (
          <FormError id={`${id}-error`} message={error} />
        )}
      </div>
    );
  }
);

SwitchField.displayName = 'SwitchField';