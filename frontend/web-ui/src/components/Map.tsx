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
  hideControls?: boolean;
}

const Map = memo(({ pickupLocation, dropoffLocation, hideControls = false }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routeRef = useRef<string | null>(null);

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
        style: 'mapbox://styles/mapbox/light-v11', // Using a light theme for minimalist look
        center: [6.9578, 50.9367], // Cologne, Germany
        zoom: 12,
        attributionControl: false,
        renderWorldCopies: false, // Performance improvement
      });

      // Add zoom and rotation controls only if hideControls is false
      if (!hideControls) {
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
            showCompass: true,
          }),
          'bottom-right'
        );
      }

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
  }, [mapboxToken, hideControls]);

  // Handle route drawing between points
  const drawRoute = useCallback(async () => {
    if (!map.current || !pickupLocation || !dropoffLocation || !mapboxToken) return;
    
    try {
      // Remove any existing route
      if (routeRef.current && map.current.getSource(routeRef.current)) {
        map.current.removeLayer(`${routeRef.current}-layer`);
        map.current.removeSource(routeRef.current);
      }
      
      // Create a unique ID for this route
      const routeId = `route-${Date.now()}`;
      routeRef.current = routeId;
      
      // Get directions from Mapbox
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation[0]},${pickupLocation[1]};${dropoffLocation[0]},${dropoffLocation[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry;
        
        // Add the route to the map
        if (map.current) {
          map.current.addSource(routeId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route
            }
          });
          
          map.current.addLayer({
            id: `${routeId}-layer`,
            type: 'line',
            source: routeId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#192338', // MaxMove navy color
              'line-width': 4,
              'line-opacity': 0.8
            }
          });
        }
      }
    } catch (err) {
      console.error('Error drawing route:', err);
    }
  }, [pickupLocation, dropoffLocation, mapboxToken]);

  // Handle markers update efficiently with useCallback
  const updateMarkers = useCallback(() => {
    if (!map.current) return;

    try {
      // Clean up existing markers more efficiently
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Create custom marker elements for a more modern look
      const createCustomMarker = (type: 'pickup' | 'dropoff') => {
        const element = document.createElement('div');
        element.className = 'custom-marker';
        element.style.width = '24px';
        element.style.height = '24px';
        element.style.borderRadius = '50%';
        element.style.display = 'flex';
        element.style.justifyContent = 'center';
        element.style.alignItems = 'center';
        element.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        
        if (type === 'pickup') {
          element.style.backgroundColor = '#192338'; // Changed to MaxMove navy
          element.innerHTML = '<span style="color: white; font-weight: bold;">P</span>';
        } else {
          element.style.backgroundColor = '#192338'; // Changed to MaxMove navy
          element.innerHTML = '<span style="color: white; font-weight: bold;">D</span>';
        }
        
        return element;
      };

      // Add pickup marker
      if (pickupLocation) {
        const marker = new mapboxgl.Marker({
          element: createCustomMarker('pickup'),
          anchor: 'center'
        })
          .setLngLat(pickupLocation)
          .addTo(map.current);
        markersRef.current.push(marker);
      }

      // Add dropoff marker
      if (dropoffLocation) {
        const marker = new mapboxgl.Marker({
          element: createCustomMarker('dropoff'),
          anchor: 'center'
        })
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
          padding: { top: 100, bottom: 100, left: 100, right: 100 },
          duration: 1000
        });
        
        // Draw a route between the points
        drawRoute();
      } else if (pickupLocation) {
        // If only pickup is provided, center on it
        map.current.flyTo({
          center: pickupLocation,
          zoom: 14,
          duration: 1000
        });
      } else if (dropoffLocation) {
        // If only dropoff is provided, center on it
        map.current.flyTo({
          center: dropoffLocation,
          zoom: 14,
          duration: 1000
        });
      }
    } catch (err) {
      toast.error('Error updating map markers');
    }
  }, [pickupLocation, dropoffLocation, drawRoute]);

  // Update markers when locations change
  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
});

Map.displayName = 'Map';

export default Map;