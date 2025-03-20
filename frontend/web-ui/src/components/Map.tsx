'use client';

import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { apiClient } from '@/lib/api';

interface MapProps {
  pickupLocation?: [number, number];
  dropoffLocation?: [number, number];
}

const Map = memo(({ pickupLocation, dropoffLocation }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Fetch Mapbox token only once on component mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchMapboxToken = async () => {
      try {
        // First try the API client approach
        try {
          const keyValue = await apiClient.getApiKey('mapbox');
          if (keyValue && isMounted) {
            setMapboxToken(keyValue);
            return;
          }
        } catch (apiError) {
          // Silently fall back to Supabase
        }
        
        // Fallback to direct Supabase query
        const { data, error } = await supabase
          .from('api_keys')
          .select('key_value')
          .eq('key_name', 'mapbox_public_token')
          .single();

        if (error || !data?.key_value) {
          if (isMounted) toast.error('Error loading map');
          return;
        }

        if (isMounted) setMapboxToken(data.key_value);
      } catch (err) {
        if (isMounted) toast.error('Error initializing map');
      }
    };

    fetchMapboxToken();
    return () => { isMounted = false; };
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [6.9578, 50.9367], // Cologne, Germany
        zoom: 12,
        attributionControl: false,
        renderWorldCopies: false, // Performance improvement
      });

      // Add performance optimization: reduce unnecessary repaints
      map.current.on('load', () => {
        if (map.current) {
          map.current.resize();
        }
      });
    } catch (err) {
      toast.error('Error loading map');
    }

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Remove map instance
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Handle markers update efficiently with useCallback
  const updateMarkers = useCallback(() => {
    if (!map.current) return;

    try {
      // Clean up existing markers more efficiently
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add pickup marker
      if (pickupLocation) {
        const marker = new mapboxgl.Marker({ color: '#4CAF50' })
          .setLngLat(pickupLocation)
          .addTo(map.current);
        markersRef.current.push(marker);
      }

      // Add dropoff marker
      if (dropoffLocation) {
        const marker = new mapboxgl.Marker({ color: '#F44336' })
          .setLngLat(dropoffLocation)
          .addTo(map.current);
        markersRef.current.push(marker);
      }

      // Fit bounds if both locations exist
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
      toast.error('Error updating map markers');
    }
  }, [pickupLocation, dropoffLocation]);

  // Update markers when locations change
  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  return (
    <div className="h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
});

export default Map;