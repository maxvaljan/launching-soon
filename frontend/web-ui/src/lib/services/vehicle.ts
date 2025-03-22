import { supabase } from '../supabase';

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensions: string;
  max_weight: string;
  image_url?: string;
  icon_type?: string;
  custom_icon_url?: string;
  active: boolean;
}

const vehicleCategories: Record<string, string> = {
  'Motorcycle': 'motorcycle',
  'Courier': 'motorcycle',
  'Scooter': 'motorcycle',
  'Sedan': 'car',
  'Car': 'car',
  'MPV': 'car',
  'Van': 'van',
  'Lorry': 'truck',
  'Truck': 'truck',
  'Cargo Truck': 'truck'
};

// Standardize vehicle categories based on the name
const getCategoryFromName = (name: string): string => {
  // Look for any of the category keys in the name
  for (const [key, category] of Object.entries(vehicleCategories)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return category;
    }
  }
  // Default to 'car' if no match is found
  return 'car';
};

// Map vehicle data from the database format to the customer-facing format
const mapVehicleData = (vehicles: any[]): Vehicle[] => {
  return vehicles.map(vehicle => ({
    id: vehicle.id,
    name: vehicle.name,
    // Use explicit icon_type if available, otherwise infer from name
    category: vehicle.icon_type || getCategoryFromName(vehicle.name),
    description: `Base price: ${formatPrice(vehicle.base_price)}, ${formatPricePerKm(vehicle.price_per_km)}`,
    dimensions: vehicle.capacity || 'Standard',
    max_weight: `${vehicle.max_weight} kg`,
    image_url: vehicle.image_url,
    icon_type: vehicle.icon_type,
    custom_icon_url: vehicle.custom_icon_url,
    active: vehicle.active
  }));
};

// Format price helper
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Format price per km helper
const formatPricePerKm = (price: number): string => {
  return `${formatPrice(price)}/km`;
};

export const vehicleService = {
  // Get all active vehicles for customer display
  async getActiveVehicles(): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .eq('active', true)
        .order('base_price', { ascending: true });

      if (error) {
        throw error;
      }

      return data ? mapVehicleData(data) : [];
    } catch (error) {
      console.error('Error fetching active vehicles:', error);
      return [];
    }
  },

  // Get a specific vehicle by ID
  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data ? mapVehicleData([data])[0] : null;
    } catch (error) {
      console.error(`Error fetching vehicle ${id}:`, error);
      return null;
    }
  },

  // Search vehicles by criteria
  async searchVehicles(criteria: {
    minCapacity?: string;
    maxWeight?: number;
    maxPrice?: number;
  }): Promise<Vehicle[]> {
    try {
      let query = supabase
        .from('vehicle_types')
        .select('*')
        .eq('active', true);

      if (criteria.maxWeight) {
        query = query.gte('max_weight', criteria.maxWeight);
      }

      if (criteria.maxPrice) {
        query = query.lte('base_price', criteria.maxPrice);
      }

      const { data, error } = await query.order('base_price', { ascending: true });

      if (error) {
        throw error;
      }

      // Client-side filtering for more complex criteria
      let filteredData = data || [];
      
      if (criteria.minCapacity) {
        // This is just an example - in a real app you'd have a more sophisticated way to compare capacities
        const capacityOrder = ['Small', 'Medium', 'Large', 'Extra Large', 'XXL'];
        const minCapacityIndex = capacityOrder.indexOf(criteria.minCapacity);
        
        if (minCapacityIndex >= 0) {
          filteredData = filteredData.filter(vehicle => {
            const vehicleCapacityIndex = capacityOrder.indexOf(vehicle.capacity);
            return vehicleCapacityIndex >= minCapacityIndex;
          });
        }
      }

      return mapVehicleData(filteredData);
    } catch (error) {
      console.error('Error searching vehicles:', error);
      return [];
    }
  },

  // Get vehicle recommendations based on cargo details
  async getRecommendedVehicles(cargoDetails: {
    weight: number;
    itemCount: number;
    bulky: boolean;
  }): Promise<Vehicle[]> {
    try {
      // Fetch all active vehicles
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .eq('active', true)
        .order('base_price', { ascending: true });

      if (error) {
        throw error;
      }

      // Filter and sort vehicles based on cargo requirements
      let filteredVehicles = data || [];
      
      // Filter by weight requirements
      filteredVehicles = filteredVehicles.filter(v => v.max_weight >= cargoDetails.weight);
      
      // Apply additional filters based on item count and bulkiness
      if (cargoDetails.bulky || cargoDetails.itemCount > 3) {
        // Filter out smaller vehicles
        const smallVehicleCategories = ['Small', 'Medium'];
        filteredVehicles = filteredVehicles.filter(
          v => !smallVehicleCategories.includes(v.capacity)
        );
      }
      
      // Sort by suitability (minimizing excess capacity)
      filteredVehicles.sort((a, b) => {
        // Calculate excess capacity for each vehicle
        const excessA = a.max_weight - cargoDetails.weight;
        const excessB = b.max_weight - cargoDetails.weight;
        
        // First prioritize vehicles that can handle the weight
        if (excessA < 0 && excessB >= 0) return 1;
        if (excessB < 0 && excessA >= 0) return -1;
        if (excessA < 0 && excessB < 0) return excessB - excessA; // Both insufficient, prefer closer to requirement
        
        // If both can handle it, prefer the one with less excess capacity
        return excessA - excessB;
      });

      return mapVehicleData(filteredVehicles);
    } catch (error) {
      console.error('Error getting recommended vehicles:', error);
      return [];
    }
  }
};