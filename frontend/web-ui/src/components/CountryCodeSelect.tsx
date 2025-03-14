'use client';

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const countryCodes = [
  { value: "+49", label: "🇩🇪 +49" }, // Germany first
  { value: "+43", label: "🇦🇹 +43" }, // Austria
  { value: "+32", label: "🇧🇪 +32" }, // Belgium
  { value: "+359", label: "🇧🇬 +359" }, // Bulgaria
  { value: "+385", label: "🇭🇷 +385" }, // Croatia
  { value: "+357", label: "🇨🇾 +357" }, // Cyprus
  { value: "+420", label: "🇨🇿 +420" }, // Czech Republic
  { value: "+45", label: "🇩🇰 +45" }, // Denmark
  { value: "+372", label: "🇪🇪 +372" }, // Estonia
  { value: "+358", label: "🇫🇮 +358" }, // Finland
  { value: "+33", label: "🇫🇷 +33" }, // France
  { value: "+30", label: "🇬🇷 +30" }, // Greece
  { value: "+36", label: "🇭🇺 +36" }, // Hungary
  { value: "+353", label: "🇮🇪 +353" }, // Ireland
  { value: "+39", label: "🇮🇹 +39" }, // Italy
  { value: "+371", label: "🇱🇻 +371" }, // Latvia
  { value: "+370", label: "🇱🇹 +370" }, // Lithuania
  { value: "+352", label: "🇱🇺 +352" }, // Luxembourg
  { value: "+356", label: "🇲🇹 +356" }, // Malta
  { value: "+31", label: "🇳🇱 +31" }, // Netherlands
  { value: "+48", label: "🇵🇱 +48" }, // Poland
  { value: "+351", label: "🇵🇹 +351" }, // Portugal
  { value: "+40", label: "🇷🇴 +40" }, // Romania
  { value: "+421", label: "🇸🇰 +421" }, // Slovakia
  { value: "+386", label: "🇸🇮 +386" }, // Slovenia
  { value: "+34", label: "🇪🇸 +34" }, // Spain
  { value: "+46", label: "🇸🇪 +46" }, // Sweden
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CountryCodeSelect = ({ value, onChange }: CountryCodeSelectProps) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredCountryCodes = countryCodes.filter(
    code => code.value.includes(searchValue) || code.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        onChange(value);
        setSearchValue(value);
      }}
    >
      <SelectTrigger className="w-[100px] bg-white/80 border-0">
        <SelectValue placeholder="Select code">
          {countryCodes.find(code => code.value === value)?.label || value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="px-3 py-2">
          <Input
            placeholder="Search country code..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mb-2"
          />
        </div>
        {filteredCountryCodes.map((code) => (
          <SelectItem key={code.value} value={code.value}>
            {code.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};