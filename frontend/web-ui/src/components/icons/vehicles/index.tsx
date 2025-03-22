import React from 'react';

// Define common interface for all vehicle icon components
export interface VehicleIconProps {
  className?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

// Default props for consistent styling
const defaultProps: VehicleIconProps = {
  size: 24,
  color: 'currentColor',
  strokeWidth: 2
};

// Create an empty array for vehicle icons - built-in SVG icons removed
export const vehicleIconOptions = [];

// Helper function to get a vehicle icon component by ID
export const getVehicleIconById = (id?: string) => {
  return null;
};
