import React, { useState } from 'react';
import { Image, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { MotorcycleSvg, CarSvg, VanSvg, TruckSvg } from '@/assets/images/vehicles';
import { getVehicleImageUrl } from '@/services/api';

interface VehicleImageProps {
  vehicle: {
    name: string;
    category?: string;
    custom_icon_url?: string | null;
    icon_path?: string | null;
    svg_icon?: string | null;
  };
  style?: StyleProp<ImageStyle | ViewStyle>;
}

export function VehicleImage({ vehicle, style }: VehicleImageProps) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  
  // Try to get icon URL in priority order
  let iconUrl = null;
  if (!imageLoadFailed) {
    if (vehicle.custom_icon_url) {
      iconUrl = vehicle.custom_icon_url;
    } else if (vehicle.icon_path) {
      iconUrl = getVehicleImageUrl(vehicle.icon_path);
    } else if (vehicle.svg_icon && vehicle.svg_icon.startsWith('http')) {
      // Only use svg_icon if it's a URL
      iconUrl = vehicle.svg_icon;
    }
  }
  
  // If we have a valid URL and haven't had a load failure, try to load the image
  if (iconUrl && !imageLoadFailed) {
    return (
      <Image 
        source={{ uri: iconUrl }} 
        style={style} 
        resizeMode="contain"
        onError={() => {
          console.warn(`Failed to load vehicle image for ${vehicle.name}: ${iconUrl}`);
          setImageLoadFailed(true);
        }}
      />
    );
  }
  
  // Fallback to SVG icons based on vehicle category or name
  const typeName = (vehicle.category || vehicle.name || '').toLowerCase();
  
  if (typeName.includes('motorcycle') || typeName.includes('courier') || typeName.includes('bike')) {
    return <MotorcycleSvg style={style} />;
  } else if (typeName.includes('van') || typeName.includes('transporter')) {
    return <VanSvg style={style} />;
  } else if (typeName.includes('truck') || typeName.includes('lorry')) {
    return <TruckSvg style={style} />;
  } else {
    return <CarSvg style={style} />;
  }
}