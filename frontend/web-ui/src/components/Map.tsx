'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';
import { toast } from 'sonner';
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

interface MapProps {
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  stops?: { address: string; latitude?: number; longitude?: number; type: string }[];
  isLoaded: boolean;
  hideControls?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 50.9367, // Cologne, Germany
  lng: 6.9578,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

const directionsOptions = {
  polylineOptions: {
    strokeColor: '#192338', // MaxMove navy color
    strokeWeight: 4,
    strokeOpacity: 0.8,
  },
  suppressMarkers: true,
};

const Map = memo(
  ({
    pickupLat,
    pickupLng,
    dropoffLat,
    dropoffLng,
    stops = [],
    isLoaded,
    hideControls = false,
  }: MapProps) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsResponse, setDirectionsResponse] =
      useState<google.maps.DirectionsResult | null>(null);
    const [directionsKey, setDirectionsKey] = useState(0);

    const onLoad = useCallback((mapInstance: google.maps.Map) => {
      setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(() => {
      setMap(null);
    }, []);

    const directionsCallback = useCallback(
      (response: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        if (status === 'OK' && response) {
          console.log('Directions received:', response);
          setDirectionsResponse(response);
        } else {
          console.error(`Error fetching directions ${response}, status: ${status}`);
          setDirectionsResponse(null);
          if (status !== 'ZERO_RESULTS') {
            toast.error('Could not calculate the route.');
          }
        }
      },
      []
    );

    useEffect(() => {
      if (pickupLat && pickupLng && dropoffLat && dropoffLng) {
        setDirectionsKey(prev => prev + 1);
        setDirectionsResponse(null);
      } else {
        setDirectionsResponse(null);
      }
    }, [pickupLat, pickupLng, dropoffLat, dropoffLng, stops]);

    useEffect(() => {
      if (!map) return;

      const hasPickup = pickupLat !== undefined && pickupLng !== undefined;
      const hasDropoff = dropoffLat !== undefined && dropoffLng !== undefined;

      if (hasPickup && hasDropoff) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(pickupLat!, pickupLng!));
        bounds.extend(new window.google.maps.LatLng(dropoffLat!, dropoffLng!));
        stops?.forEach(stop => {
          if (stop.latitude && stop.longitude) {
            bounds.extend(new window.google.maps.LatLng(stop.latitude, stop.longitude));
          }
        });
        map.fitBounds(bounds, 100);
      } else if (hasPickup) {
        map.panTo({ lat: pickupLat!, lng: pickupLng! });
        map.setZoom(14);
      } else if (hasDropoff) {
        map.panTo({ lat: dropoffLat!, lng: dropoffLng! });
        map.setZoom(14);
      } else {
        map.panTo(defaultCenter);
        map.setZoom(12);
      }
    }, [map, pickupLat, pickupLng, dropoffLat, dropoffLng, stops]);

    if (!isLoaded) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">Loading Map...</div>
      );
    }

    const waypoints = stops
      .slice(1, -1)
      .filter(stop => stop.latitude && stop.longitude)
      .map(stop => ({
        location: { lat: stop.latitude!, lng: stop.longitude! },
        stopover: true,
      }));

    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={12}
        options={{ ...mapOptions, zoomControl: !hideControls }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {stops.map((stop, index) => {
          if (!stop.latitude || !stop.longitude) return null;

          let labelText = '';
          let bgColor = '#192338';

          if (stop.type === 'pickup') {
            labelText = 'P';
          } else if (stop.type === 'dropoff') {
            labelText = 'D';
          } else {
            bgColor = '#6B7280';
          }

          return (
            <Marker
              key={`${stop.type}-${index}`}
              position={{ lat: stop.latitude, lng: stop.longitude }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: bgColor,
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 10,
              }}
              label={{
                text: labelText,
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '12px',
              }}
              title={stop.address || stop.type}
            />
          );
        })}

        {pickupLat && pickupLng && dropoffLat && dropoffLng && (
          <>
            <DirectionsService
              key={directionsKey}
              options={{
                destination: { lat: dropoffLat, lng: dropoffLng },
                origin: { lat: pickupLat, lng: pickupLng },
                waypoints: waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
              }}
              callback={directionsCallback}
            />

            {directionsResponse && (
              <DirectionsRenderer options={directionsOptions} directions={directionsResponse} />
            )}
          </>
        )}
      </GoogleMap>
    );
  }
);

Map.displayName = 'Map';

export default Map;
