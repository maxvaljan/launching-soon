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

// Auto1 Icon
export const Auto1 = (props: VehicleIconProps) => {
  const { className, color, size, strokeWidth } = { ...defaultProps, ...props };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14 16H9M5 11L13 7H8.5C7.4 7 6.46667 7.63333 6.16667 8.58333L5 11Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="16.5" r="2.5" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="16.5" cy="16.5" r="2.5" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M3 12H17V16H3V12Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 9H19L21 12H14V9Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Courier1 Icon
export const Courier1 = (props: VehicleIconProps) => {
  const { className, color, size, strokeWidth } = { ...defaultProps, ...props };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 11H15C15.5523 11 16 11.4477 16 12V15H4V6C4 4.89543 4.89543 4 6 4H15L18 7V11H12Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="15" r="2" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="16" cy="15" r="2" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
};

// Kangoo1 Icon
export const Kangoo1 = (props: VehicleIconProps) => {
  const { className, color, size, strokeWidth } = { ...defaultProps, ...props };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 9H17C18.1046 9 19 9.89543 19 11V13.5H15V12H5V15H3C2.44772 15 2 14.5523 2 14V12.18C2 11.5291 2.52908 11 3.18 11H5V7L6 4H9.93C10.5955 4 11.2115 4.35412 11.5937 4.9L13 7V9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="15" r="2" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="18" cy="15" r="2" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
};

// MiniLkw1 Icon
export const MiniLkw1 = (props: VehicleIconProps) => {
  const { className, color, size, strokeWidth } = { ...defaultProps, ...props };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 8H16C17.1046 8 18 8.89543 18 10V14H15C14.4477 14 14 14.4477 14 15V16H8V15C8 14.4477 7.55228 14 7 14H3V8Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 14H7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M13 14H15.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M3 3V8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M10 3V8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M6 2H10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
};

// Minivan1 Icon
export const Minivan1 = (props: VehicleIconProps) => {
  const { className, color, size, strokeWidth } = { ...defaultProps, ...props };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="7" cy="15" r="2" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="17" cy="15" r="2" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M5 9H19L17 17H7L5 9Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 9L3 5H22L20 9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 5V3H14V5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Towing1 Icon
export const Towing1 = (props: VehicleIconProps) => {
  const { className, color, size, strokeWidth } = { ...defaultProps, ...props };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="10" cy="15" r="2" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="5" cy="15" r="2" stroke={color} strokeWidth={strokeWidth} />
      <path d="M15 15H10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path
        d="M8 15H5.23C4.1 15 3.15 14.22 2.98 13.1L2 7H5M5 5H14M14 5V11"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 9H14C15.1 9 16 9.9 16 11V13"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 13H18.7C19.0 13 19.3 13.1 19.4 13.3L22 15.9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 13.1V16H14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Van1 Icon
export const Van1 = (props: VehicleIconProps) => {
  const { className, color, size, strokeWidth } = { ...defaultProps, ...props };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="10" cy="15" r="2" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="19" cy="15" r="2" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M5 15H3V6C3 4.89543 3.89543 4 5 4H16L19 8V15H17"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 15H13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M7 15H5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
};

// Create an array of all vehicle icons and their names for easy selection UI
export const vehicleIconOptions = [
  { id: 'auto1', name: 'Car', component: Auto1 },
  { id: 'courier1', name: 'Courier Bike', component: Courier1 },
  { id: 'kangoo1', name: 'Kangoo', component: Kangoo1 },
  { id: 'minilkw1', name: 'Mini Truck', component: MiniLkw1 },
  { id: 'minivan1', name: 'Minivan', component: Minivan1 },
  { id: 'towing1', name: 'Towing Truck', component: Towing1 },
  { id: 'van1', name: 'Van', component: Van1 }
];

// Helper function to get a vehicle icon component by ID
export const getVehicleIconById = (id?: string) => {
  if (!id) return null;
  const icon = vehicleIconOptions.find(icon => icon.id === id);
  return icon ? icon.component : null;
};