/**
 * User role enum
 */
export enum UserRole {
  ADMIN = 'admin',
  DRIVER = 'driver',
  CUSTOMER = 'customer',
  BUSINESS = 'business'
}

/**
 * User notification preference enum
 */
export enum NotificationPreference {
  ALL = 'all',
  IMPORTANT = 'important',
  NONE = 'none'
}

/**
 * User language preference enum
 */
export enum LanguagePreference {
  EN = 'en',
  DE = 'de'
}

/**
 * User interface for API communication
 */
export interface User {
  id: string;
  email?: string;
  name?: string;
  role: UserRole;
  phone_number?: string;
  verified_phone?: boolean;
  avatar_url?: string;
  language?: LanguagePreference;
  notification_preferences?: NotificationPreference;
  created_at: string;
  last_login?: string;
}

/**
 * Driver interface
 */
export interface Driver extends User {
  vehicle_type: string;
  vehicle_plate?: string;
  rating?: number;
  status: 'available' | 'busy' | 'offline';
  latitude: number;
  longitude: number;
  city?: string;
}

/**
 * User login request interface
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * User registration request interface
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  phone_number?: string;
  role?: UserRole;
}

/**
 * Profile update request interface
 */
export interface UpdateProfileRequest {
  name?: string;
  phone_number?: string;
  language?: LanguagePreference;
  notification_preferences?: NotificationPreference;
  avatar_url?: string;
}

/**
 * Auth response interface
 */
export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
  };
}