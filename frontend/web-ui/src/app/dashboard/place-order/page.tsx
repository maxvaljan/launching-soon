'use client';

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";
import { ArrowDown, Info, MapPin, Plus, MapIcon, ChevronDown, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import Image from "next/image";

// New order management components
import FileImportActions from "@/components/order/FileImportActions";
import PastOrdersDialog from "@/components/order/PastOrdersDialog";

interface Stop {
  address: string;
  type: 'pickup' | 'dropoff' | 'stop';
  coordinates?: [number, number];
}

interface Suggestion {
  place_name: string;
  center: [number, number];
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
  max_dimensions: string;
  max_weight: string;
  base_price: number;
  price_per_km: number;
  minimum_distance: number;
  icon_path?: string;
  active: boolean;
  created_at?: string;
}

export default function PlaceOrderPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [stops, setStops] = useState<Stop[]>([
    { address: '', type: 'pickup' },
    { address: '', type: 'dropoff' }
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [pastOrdersOpen, setPastOrdersOpen] = useState(false);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [additionalServices, setAdditionalServices] = useState({
    standards: false,
    secureZone: false,
    refrigeratedChilled: false,
    refrigeratedFrozen: false,
    tailboard: false,
    doorToDoor: false,
  });
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const mapboxTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        // Try to fetch from our backend API first with relative URL
        const response = await fetch('/api/api-keys/mapbox');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Mapbox token from API');
        }
        
        const { data } = await response.json();
        console.log('Retrieved Mapbox token from API');
        mapboxTokenRef.current = data.key_value;
        return;
      } catch (apiError) {
        console.warn('API fetch failed, falling back to Supabase:', apiError);
        
        // Fallback to direct Supabase query
        const { data, error } = await supabase
          .from('api_keys')
          .select('key_value')
          .eq('key_name', 'mapbox_public_token')
          .single();

        if (error) {
          console.error('Error fetching Mapbox token:', error);
          return;
        }
      
        if (data) {
          mapboxTokenRef.current = data.key_value;
        }
      }
    };

    fetchMapboxToken();
    fetchVehicleTypes();
  }, []);

  const fetchVehicleTypes = async () => {
    try {
      // Use relative URL for API endpoints in Next.js
      const response = await fetch('/api/vehicles/types');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched vehicle types from API:', data.data);
        
        // Sort vehicle types by ID before setting state
        const sortedVehicles = [...(data.data || [])].sort((a, b) => {
          // Convert IDs to numbers if they're strings
          const idA = typeof a.id === 'string' ? parseInt(a.id) : a.id;
          const idB = typeof b.id === 'string' ? parseInt(b.id) : b.id;
          return idA - idB;
        });
        setVehicleTypes(sortedVehicles);
        return;
      }
    } catch (error) {
      console.warn('API fetch failed, falling back to Supabase');
    }

    // Fallback to direct Supabase query
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .order('id', { ascending: true }); // Sort by ID in ascending order

      if (error) throw error;
      console.log('Fetched vehicle types from Supabase directly:', data);
      setVehicleTypes(data || []);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
    }
  };

  const handleAddressChange = async (value: string, index: number) => {
    if (!mapboxTokenRef.current) return;

    const newStops = [...stops];
    newStops[index].address = value;
    setStops(newStops);
    setActiveInput(index);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json?access_token=${mapboxTokenRef.current}&country=de`
        );
        const data = await response.json();
        setSuggestions(data.features);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion: Suggestion, index: number) => {
    const newStops = [...stops];
    newStops[index] = {
      ...newStops[index],
      address: suggestion.place_name,
      coordinates: suggestion.center,
    };
    setStops(newStops);
    setSuggestions([]);
    setActiveInput(null);
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
      toast.error("Please select a vehicle type");
      return;
    }

    if (!stops[0].coordinates || !stops[stops.length - 1].coordinates) {
      toast.error("Please enter pickup and dropoff locations");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to create an order");
        return;
      }

      // Use relative URL for API endpoints in Next.js
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          pickup_address: stops[0].address,
          dropoff_address: stops[stops.length - 1].address,
          vehicle_type_id: selectedVehicle,
          payment_method: 'card',
          contact_name: '', // Can be added to form later
          contact_phone: '', // Can be added to form later
          items: []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderData = await response.json();

      toast.success("Order created successfully. Looking for available drivers...");

      // Redirect to order tracking page if needed
      // router.push(`/orders/${orderData.data.id}`);

    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.message || "Failed to create order");
    }
  };

  // Click outside suggestions handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setActiveInput(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenPastOrders = async () => {
    setIsLoading(true);
    setPastOrdersOpen(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to view past orders");
        return;
      }

      // Fetch past orders using relative URL
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch past orders');
      }

      const data = await response.json();
      setPastOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching past orders:', error);
      toast.error("Failed to load past orders");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdditionalService = (service: keyof typeof additionalServices) => {
    setAdditionalServices({
      ...additionalServices,
      [service]: !additionalServices[service]
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side - Order Form */}
      <div className="lg:w-1/2 p-6 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <Label className="text-sm text-gray-500 font-medium">
            ROUTE (MAX. 20 STOPS)
          </Label>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-white border-maxmove-gray">
                Import Addresses <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              <div className="flex flex-col">
                <Button variant="ghost" className="justify-start text-left h-10" onClick={handleOpenPastOrders}>
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
                <div key={index} className="relative">
                  {/* Vertical dotted line connecting stops */}
                  {index < stops.length - 1 && (
                    <div className="absolute left-[9px] top-[32px] bottom-0 border-l-2 border-dashed border-gray-300 h-[calc(100%-8px)] z-0 border-spacing-4"></div>
                  )}
                  
                  <div className="flex items-center mb-4 relative z-10">
                    {/* Stop icon based on type - Changed colors from orange to navy blue */}
                    <div className="mr-3">
                      {stop.type === 'pickup' ? (
                        <div className="w-[17px] h-[17px] rounded-full bg-maxmove-navy border-2 border-white"></div>
                      ) : stop.type === 'dropoff' ? (
                        <div className="w-5 h-5 flex items-center justify-center">
                          <svg className="text-maxmove-navy" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21C12 21 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21 12 21Z" fill="currentColor" />
                            <circle cx="12" cy="10" r="3" fill="white" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-400 border-2 border-white"></div>
                      )}
                    </div>
                    
                    {/* Input field */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder={
                          stop.type === 'pickup' 
                            ? "Pick-up location" 
                            : stop.type === 'dropoff' 
                              ? "Drop-off location" 
                              : "Mid-stop location"
                        }
                        className="w-full py-2 bg-transparent border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-400 outline-none text-gray-700"
                        value={stop.address}
                        onChange={(e) => handleAddressChange(e.target.value, index)}
                      />
                      
                      {/* X button to remove stop - Only show for mid-stops */}
                      {stop.type === 'stop' && (
                        <button 
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                          onClick={() => handleRemoveStop(index)}
                          aria-label="Remove this stop"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Address suggestions dropdown */}
                      {activeInput === index && suggestions.length > 0 && (
                        <div 
                          ref={suggestionsRef}
                          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                        >
                          {suggestions.map((suggestion, i) => (
                            <div 
                              key={i}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              onClick={() => handleSuggestionSelect(suggestion, index)}
                            >
                              {suggestion.place_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Stop button - Changed colors */}
              <button 
                className="flex items-center text-maxmove-navy mt-2"
                onClick={handleAddStop}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add Stop
              </button>
            </div>
          </div>
          
          {/* Vehicle Type Section */}
          <div className="space-y-4">
            <Label className="text-sm text-gray-500 font-medium">
              VEHICLE TYPE
            </Label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vehicleTypes.map(vehicle => (
                <div 
                  key={vehicle.id}
                  className={`cursor-pointer group rounded-md border p-4 text-center transition-all ${
                    selectedVehicle === vehicle.id 
                      ? 'border-2 border-maxmove-navy shadow-md bg-maxmove-creme' 
                      : 'border-gray-200 hover:border-maxmove-gray'
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  <div className="text-4xl mb-2">
                    {vehicle.icon_path ? (
                      <Image 
                        src={vehicle.icon_path}
                        alt={vehicle.name}
                        width={48}
                        height={48}
                        className="mx-auto object-contain"
                        unoptimized={true}
                        priority
                      />
                    ) : (
                      /* Fallback to a default truck icon */
                      <Truck className="mx-auto" size={48} />
                    )}
                  </div>
                  <p className="font-medium text-sm">{vehicle.name}</p>
                  <p className="text-xs text-gray-500">{vehicle.max_weight && `Up to ${vehicle.max_weight}`}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={handleCreateOrder} 
              className="w-full h-12 bg-maxmove-navy hover:bg-maxmove-dark-blue text-white"
            >
              Continue to Checkout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right Side - Map - Full height and width */}
      <div className="lg:w-1/2 h-[50vh] lg:h-[calc(100vh-65px)] lg:fixed lg:right-0 lg:top-[65px]">
        <Map 
          pickupLocation={stops[0].coordinates}
          dropoffLocation={stops[stops.length - 1].coordinates}
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
    </div>
  );
}