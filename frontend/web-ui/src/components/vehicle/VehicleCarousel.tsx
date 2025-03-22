'use client';

import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import VehicleCard from "./VehicleCard";
import { getVehicleSortOrder } from "@/lib/vehicleUtils";
import { Vehicle, vehicleService } from "@/lib/services/vehicle";
import { cn } from '@/lib/utils';

interface VehicleCarouselProps {
  selectedVehicle?: string | null;
  onVehicleSelect?: (vehicleId: string) => void;
  className?: string;
  static?: boolean; // If true, uses static data instead of fetching from DB
}

const VehicleCarousel = ({ 
  selectedVehicle, 
  onVehicleSelect, 
  className,
  static: useStaticData = false
}: VehicleCarouselProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useStaticData) {
      setVehicles(staticVehicles);
      setLoading(false);
      return;
    }

    const loadVehicles = async () => {
      try {
        setLoading(true);
        const activeVehicles = await vehicleService.getActiveVehicles();
        setVehicles(activeVehicles);
      } catch (error) {
        console.error('Error loading vehicles:', error);
        // Fallback to static data if DB fetch fails
        setVehicles(staticVehicles);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, [useStaticData]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading vehicles...</div>
      </div>
    );
  }

  if (!vehicles.length) return null;

  const sortedVehicles = [...vehicles].sort((a, b) => {
    const orderA = getVehicleSortOrder(a);
    const orderB = getVehicleSortOrder(b);
    return orderA - orderB;
  });

  return (
    <Carousel
      className={cn("w-full", className)}
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

// Static vehicle data for fallback
const staticVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Motorcycle',
    category: 'motorcycle',
    description: 'Small deliveries, quick transport',
    dimensions: 'Small',
    max_weight: '20 kg',
    active: true
  },
  {
    id: '2',
    name: 'Sedan',
    category: 'car',
    description: 'Standard deliveries, mid-sized packages',
    dimensions: 'Medium',
    max_weight: '150 kg',
    active: true
  },
  {
    id: '3',
    name: 'Van',
    category: 'van',
    description: 'Large deliveries, furniture, appliances',
    dimensions: 'Large',
    max_weight: '500 kg',
    active: true
  },
  {
    id: '4',
    name: 'Truck',
    category: 'truck',
    description: 'Heavy freight, multiple items',
    dimensions: 'Extra Large',
    max_weight: '1500 kg',
    active: true
  },
  {
    id: '5',
    name: 'Cargo Truck',
    category: 'truck',
    description: 'Commercial loads, bulk transportation',
    dimensions: 'XXL',
    max_weight: '3000 kg',
    active: true
  }
];

export default VehicleCarousel;