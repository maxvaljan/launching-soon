'use client';

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { formatWeight, formatDimensions } from "@/lib/vehicleUtils";
import { ChevronRight, Car } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import * as VehicleIcons from "@/components/icons/vehicles";
// Import the vehicle icon components for improved performance and type checking

interface VehicleType {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensions: string;
  max_weight: string;
  icon_type?: string;
  custom_icon_url?: string;
}

interface VehicleCardProps {
  vehicle: VehicleType;
  isSelected?: boolean;
  onSelect?: () => void;
}

const VEHICLE_CARD_HEIGHT = "h-[18.2rem]";
const BASE_CARD_STYLES = "p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group relative overflow-hidden";
const HOVER_ANIMATION_STYLES = "transition-transform duration-300 group-hover:-translate-y-2";
const INFO_PANEL_STYLES = "absolute inset-x-0 bottom-0 bg-maxmove-900 text-white p-4 transform translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0";

const VehicleCard = ({ vehicle, isSelected, onSelect }: VehicleCardProps) => {
  const router = useRouter();

  const handleCardClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push("/signin");
      return;
    }
    
    if (onSelect) {
      onSelect();
    }
  };

  // Render the appropriate vehicle icon
  const renderVehicleIcon = () => {
    // If it has a custom icon URL, use that with fallback
    if (vehicle.custom_icon_url) {
      return (
        <div className="w-16 h-16 relative flex items-center justify-center">
          <img 
            src={vehicle.custom_icon_url} 
            alt={vehicle.name} 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to standard icon if custom SVG fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `<div class="flex items-center justify-center h-16 w-16">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
              </div>`;
            }}
          />
        </div>
      );
    }
    
    // Default to lucide-react Car icon for all vehicles
    return <Car size={48} className="text-maxmove-800" />;
  };

  return (
    <Card 
      className={cn(
        BASE_CARD_STYLES,
        VEHICLE_CARD_HEIGHT,
        isSelected ? 'bg-sky-50 border-sky-500' : 'bg-maxmove-50 hover:border-maxmove-900'
      )}
      onClick={handleCardClick}
    >
      <div className={HOVER_ANIMATION_STYLES}>
        {renderVehicleIcon()}
      </div>
      
      <h3 className={cn("text-lg font-medium text-maxmove-900 mt-3", HOVER_ANIMATION_STYLES)}>
        {vehicle.name}
      </h3>
      
      <div className={INFO_PANEL_STYLES}>
        <p className="text-sm">{vehicle.description}</p>
        <p className="text-xs mt-1">{formatWeight(vehicle.max_weight)}</p>
        <p className="text-xs">{formatDimensions(vehicle.dimensions)}</p>
      </div>
      
      <ChevronRight className="absolute bottom-2 right-2 w-5 h-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Card>
  );
};

export default VehicleCard;