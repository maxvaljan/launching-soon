'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import VehicleCarousel from './vehicle/VehicleCarousel';
import { Card } from './ui/card';
import { Info } from 'lucide-react';

interface VehicleType {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensions: string;
  max_weight: string;
}

interface VehicleSelectionProps {
  onVehicleSelect: (vehicleId: string | null) => void;
}

export default function VehicleSelection({ onVehicleSelect }: VehicleSelectionProps) {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState<VehicleType | null>(null);

  useEffect(() => {
    async function fetchVehicleTypes() {
      try {
        // Use relative URL for API endpoints in Next.js
        const response = await fetch('/api/vehicles/types');
        
        if (response.ok) {
          const data = await response.json();
          setVehicleTypes(data.data || []);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('API fetch failed, falling back to Supabase');
      }

      // Fallback to direct Supabase query
      try {
        const { data, error } = await supabase
          .from('vehicle_types')
          .select('*');

        if (error) throw error;
        setVehicleTypes(data || []);
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicleTypes();
  }, []);

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    const selectedVehicle = vehicleTypes.find(v => v.id === vehicleId) || null;
    setSelectedVehicleDetails(selectedVehicle);
    onVehicleSelect(vehicleId);
  };

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <div className="h-8 w-48 animate-pulse bg-slate-200 rounded-md"></div>
        <div className="h-48 animate-pulse bg-slate-200 rounded-md"></div>
      </Card>
    );
  }

  // Sort vehicles by name or a specific sort order
  const sortedVehicleTypes = [...vehicleTypes].sort((a, b) => {
    // You can sort by name, category, or any other property
    return a.name.localeCompare(b.name);
  });

  return (
    <Card className="p-6 space-y-6 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center">
        <Label className="text-xl font-semibold text-maxmove-primary">Select Vehicle Type</Label>
        {selectedVehicleDetails && (
          <div className="flex items-center text-sm text-maxmove-700 bg-maxmove-50 px-3 py-1 rounded-full">
            <span>Selected: {selectedVehicleDetails.name}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedVehicleTypes.map(vehicle => (
          <Card 
            key={vehicle.id}
            className={`h-40 p-4 cursor-pointer transition-all ${
              selectedVehicle === vehicle.id 
                ? 'border-2 border-maxmove-primary shadow-md' 
                : 'hover:border-maxmove-200 hover:shadow-sm'
            }`}
            onClick={() => handleVehicleSelect(vehicle.id)}
          >
            <div className="flex flex-col items-center justify-between h-full">
              <div className="text-center space-y-1">
                <div className="text-3xl mb-2">
                  {/* This could be replaced with your vehicle icon component */}
                  {vehicle.category.includes('car') ? '🚗' : 
                   vehicle.category.includes('van') ? '🚐' : 
                   vehicle.category.includes('truck') ? '🚚' : 
                   vehicle.category.includes('bike') ? '🛵' : '🚚'}
                </div>
                <h3 className="font-semibold text-maxmove-800">{vehicle.name}</h3>
                <p className="text-xs text-gray-500 truncate max-w-full">{vehicle.description}</p>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {vehicle.max_weight && `Max: ${vehicle.max_weight}`}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}