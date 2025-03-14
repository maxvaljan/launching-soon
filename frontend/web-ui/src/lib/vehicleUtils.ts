interface VehicleType {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensions: string;
  max_weight: string;
}

const expressOrder: Record<string, number> = {
  'Courier': 1,
  'Car': 2,
  'Small Transporter': 3,
  'Medium Transporter': 4,
};

const heavyTruckOrder: Record<string, number> = {
  'Heavy Truck': 1,
  '12t Truck': 2,
  '24t Truck': 3,
  'Hazardous Transport': 4,
};

export const getVehicleSortOrder = (vehicle: VehicleType) => {
  // Special case for bike/motorcycle (courier)
  if (vehicle.category === 'bike_motorcycle') {
    return expressOrder['Courier'];
  }

  if (vehicle.name in expressOrder) {
    return expressOrder[vehicle.name];
  }

  if (vehicle.category === 'heavy_truck' && vehicle.name in heavyTruckOrder) {
    return heavyTruckOrder[vehicle.name];
  }

  // Return a high number for other vehicles to place them at the end
  return 1000;
};

export const formatDimensions = (dimensions: string) => {
  const match = dimensions.match(/(\d+)\s*[xX]\s*(\d+)\s*[xX]\s*(\d+)\s*([a-zA-Z]+)/);
  if (match) {
    const [_, length, width, height, unit] = match;
    return `max. ${length}${unit} x ${width}${unit} x ${height}${unit}`;
  }
  return dimensions;
};

export const formatWeight = (weight: string) => {
  const match = weight.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/);
  if (match) {
    const [_, value, unit] = match;
    return `max. ${value}${unit}`;
  }
  return weight;
};