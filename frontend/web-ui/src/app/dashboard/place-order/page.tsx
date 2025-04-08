'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { PopoverTrigger, Popover, PopoverContent } from '@/components/ui/popover';
import Image from 'next/image';
import { useJsApiLoader } from '@react-google-maps/api';

// New order management components
import PastOrdersDialog from '@/components/order/PastOrdersDialog';

interface Stop {
  address: string;
  type: 'pickup' | 'dropoff' | 'stop';
  latitude?: number;
  longitude?: number;
}

interface PastOrder {
  id: string;
  pickup_address: string;
  dropoff_address: string;
}

interface VehicleType {
  id: string;
  name: string;
  description: string;
  image_url: string;
  weight_capacity_kg: number;
  volume_capacity_cbm: number;
  dimensions_meter: string;
}

// Define google explicitly on the window object for the Autocomplete library
declare global {
  interface Window {
    google: Record<string, unknown>;
  }
}

// Helper function to get vehicle image URL based on vehicle type name or ID
const getVehicleImageUrl = (vehicle: VehicleType): string => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Map of vehicle types to their image names
  const vehicleImageMap: { [key: string]: string } = {
    Courier: 'courier1.png',
    Car: 'car1.png',
    'Compact Van': 'kangoo1.png',
    '2,7m Van': 'minivan1.png',
    '3,3m Van': 'van1.png',
    '4,3m Lorry': 'lorry1.png',
    '7,5m Lorry': 'lorry1.png',
    Towing: 'towing1.png',
  };

  // Get image name based on vehicle name
  const imageName = vehicleImageMap[vehicle.name] || 'truck-default.png';

  // Return the complete Supabase URL
  return `${supabaseUrl}/storage/v1/object/public/vehicles/${imageName}`;
};

// Helper function to get custom image size based on vehicle type
const getVehicleImageSize = (vehicleName: string): number => {
  // Default size is 88px
  const defaultSize = 88;

  // Custom sizes for specific vehicles
  switch (vehicleName) {
    case 'Car':
      return Math.round(defaultSize * 1.25); // Increased from 15% to 25% larger
    case '2,7m Van':
    case '3,3m Van':
    case 'Towing':
      return Math.round(defaultSize * 1.2); // Increased from 10% to 20% larger
    default:
      return defaultSize;
  }
};

// Helper function to format descriptions properly
const formatDescription = (description: string): string => {
  if (!description) return '';

  // Trim any extra spaces
  let formatted = description.trim();

  // Capitalize first letter if it's not already
  if (formatted.length > 0) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // Ensure description ends with a period if it doesn't already
  if (formatted.length > 0 && !['!', '.', '?'].includes(formatted.charAt(formatted.length - 1))) {
    formatted += '.';
  }

  return formatted;
};

// Helper function to format dimensions consistently
const formatDimensions = (dimensions: string): string => {
  if (!dimensions) return '';

  // If the dimensions are already in the correct format, return as is
  if (dimensions.match(/^\d+,\d+\s*x\s*\d+,\d+\s*x\s*\d+,\d+\s*Meter$/)) {
    return dimensions;
  }

  // First, normalize the input by removing any 'meter'/'m' suffix and extra spaces
  const normalized = dimensions
    .toLowerCase()
    .replace(/meter/g, '')
    .replace(/meters/g, '')
    .replace(/m(?![a-z0-9])/g, '') // Replace 'm' only if not followed by letters/numbers
    .replace(/\s+/g, ' ')
    .trim();

  // Split by common separators (x, X, *, comma with space, space)
  let parts = normalized.split(/[xX*]|\s*,\s*|\s+/).filter(Boolean);

  // Ensure we have exactly 3 parts
  if (parts.length !== 3) {
    return dimensions; // Return original if we can't parse it properly
  }

  // Format each number with comma as decimal separator
  parts = parts.map(part => {
    // Convert dots to commas for decimal notation
    part = part.replace('.', ',');
    // Add decimal zero if it's a whole number
    if (!part.includes(',')) {
      part += ',0';
    }
    return part;
  });

  // Build standard format: W x H x D Meter
  return `${parts[0]} x ${parts[1]} x ${parts[2]} Meter`;
};

