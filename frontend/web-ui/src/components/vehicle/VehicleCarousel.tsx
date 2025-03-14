'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import VehicleCard from "./VehicleCard";
import { getVehicleSortOrder } from "@/lib/vehicleUtils";

interface VehicleType {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensions: string;
  max_weight: string;
}

interface VehicleCarouselProps {
  vehicles: VehicleType[];
  selectedVehicle?: string | null;
  onVehicleSelect?: (vehicleId: string) => void;
}

const VehicleCarousel = ({ vehicles, selectedVehicle, onVehicleSelect }: VehicleCarouselProps) => {
  if (!vehicles.length) return null;

  const sortedVehicles = [...vehicles].sort((a, b) => {
    const orderA = getVehicleSortOrder(a);
    const orderB = getVehicleSortOrder(b);
    return orderA - orderB;
  });

  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
        skipSnaps: true,
        dragFree: false
      }}
    >
      <CarouselContent className="-ml-4">
        {sortedVehicles.map((vehicle) => (
          <CarouselItem key={vehicle.id} className="pl-4 basis-[275px]">
            <VehicleCard 
              vehicle={vehicle} 
              isSelected={selectedVehicle === vehicle.id}
              onSelect={() => onVehicleSelect?.(vehicle.id)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-maxmove-50 border-maxmove-900 text-maxmove-900 hover:text-maxmove-900" />
      <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-maxmove-50 border-maxmove-900 text-maxmove-900 hover:text-maxmove-900" />
    </Carousel>
  );
};

export default VehicleCarousel;