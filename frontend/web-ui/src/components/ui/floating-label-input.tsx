'use client';

import { useState, useEffect, ChangeEvent, InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';

// Type definition for FloatingLabelInput props
export interface FloatingLabelInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

// Custom floating label input component
export const FloatingLabelInput = ({
  label,
  value,
  onChange,
  type = 'text',
  className = '',
  id = '',
  ...props
}: FloatingLabelInputProps) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // Update hasValue whenever the value prop changes
  useEffect(() => {
    setHasValue(value.length > 0);
  }, [value]);

  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={e => {
          onChange(e);
          setHasValue(e.target.value.length > 0);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setHasValue(value.length > 0);
        }}
        className={`peer w-full border border-gray-300 rounded-md focus:border-[#294374] bg-transparent h-[50px] px-3 py-2.5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 ${className}`}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute text-gray-500 duration-300 transform transition-all ${
          hasValue || focused
            ? 'text-sm scale-75 -translate-y-3 bg-white px-1 z-10 left-2 top-0'
            : 'text-base left-3 top-1/2 -translate-y-1/2'
        }`}
      >
        {label}
      </label>
    </div>
  );
};
