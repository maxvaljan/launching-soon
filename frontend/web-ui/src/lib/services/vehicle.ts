import { supabase } from '../supabase';

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensions: string;
  max_weight: string;
  base_price: number;
  price_per_km: number;
  minimum_distance: number;
  svg_icon?: string;
  active: boolean;
  display_order: number;
  created_at?: string;
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

// Mapping function to ensure consistent data structure
const mapVehicleData = (data: any[]): Vehicle[] => {
  return data.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    dimensions: item.dimensions,
    max_weight: item.max_weight,
    base_price: Number(item.base_price) || 0,
    price_per_km: Number(item.price_per_km) || 0,
    minimum_distance: Number(item.minimum_distance) || 0,
    svg_icon: item.svg_icon || null,
    active: item.active !== undefined ? item.active : true,
    display_order: item.display_order || 0,
    created_at: item.created_at
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
  // Get all vehicles
  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data ? mapVehicleData(data) : [];
    } catch (error) {
      console.error('Error fetching all vehicles:', error);
      return [];
    }
  },

  // Get all active vehicles for customer display
  async getActiveVehicles(): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

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

  // Create a new vehicle
  async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'created_at'>): Promise<Vehicle | null> {
    try {
      // Make API call to the backend instead of direct Supabase access
      const response = await fetch('/api/vehicles/types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create vehicle');
      }

      const result = await response.json();
      return result.data ? mapVehicleData([result.data])[0] : null;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Update a vehicle
  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle | null> {
    try {
      // Make API call to the backend instead of direct Supabase access
      const response = await fetch(`/api/vehicles/types/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || 'Failed to update vehicle';
        
        if (response.status === 403) {
          throw new Error('You do not have permission to update vehicles. Admin access required.');
        }
        
        throw new Error(errorMessage);
      }

      return result.data ? mapVehicleData([result.data])[0] : null;
    } catch (error) {
      console.error(`Error updating vehicle ${id}:`, error);
      throw error;
    }
  },

  // Toggle vehicle active status
  async toggleVehicleActive(id: string): Promise<Vehicle | null> {
    try {
      // Make API call to the backend instead of direct Supabase access
      const response = await fetch(`/api/vehicles/types/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle vehicle status');
      }

      const result = await response.json();
      return result.data ? mapVehicleData([result.data])[0] : null;
    } catch (error) {
      console.error(`Error toggling active status for vehicle ${id}:`, error);
      throw error;
    }
  },

  // Delete a vehicle
  async deleteVehicle(id: string): Promise<boolean> {
    try {
      // Make API call to the backend instead of direct Supabase access
      const response = await fetch(`/api/vehicles/types/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || 'Failed to delete vehicle';
        
        if (response.status === 403) {
          throw new Error('You do not have permission to delete vehicles. Admin access required.');
        }
        
        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting vehicle ${id}:`, error);
      throw error;
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