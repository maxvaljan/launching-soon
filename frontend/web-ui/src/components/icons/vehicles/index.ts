// Export all vehicle icons for easy importing
import { Auto1Icon } from './Auto1Icon';
import { Courier1Icon } from './Courier1Icon';
import { Kangoo1Icon } from './Kangoo1Icon';
import { MiniLkw1Icon } from './MiniLkw1Icon';
import { Minivan1Icon } from './Minivan1Icon';
import { Towing1Icon } from './Towing1Icon';
import { Van1Icon } from './Van1Icon';

// Define the vehicle icon mapping type
export type VehicleIconType = 
  | 'auto1'
  | 'courier1'
  | 'kangoo1'
  | 'minilkw1'
  | 'minivan1'
  | 'towing1'
  | 'van1';

// Create a mapping object for convenience
export const VehicleIcons = {
  auto1: Auto1Icon,
  courier1: Courier1Icon,
  kangoo1: Kangoo1Icon,
  minilkw1: MiniLkw1Icon,
  minivan1: Minivan1Icon,
  towing1: Towing1Icon,
  van1: Van1Icon
};

// Export the individual components
export {
  Auto1Icon,
  Courier1Icon,
  Kangoo1Icon,
  MiniLkw1Icon,
  Minivan1Icon,
  Towing1Icon,
  Van1Icon
};

// Helper to get an icon component by name
export const getVehicleIconByName = (iconName: VehicleIconType | string | undefined) => {
  if (!iconName) return null;
  
  return VehicleIcons[iconName as VehicleIconType] || null;
};