// VehicleCard component to render each vehicle option
const VehicleCard = ({
  vehicle,
  isSelected,
  onSelect,
}: {
  vehicle: VehicleType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const imageUrl = getVehicleImageUrl(vehicle);
  const imageSize = getVehicleImageSize(vehicle.name);

  // Format dimensions and weight for consistent display
  const formattedDimensions = formatDimensions(vehicle.dimensions_meter);
  const formattedWeight = vehicle.weight_capacity_kg.toString() + 'kg';

  // Format description with proper capitalization and punctuation
  const formattedDescription = formatDescription(vehicle.description);

  return (
    <div
      className={`cursor-pointer group relative rounded-md border p-4 text-center transition-all h-[160px] flex flex-col justify-between ${
        isSelected
          ? 'border-2 border-maxmove-navy shadow-md bg-maxmove-creme'
          : 'border-gray-200 hover:border-maxmove-gray hover:shadow-sm'
      }`}
      onClick={() => onSelect(vehicle.id)}
    >
      <div className="relative h-[95px] flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={vehicle.name}
          width={imageSize}
          height={imageSize}
          className="mx-auto object-contain"
          quality={90}
          priority={true}
          // Add onError handler to show fallback icon if image fails to load
          onError={e => {
            // Show fallback truck icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            // We'll add a truck icon element after this one
            const parentDiv = target.parentElement;
            if (parentDiv) {
              const svgElement = document.createElement('div');
              svgElement.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-maxmove-navy"><path d="M10 17h4V5H2v12h3"></path><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"></path><circle cx="7.5" cy="17.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>';
              parentDiv.appendChild(svgElement);
            }
          }}
        />
      </div>

      <div>
        <p className="font-medium text-sm">{vehicle.name}</p>
      </div>

      {/* Hover overlay with detailed information */}
      <div className="absolute inset-0 bg-white bg-opacity-95 rounded-md p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="text-center">
          <p className="font-medium text-sm mb-1">{vehicle.name}</p>
          <p className="text-xs text-gray-500">{formattedDimensions}</p>
          <p className="text-xs text-gray-500 mb-2">{formattedWeight}</p>
        </div>

        <div className="text-xs text-gray-600 text-center">
          <p>{formattedDescription}</p>
        </div>
      </div>
    </div>
  );
};

// Vehicle skeleton loader component
const VehicleSkeleton = () => (
  <div className="rounded-md border border-gray-200 p-4 h-[160px] animate-pulse">
    <div className="bg-gray-200 h-[73px] w-[73px] mx-auto rounded-md mb-2"></div>
    <div className="bg-gray-200 h-4 w-24 mx-auto rounded-sm mb-2"></div>
    <div className="bg-gray-200 h-3 w-16 mx-auto rounded-sm"></div>
  </div>
);

// Define libraries array outside component to prevent reloading
const GOOGLE_MAPS_LIBRARIES: 'places'[] = ['places'];

// Helper to get domain-specific error message
const getMapErrorMessage = (error: Error | null): { title: string; message: string } => {
  if (!error)
    return {
      title: 'Unknown Error',
      message: 'An unknown error occurred while loading the map.',
    };

  if (error.message.includes('RefererNotAllowedMapError')) {
    return {
      title: 'Domain Not Authorized',
      message:
        'This domain is not authorized to use the Google Maps API. Please contact support or try again later.',
    };
  }

  if (error.message.includes('InvalidKeyMapError')) {
    return {
      title: 'Invalid API Key',
      message: 'There was a problem with the map configuration. Please contact support.',
    };
  }

  if (error.message.includes('MissingKeyMapError')) {
    return {
      title: 'Missing API Key',
      message: 'Map configuration is incomplete. Please contact support.',
    };
  }

  return {
    title: 'Map Loading Error',
    message:
      'There was a problem loading the map. Please try refreshing the page or contact support if the problem persists.',
  };
};

export default function PlaceOrderPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [stops, setStops] = useState<Stop[]>([
    { address: '', type: 'pickup' },
    { address: '', type: 'dropoff' },
  ]);
  const [pastOrdersOpen, setPastOrdersOpen] = useState(false);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [additionalServices] = useState({
    standards: false,
    secureZone: false,
    refrigeratedChilled: false,
    refrigeratedFrozen: false,
    tailboard: false,
    doorToDoor: false,
  });

  // --- Google Maps API Loader ---
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
    preventGoogleFontsLoading: true,
    language: 'en',
    region: 'DE',
    id: 'google-maps-script',
    nonce: '',
  });

  // Log error details for debugging in non-production environments
  useEffect(() => {
    if (loadError && process.env.NODE_ENV !== 'production') {
      console.error('Google Maps API load error:', {
        error: loadError,
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
        host: typeof window !== 'undefined' ? window.location.host : 'SSR',
      });
    }
  }, [loadError]);

  // Move fetchVehicleTypes definition before useEffect
  const fetchVehicleTypes = useCallback(async () => {
    setIsLoadingVehicles(true);
    try {
      // Use relative URL for API endpoints in Next.js
      const response = await fetch('/api/vehicles');
      if (!response.ok) {
        throw new Error('Failed to fetch vehicle types');
      }
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setVehicleTypes(result.data);
      } else {
        throw new Error(result.message || 'Invalid data format received');
      }
    } catch (error) {
      // Removed unused variable name 'error'
      console.error('Error fetching vehicle types:', error);
      toast.error('Failed to load vehicle types.');
    } finally {
      setIsLoadingVehicles(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicleTypes();
  }, [fetchVehicleTypes]);

  // Handle place selection
  const handlePlaceSelect = useCallback(
    (index: number, place: google.maps.places.PlaceResult) => {
      if (!place.geometry?.location || !place.formatted_address) {
        console.warn('Place selected without geometry or formatted address:', place);
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address;

      const newStops = [...stops];
      newStops[index] = {
        ...newStops[index],
        address: address,
        latitude: lat,
        longitude: lng,
      };
      setStops(newStops);
    },
    [stops]
  );

  // Add event listener for place selection
  useEffect(() => {
    const handlePlaceSelectedEvent = ((event: CustomEvent) => {
      const { index, place } = event.detail;
      handlePlaceSelect(index, place);
    }) as EventListener;

    window.addEventListener('place_selected', handlePlaceSelectedEvent);

    return () => {
      window.removeEventListener('place_selected', handlePlaceSelectedEvent);
    };
  }, [handlePlaceSelect]);

  // Handles manual input changes
  const handleAddressChange = (value: string, index: number) => {
    const newStops = [...stops];
    // If user types, clear coordinates as they might no longer match the typed address
    // unless they select from Autocomplete again.
    newStops[index] = {
      ...newStops[index],
      address: value,
      latitude: undefined,
      longitude: undefined,
    };
    setStops(newStops);
  };

  const handleAddStop = () => {
    if (stops.length < 20) {
      // Create a new array with the new stop inserted before the dropoff location
      const newStops = [...stops];
      // Insert the new stop at the second-to-last position (just before dropoff)
      newStops.splice(newStops.length - 1, 0, { address: '', type: 'stop' });
      setStops(newStops);
    }
  };

  const handleRemoveStop = (index: number) => {
    // Don't allow removing the pickup (first) or dropoff (last) stops
    if (index === 0 || index === stops.length - 1) {
      return;
    }

    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
  };

  const handleCreateOrder = async () => {
    if (!selectedVehicle) {
      toast.error('Please select a vehicle type');
      return;
    }

    // Check coordinates using latitude/longitude
    if (
      !stops[0].latitude ||
      !stops[0].longitude ||
      !stops[stops.length - 1].latitude ||
      !stops[stops.length - 1].longitude
    ) {
      toast.error('Please select valid pickup and dropoff locations from the suggestions');
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Please sign in to create an order');
        return;
      }

      const pickupStop = stops[0];
      const dropoffStop = stops[stops.length - 1];

      const orderPayload = {
        pickup_address: pickupStop.address,
        pickup_latitude: pickupStop.latitude,
        pickup_longitude: pickupStop.longitude,
        dropoff_address: dropoffStop.address,
        dropoff_latitude: dropoffStop.latitude,
        dropoff_longitude: dropoffStop.longitude,
        vehicle_type_id: selectedVehicle,
        payment_method: 'card',
        contact_name: '',
        contact_phone: '',
        items: [],
        intermediate_stops: stops.slice(1, -1).map(stop => ({
          address: stop.address,
          latitude: stop.latitude,
          longitude: stop.longitude,
        })),
        additional_services: Object.entries(additionalServices)
          .filter(([, value]) => value)
          .map(([key]) => key),
      };

      console.log('Creating order with payload:', orderPayload);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      await response.json();

      toast.success('Order created successfully. Looking for available drivers...');
    } catch (error: unknown) {
      // Keep error handling as is for now, including type annotation
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create order');
    }
  };

  const handleOpenPastOrders = async () => {
    setPastOrdersOpen(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Please sign in to view past orders');
        return;
      }

      // Fetch past orders using relative URL
      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch past orders');
      }

      const data = await response.json();
      setPastOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching past orders:', error);
      toast.error('Failed to load past orders');
    }
  };

  if (loadError) {
    const { title, message } = getMapErrorMessage(loadError as Error);

    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-65px)]">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-maxmove-navy hover:bg-maxmove-blue text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side - Order Form */}
      <div className="lg:w-1/2 p-6 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <Label className="text-sm text-gray-500 font-medium">ROUTE (MAX. 20 STOPS)</Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-white border-maxmove-gray">
                Import Addresses <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  className="justify-start text-left h-10"
                  onClick={handleOpenPastOrders}
                >
                  Load from Past Orders
                </Button>
                <Button variant="ghost" className="justify-start text-left h-10">
                  Import CSV
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 overflow-auto pr-2 pb-4 custom-scrollbar space-y-6">
          {/* Route Section */}
          <div>
            <div className="border border-gray-200 rounded-lg p-6 relative">
              {stops.map((stop, index) => (
                <div key={index} className="relative mb-4">
                  {/* Vertical dotted line connecting stops */}
                  {index < stops.length - 1 && (
                    <div className="absolute left-[9px] top-[32px] bottom-[-16px] border-l-2 border-dashed border-gray-300 z-0"></div>
                  )}

                  <div className="flex items-center relative z-10">
                    {/* Stop icon based on type */}
                    <div className="mr-3 flex-shrink-0">
                      {stop.type === 'pickup' ? (
                        <div className="w-[17px] h-[17px] rounded-full bg-maxmove-navy border-2 border-white"></div>
                      ) : stop.type === 'dropoff' ? (
                        <div className="w-5 h-5 flex items-center justify-center">
                          <svg
                            className="text-maxmove-navy"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 21C12 21 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21 12 21Z"
                              fill="currentColor"
                            />
                            <circle cx="12" cy="10" r="3" fill="white" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-400 border-2 border-white"></div>
                      )}
                    </div>

                    {/* Replace Autocomplete with PlaceAutocompleteElement */}
                    <div className="flex-1 relative">
                      {isLoaded ? (
                        <div className="w-full">
                          <input
                            type="text"
                            placeholder={
                              stop.type === 'pickup'
                                ? 'Pick-up location'
                                : stop.type === 'dropoff'
                                  ? 'Drop-off location'
                                  : 'Mid-stop location'
                            }
                            className="w-full py-2 bg-transparent border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 outline-none text-gray-700 pr-8"
                            value={stop.address}
                            onChange={e => handleAddressChange(e.target.value, index)}
                            id={`place-input-${index}`}
                          />
                          <script
                            dangerouslySetInnerHTML={{
                              __html: `
                                function initPlaceAutocomplete${index}() {
                                  const input = document.getElementById('place-input-${index}');
                                  const options = {
                                    fields: ['formatted_address', 'geometry', 'name'],
                                    strictBounds: false,
                                  };
                                  const autocomplete = new google.maps.places.Autocomplete(input, options);
                                  autocomplete.addListener('place_changed', () => {
                                    const place = autocomplete.getPlace();
                                    window.dispatchEvent(new CustomEvent('place_selected', {
                                      detail: { index: ${index}, place }
                                    }));
                                  });
                                }
                                if (window.google && window.google.maps) {
                                  initPlaceAutocomplete${index}();
                                }
                              `,
                            }}
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="Loading address input..."
                          className="w-full py-2 bg-transparent border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 outline-none text-gray-700 pr-8"
                          disabled
                        />
                      )}

                      {/* X button to remove stop - Only show for mid-stops */}
                      {stop.type === 'stop' && (
                        <button
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
                          onClick={() => handleRemoveStop(index)}
                          aria-label="Remove this stop"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6L6 18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6 6L18 18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Stop button - Changed colors */}
              <button className="flex items-center text-maxmove-navy mt-2" onClick={handleAddStop}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path
                    d="M12 5V19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add Stop
              </button>
            </div>
          </div>

          {/* Vehicle Type Section */}
          <div className="space-y-4">
            <Label className="text-sm text-gray-500 font-medium">VEHICLE TYPE</Label>

            {isLoadingVehicles ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(skeleton => (
                  <VehicleSkeleton key={`skeleton-${skeleton}`} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vehicleTypes.map(vehicle => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isSelected={selectedVehicle === vehicle.id}
                    onSelect={setSelectedVehicle}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button
              onClick={handleCreateOrder}
              className="w-full h-12 bg-maxmove-navy hover:bg-maxmove-blue text-white"
            >
              Continue to Checkout
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Map - Full height and width */}
      <div className="lg:w-1/2 h-[50vh] lg:h-[calc(100vh-65px)] lg:fixed lg:right-0 lg:top-[65px]">
        <Map
          pickupLat={stops[0].latitude}
          pickupLng={stops[0].longitude}
          dropoffLat={stops[stops.length - 1].latitude}
          dropoffLng={stops[stops.length - 1].longitude}
          stops={stops}
          isLoaded={isLoaded}
          hideControls={true}
        />
      </div>

      {pastOrdersOpen && (
        <PastOrdersDialog
          open={pastOrdersOpen}
          onOpenChange={setPastOrdersOpen}
          pastOrders={pastOrders}
        />
      )}

      {/* Add spacing at the bottom of the container */}
      <div className="pb-8 lg:pb-12"></div>
    </div>
  );
}
