'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map";
import BookingForm from "@/components/BookingForm";
import { supabase } from "@/lib/supabase";
import { apiClient } from "@/lib/api";

interface Stop {
  address: string;
  type: 'pickup' | 'dropoff' | 'stop';
  coordinates?: [number, number];
}

interface Suggestion {
  place_name: string;
  center: [number, number];
}

export default function BookPage() {
  const [stops, setStops] = useState<Stop[]>([
    { address: '', type: 'pickup' },
    { address: '', type: 'dropoff' }
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = async (query: string, index: number) => {
    if (!query.trim() || !mapboxToken) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&country=de&types=address`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleAddressChange = async (value: string, index: number) => {
    const newStops = [...stops];
    newStops[index].address = value;
    setStops(newStops);
    setActiveInput(index);

    if (value.length > 2) {
      await searchAddress(value, index);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion: Suggestion, index: number) => {
    const newStops = [...stops];
    newStops[index].address = suggestion.place_name;
    newStops[index].coordinates = suggestion.center;
    setStops(newStops);
    setSuggestions([]);
  };

  const addStop = () => {
    if (stops.length < 5) {
      const newStops = [...stops];
      newStops.splice(stops.length - 1, 0, { address: '', type: 'stop' });
      setStops(newStops);
    }
  };

  const removeStop = (index: number) => {
    if (index > 0 && index < stops.length - 1) {
      const newStops = [...stops];
      newStops.splice(index, 1);
      setStops(newStops);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting booking with stops:', stops);
    // Here we would submit the data to the API
  };

  return (
    <main className="flex min-h-screen flex-col items-center pt-24 p-6">
      <div className="max-w-5xl w-full mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Book a Delivery</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
            <BookingForm 
              stops={stops}
              setStops={setStops}
              suggestions={suggestions}
              activeInput={activeInput}
              suggestionsRef={suggestionsRef}
              onAddressChange={handleAddressChange}
              onSuggestionSelect={handleSuggestionSelect}
              onAddStop={addStop}
              onRemoveStop={removeStop}
            />
            
            <div className="mt-6">
              <Button className="w-full" onClick={handleSubmit}>
                Continue to Vehicle Selection
              </Button>
            </div>
          </div>
          
          <div className="h-96 md:h-auto rounded-lg overflow-hidden shadow-lg">
            <Map 
              pickupLocation={stops[0].coordinates} 
              dropoffLocation={stops[1].coordinates} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}