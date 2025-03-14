'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { apiClient } from '@/lib/api';

interface MapProps {
  pickupLocation?: [number, number];
  dropoffLocation?: [number, number];
}

const Map = ({ pickupLocation, dropoffLocation }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        console.log('Fetching Mapbox token...');
        
        try {
          // Try to fetch from our backend API first using the API client
          const keyValue = await apiClient.getApiKey('mapbox');
          
          if (keyValue) {
            console.log('Retrieved Mapbox token from API');
            setMapboxToken(keyValue);
            return;
          }
          
          throw new Error('Failed to fetch Mapbox token from API');
        } catch (apiError) {
          // Fall back to direct Supabase query if API fails
          console.warn('API fetch failed, falling back to Supabase:', apiError);
        }
        
        // Fallback to direct Supabase query
        const { data, error } = await supabase
          .from('api_keys')
          .select('key_value')
          .eq('key_name', 'mapbox_public_token')
          .single();

        if (error) {
          console.error('Error fetching Mapbox token:', error);
          toast.error('Error loading map');
          return;
        }

        if (!data?.key_value) {
          console.error('No Mapbox token found');
          toast.error('Map configuration not found');
          return;
        }

        console.log('Retrieved Mapbox token from Supabase');
        setMapboxToken(data.key_value);
      } catch (err) {
        console.error('Unexpected error fetching Mapbox token:', err);
        toast.error('Error initializing map');
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    try {
      console.log('Initializing map with token:', mapboxToken);
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [6.9578, 50.9367], // Cologne, Germany
        zoom: 12,
        attributionControl: false
      });

      console.log('Map initialized successfully');
    } catch (err) {
      console.error('Error initializing map:', err);
      toast.error('Error loading map');
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current) return;

    try {
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers[0]) {
        markers[0].remove();
      }

      if (pickupLocation) {
        new mapboxgl.Marker({ color: '#4CAF50' })
          .setLngLat(pickupLocation)
          .addTo(map.current);
      }

      if (dropoffLocation) {
        new mapboxgl.Marker({ color: '#F44336' })
          .setLngLat(dropoffLocation)
          .addTo(map.current);
      }

      if (pickupLocation && dropoffLocation) {
        const bounds = new mapboxgl.LngLatBounds()
          .extend(pickupLocation)
          .extend(dropoffLocation);

        map.current.fitBounds(bounds, {
          padding: 100,
          duration: 1000
        });
      }
    } catch (err) {
      console.error('Error updating markers:', err);
      toast.error('Error updating map markers');
    }
  }, [pickupLocation, dropoffLocation]);

  return (
    <div className="h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;