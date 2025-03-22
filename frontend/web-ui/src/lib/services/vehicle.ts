import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
    category: item.category || getCategoryFromName(item.name),
    description: item.description,
    dimensions: item.dimensions || item.max_dimensions, // Handle both field names
    max_weight: item.max_weight,
    base_price: Number(item.base_price) || 0,
    price_per_km: Number(item.price_per_km) || 0,
    minimum_distance: Number(item.minimum_distance) || 0,
    svg_icon: item.svg_icon || item.icon_path || null, // Handle both field names
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
      // Use the API route instead of direct Supabase access
      const response = await fetch('/api/vehicles/types', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch vehicles');
      }

      return result.data ? mapVehicleData(result.data) : [];
    } catch (error) {
      console.error('Error fetching all vehicles:', error);
      return [];
    }
  },

  // Get all active vehicles for customer display
  async getActiveVehicles(): Promise<Vehicle[]> {
    try {
      // Use the API route with active filter
      const response = await fetch('/api/vehicles/types?active=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch active vehicles');
      }

      return result.data ? mapVehicleData(result.data) : [];
    } catch (error) {
      console.error('Error fetching active vehicles:', error);
      return [];
    }
  },

  // Get a specific vehicle by ID
  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      // Use the API route instead of direct Supabase access
      const response = await fetch(`/api/vehicles/types/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Failed to fetch vehicle ${id}`);
      }

      return result.data ? mapVehicleData([result.data])[0] : null;
    } catch (error) {
      console.error(`Error fetching vehicle ${id}:`, error);
      return null;
    }
  },

  // Create a new vehicle
  async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'created_at'>): Promise<Vehicle | null> {
    try {
      // Transform data to match database column names
      const dbVehicleData = {
        name: vehicleData.name,
        description: vehicleData.description,
        max_dimensions: vehicleData.dimensions, 
        max_weight: vehicleData.max_weight,
        base_price: vehicleData.base_price,
        price_per_km: vehicleData.price_per_km,
        minimum_distance: vehicleData.minimum_distance,
        icon_path: vehicleData.svg_icon,
        active: vehicleData.active,
        // Omit category and display_order as they don't exist in DB
      };

      // Make API call to the backend instead of direct Supabase access
      const response = await fetch('/api/vehicles/types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbVehicleData),
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
      // Transform data to match database column names
      const dbVehicleData: any = {};
      
      if (vehicleData.name) dbVehicleData.name = vehicleData.name;
      if (vehicleData.description) dbVehicleData.description = vehicleData.description;
      if (vehicleData.dimensions) dbVehicleData.max_dimensions = vehicleData.dimensions;
      if (vehicleData.max_weight) dbVehicleData.max_weight = vehicleData.max_weight;
      if (vehicleData.base_price !== undefined) dbVehicleData.base_price = vehicleData.base_price;
      if (vehicleData.price_per_km !== undefined) dbVehicleData.price_per_km = vehicleData.price_per_km;
      if (vehicleData.minimum_distance !== undefined) dbVehicleData.minimum_distance = vehicleData.minimum_distance;
      if (vehicleData.svg_icon !== undefined) dbVehicleData.icon_path = vehicleData.svg_icon;
      if (vehicleData.active !== undefined) dbVehicleData.active = vehicleData.active;
      // Omit category and display_order as they don't exist in DB

      // Make API call to the backend instead of direct Supabase access
      const response = await fetch(`/api/vehicles/types/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbVehicleData),
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
      // Use the API route with active filter
      const response = await fetch('/api/vehicles/types?active=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch vehicles for search');
      }

      // Get all active vehicles
      let vehicles = result.data ? mapVehicleData(result.data) : [];

      // Client-side filtering for criteria
      if (criteria.maxWeight) {
        // Parse max_weight string to extract numeric value for comparison
        vehicles = vehicles.filter(vehicle => {
          const weightMatch = vehicle.max_weight.match(/(\d+)/);
          const weightValue = weightMatch ? parseInt(weightMatch[0], 10) : 0;
          return weightValue >= criteria.maxWeight!;
        });
      }

      if (criteria.maxPrice) {
        vehicles = vehicles.filter(vehicle => vehicle.base_price <= criteria.maxPrice!);
      }

      // Sort by price
      return vehicles.sort((a, b) => a.base_price - b.base_price);
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
      // Use the API route with active filter
      const response = await fetch('/api/vehicles/types?active=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch vehicles for recommendations');
      }

      // Get all active vehicles
      let vehicles = result.data ? mapVehicleData(result.data) : [];

      // Filter by weight requirements
      vehicles = vehicles.filter(vehicle => {
        // Parse max_weight string to extract numeric value for comparison
        const weightMatch = vehicle.max_weight.match(/(\d+)/);
        const weightValue = weightMatch ? parseInt(weightMatch[0], 10) : 0;
        return weightValue >= cargoDetails.weight;
      });
      
      // Apply additional filters based on item count and bulkiness
      if (cargoDetails.bulky || cargoDetails.itemCount > 3) {
        // Filter out smaller vehicles based on name and dimensions
        vehicles = vehicles.filter(vehicle => {
          // Check if the name contains words suggesting a larger vehicle
          const isLarger = /(truck|van|transporter|lorry)/i.test(vehicle.name);
          
          // Parse dimensions to get a rough volume estimate
          const dimensionsMatch = vehicle.dimensions.match(/(\d+)\s*[x×]\s*(\d+)\s*[x×]\s*(\d+)/i);
          let volume = 0;
          if (dimensionsMatch) {
            volume = parseInt(dimensionsMatch[1], 10) * 
                    parseInt(dimensionsMatch[2], 10) * 
                    parseInt(dimensionsMatch[3], 10);
          }
          
          // Consider it large enough if it's a larger vehicle type or has sufficient volume
          return isLarger || volume > 500000; // 50cm x 50cm x 200cm = 500,000 cubic cm
        });
      }
      
      // Sort by suitability (minimizing excess capacity)
      vehicles.sort((a, b) => {
        // Calculate weight excess for each vehicle
        const weightMatchA = a.max_weight.match(/(\d+)/);
        const weightMatchB = b.max_weight.match(/(\d+)/);
        
        const weightA = weightMatchA ? parseInt(weightMatchA[0], 10) : 0;
        const weightB = weightMatchB ? parseInt(weightMatchB[0], 10) : 0;
        
        const excessA = weightA - cargoDetails.weight;
        const excessB = weightB - cargoDetails.weight;
        
        // First prioritize vehicles that can handle the weight
        if (excessA < 0 && excessB >= 0) return 1;
        if (excessB < 0 && excessA >= 0) return -1;
        if (excessA < 0 && excessB < 0) return excessB - excessA; // Both insufficient, prefer closer to requirement
        
        // If both can handle it, prefer the one with less excess capacity
        return excessA - excessB;
      });

      return vehicles;
    } catch (error) {
      console.error('Error getting recommended vehicles:', error);
      return [];
    }
  }
};