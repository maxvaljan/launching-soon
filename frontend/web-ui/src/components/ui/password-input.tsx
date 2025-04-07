'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FloatingLabelInput, FloatingLabelInputProps } from './floating-label-input';

// Extending FloatingLabelInputProps but omitting the type property since we handle it internally
export type PasswordInputProps = Omit<FloatingLabelInputProps, 'type'>;

export const PasswordInput = ({
  label,
  value,
  onChange,
  className = '',
  id = 'password',
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative h-[50px] border border-gray-300 rounded-md focus-within:border-[#294374] focus-within:ring-0 focus-within:ring-offset-0">
      <FloatingLabelInput
        id={id}
        label={label}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className={`border-none pr-10 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
};
