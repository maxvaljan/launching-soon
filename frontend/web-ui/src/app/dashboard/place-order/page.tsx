'use client';

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Map from "@/components/Map";
import VehicleSelection from "@/components/VehicleSelection";
import { Button } from "@/components/ui/button";

// New order management components
import RouteManager from "@/components/order/RouteManager";
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

export default function PlaceOrderPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [stops, setStops] = useState<Stop[]>([
    { address: '', type: 'pickup' },
    { address: '', type: 'dropoff' }
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [pastOrdersOpen, setPastOrdersOpen] = useState(false);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  }, []);

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
    if (stops.length < 20) { // Updated to 20 to match RouteManager
      setStops([...stops, { address: '', type: 'stop' }]);
    }
  };

  const handleRemoveStop = (index: number) => {
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

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-57px)]">
      {/* Left Side - Order Form */}
      <div className="lg:w-1/2 p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-maxmove-900">
            Place New Order
          </h1>
          <FileImportActions 
            isLoading={isLoading} 
            onPastOrders={handleOpenPastOrders} 
          />
        </div>

        <div className="flex-1 flex flex-col space-y-6 overflow-auto pr-4 pb-4 custom-scrollbar">
          <RouteManager />
          
          <VehicleSelection onVehicleSelect={setSelectedVehicle} />
        </div>

        <div className="pt-6 border-t mt-6">
          <Button 
            className="w-full"
            size="lg"
            onClick={handleCreateOrder}
            disabled={!selectedVehicle || !stops[0].coordinates || !stops[stops.length - 1].coordinates}
          >
            Create Order
          </Button>
        </div>

        <PastOrdersDialog 
          open={pastOrdersOpen} 
          onOpenChange={setPastOrdersOpen} 
          pastOrders={pastOrders} 
        />
      </div>

      {/* Right Side - Map */}
      <div className="lg:w-1/2 h-[400px] lg:h-full">
        <Map
          pickupLocation={stops[0].coordinates}
          dropoffLocation={stops[stops.length - 1].coordinates}
        />
      </div>
    </div>
  );
}