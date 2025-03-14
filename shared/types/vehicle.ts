/**
 * Vehicle category enum
 */
export enum VehicleCategory {
  BIKE_MOTORCYCLE = 'bike_motorcycle',
  CAR = 'car',
  VAN = 'van',
  LIGHT_TRUCK = 'light_truck',
  MEDIUM_TRUCK = 'medium_truck',
  HEAVY_TRUCK = 'heavy_truck',
  TOWING = 'towing',
  REFRIGERATED = 'refrigerated'
}

/**
 * Vehicle type interface
 */
export interface VehicleType {
  id: string;
  name: string;
  description: string;
  category: VehicleCategory;
  dimensions: string;
  max_weight: string;
  base_price: number;
  price_per_km: number;
  minimum_distance: number;
  icon_path?: string;
  created_at?: string;
}

/**
 * Vehicle category interface
 */
export interface VehicleCategory {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

/**
 * Vehicle type creation interface
 */
export interface CreateVehicleTypeRequest {
  name: string;
  description: string;
  category: VehicleCategory;
  dimensions: string;
  max_weight: string;
  base_price: number;
  price_per_km: number;
  minimum_distance?: number;
  icon_path?: string;
}

/**
 * Vehicle type update interface
 */
export interface UpdateVehicleTypeRequest {
  name?: string;
  description?: string;
  category?: VehicleCategory;
  dimensions?: string;
  max_weight?: string;
  base_price?: number;
  price_per_km?: number;
  minimum_distance?: number;
  icon_path?: string;
}

/**
 * Vehicle type response interface
 */
export interface VehicleTypeResponse {
  success: boolean;
  data: VehicleType;
}

/**
 * Vehicle types list response interface
 */
export interface VehicleTypesListResponse {
  success: boolean;
  count: number;
  data: VehicleType[];
}