import React, { useState } from 'react';
import { Image, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import {
  MotorcycleSvg,
  CarSvg,
  VanSvg,
  TruckSvg,
} from '@/assets/images/vehicles';
import { getVehicleImageUrl } from '@/services/supabase';

interface VehicleImageProps {
  vehicle: {
    name: string;
    category?: string;
    icon_path?: string | null;
  };
  style?: StyleProp<ImageStyle | ViewStyle>;
}

/**
 * Component to display vehicle images with proper fallbacks
 * Uses direct Supabase storage URLs
 */
export function VehicleImage({ vehicle, style }: VehicleImageProps) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  // Get iconUrl using the simplified Supabase implementation
  const iconUrl = !imageLoadFailed
    ? getVehicleImageUrl(vehicle.icon_path, vehicle.name)
    : null;

  // If we have a valid URL and no load failure, show the image
  if (iconUrl && !imageLoadFailed) {
    return (
      <Image
        source={{ uri: iconUrl }}
        style={style}
        resizeMode="contain"
        onError={() => {
          console.warn(`Failed to load vehicle image: ${iconUrl}`);
          setImageLoadFailed(true);
        }}
      />
    );
  }

  // Fallback to SVG icons based on vehicle category or name
  const typeName = (vehicle.category || vehicle.name || '').toLowerCase();

  if (
    typeName.includes('motorcycle') ||
    typeName.includes('courier') ||
    typeName.includes('bike')
  ) {
    return <MotorcycleSvg style={style} />;
  } else if (typeName.includes('van') || typeName.includes('transporter')) {
    return <VanSvg style={style} />;
  } else if (typeName.includes('truck') || typeName.includes('lorry')) {
    return <TruckSvg style={style} />;
  } else {
    return <CarSvg style={style} />;
  }
}
