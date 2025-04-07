'use client';

import { Dispatch, SetStateAction } from 'react';
import { CountryCodeSelect } from '@/components/CountryCodeSelect';
import { FloatingLabelInput, FloatingLabelInputProps } from './floating-label-input';

export interface PhoneInputProps extends Omit<FloatingLabelInputProps, 'className'> {
  countryCode: string;
  onCountryCodeChange: Dispatch<SetStateAction<string>>;
  inputClassName?: string;
}

export const PhoneInput = ({
  label,
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  id = 'phoneNumber',
  inputClassName = '',
  ...props
}: PhoneInputProps) => {
  return (
    <div className="flex items-stretch gap-2">
      <CountryCodeSelect
        value={countryCode}
        onChange={onCountryCodeChange}
        className="border border-gray-300 rounded-md focus:border-[#294374] bg-transparent h-[50px] px-3 py-2.5 w-auto text-sm focus:ring-0 focus:ring-offset-0"
      />
      <div className="flex-1 relative">
        <FloatingLabelInput
          id={id}
          label={label}
          value={value}
          onChange={onChange}
          className={inputClassName}
          {...props}
        />
      </div>
    </div>
  );
};
