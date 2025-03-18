'use client';

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import CountryListPackage from 'country-list-with-dial-code-and-flag';

// Format country codes from the package
const formatCountryCodes = () => {
  const countries = CountryListPackage.getAll();
  return countries.map(country => ({
    value: country.dial_code,
    label: `${country.flag} ${country.dial_code}`,
    name: country.name
  }));
};

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CountryCodeSelect = ({ value, onChange }: CountryCodeSelectProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [countryCodes, setCountryCodes] = useState<Array<{value: string, label: string, name: string}>>([]);
  
  useEffect(() => {
    setCountryCodes(formatCountryCodes());
  }, []);

  const filteredCountryCodes = countryCodes.filter(
    code => code.value.includes(searchValue) || 
           code.label.toLowerCase().includes(searchValue.toLowerCase()) ||
           code.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        onChange(value);
        setSearchValue("");
      }}
    >
      <SelectTrigger className="w-[100px] bg-maxmove-navy border border-maxmove-grey text-maxmove-grey focus:bg-maxmove-navy focus:border-maxmove-creme focus:ring-maxmove-creme focus:ring-offset-maxmove-creme">
        <SelectValue placeholder="Select code">
          {countryCodes.find(code => code.value === value)?.label || value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        <div className="px-3 py-2">
          <Input
            placeholder="Search country code or name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mb-2 bg-maxmove-navy border border-maxmove-grey placeholder:text-maxmove-grey focus:bg-maxmove-navy focus:border-maxmove-creme focus:ring-maxmove-creme focus:ring-offset-maxmove-creme"
          />
        </div>
        {filteredCountryCodes.map((code) => (
          <SelectItem key={code.value} value={code.value}>
            <div className="flex items-center">
              <span className="mr-2">{code.label}</span>
              <span className="text-xs text-maxmove-grey truncate max-w-[150px]">{code.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};