'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Image from "next/image";

interface VehicleIconProps {
  category: string;
  name?: string;
}

const VehicleIcon = ({ category, name }: VehicleIconProps) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchIcon = async () => {
      if (!name) return;

      const { data: vehicleType } = await supabase
        .from('vehicle_types')
        .select('icon_path')
        .eq('name', name)
        .single();

      if (vehicleType?.icon_path) {
        // Check if the path starts with a slash (public directory)
        if (vehicleType.icon_path.startsWith('/')) {
          setIconUrl(vehicleType.icon_path);
        } else {
          // Otherwise load from Supabase storage
          const { data } = supabase.storage
            .from('vehicles')
            .getPublicUrl(vehicleType.icon_path);
          
          setIconUrl(data.publicUrl);
        }
      }
    };

    fetchIcon();
  }, [name]);

  // If we have a custom icon, use it
  if (iconUrl) {
    return (
      <Image
        src={iconUrl}
        alt={name || category}
        width={192}
        height={112}
        className="object-contain"
      />
    );
  }

  // Special case for small transporter
  if (name === 'Small Transporter') {
    return (
      <Image
        src="/lovable-uploads/54588d60-e6dd-4e18-acd5-58000e4a02c2.png"
        alt="Small Transporter"
        width={192}
        height={112}
        className="object-contain"
      />
    );
  }

  // Special case for medium transporter
  if (name === 'Medium Transporter') {
    return (
      <Image
        src="/lovable-uploads/c2d2fb7f-fd48-4206-8a86-7aca0e62de3b.png"
        alt="Medium Transporter"
        width={192}
        height={112}
        className="object-contain"
      />
    );
  }

  // Special case for 12t and 24t trucks
  if (category === 'heavy_truck' && (name === '12t Truck' || name === '24t Truck')) {
    return (
      <Image
        src="/lovable-uploads/ba6e097a-64d5-4fda-a014-cadf72ca6c51.png"
        alt={name || ''}
        width={208}
        height={128}
        className="object-contain"
      />
    );
  }

  switch (category.toLowerCase()) {
    case 'bike_motorcycle':
      return (
        <Image
          src="/lovable-uploads/857953f5-80ec-4389-98bc-7097f4145a07.png"
          alt="Motorcycle"
          width={128}
          height={128}
          className="object-contain"
        />
      );
    case 'car':
      return (
        <Image
          src="/lovable-uploads/9aeb519c-288d-4889-b33d-d9ebf206e955.png"
          alt="Car"
          width={192}
          height={112}
          className="object-contain"
        />
      );
    case 'van':
      return (
        <Image
          src="/lovable-uploads/7af2546d-2388-456f-b825-72a74dd81844.png"
          alt="Van"
          width={192}
          height={112}
          className="object-contain"
        />
      );
    case 'medium_truck':
      return (
        <Image
          src="/lovable-uploads/caf7c9fe-60a7-4102-b774-af963f25b124.png"
          alt="Medium Truck"
          width={192}
          height={112}
          className="object-contain"
        />
      );
    case 'light_truck':
      return (
        <Image
          src="/lovable-uploads/7d24556b-7600-4818-a036-be44d4d90890.png"
          alt="Light Truck"
          width={192}
          height={112}
          className="object-contain"
        />
      );
    case 'refrigerated':
      return (
        <Image
          src="/lovable-uploads/d542a364-4c46-45aa-a73d-ef400b31db19.png"
          alt="Refrigerated Truck"
          width={128}
          height={128}
          className="object-contain"
        />
      );
    case 'towing':
      return (
        <Image
          src="/lovable-uploads/5ca8634b-d37b-4eb6-8064-8cdafaffbf62.png"
          alt="Towing Truck"
          width={192}
          height={112}
          className="object-contain"
        />
      );
    case 'heavy_truck':
      return (
        <Image
          src="/lovable-uploads/050d7ae9-feac-4a7e-9916-4f1388359109.png"
          alt="Heavy Truck"
          width={208}
          height={128}
          className="object-contain"
        />
      );
    default:
      return (
        <Image
          src="/lovable-uploads/9aeb519c-288d-4889-b33d-d9ebf206e955.png"
          alt="Default Vehicle"
          width={192}
          height={112}
          className="object-contain"
        />
      );
  }
};

export default VehicleIcon;