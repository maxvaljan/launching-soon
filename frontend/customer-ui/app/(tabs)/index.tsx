import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { OrderStops, Stop } from '@/components/OrderStops';
import { VehicleCard } from '@/components/VehicleCard';
import { VehicleImage } from '@/components/VehicleImage';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { getActiveVehicleTypes } from '@/services/supabase';
import { useLocalSearchParams } from 'expo-router';

// Add Vehicle interface
interface Vehicle {
  id: string;
  name: string;
  description: string;
  category?: string;
  icon_path?: string | null;
  custom_icon_url?: string | null;
  svg_icon?: string | null;
  // display_order is not in the database schema, but kept optional for compatibility
  display_order?: number;
  // Database fields for dimensions and weight
  max_dimensions?: string;
  max_weight?: string;
}

// Logo text color constant
const LOGO_TEXT_COLOR = '#f1ebdb';

export default function HomeScreen() {
  const { selectedStopId, selectedAddress } = useLocalSearchParams<{ 
    selectedStopId: string; 
    selectedAddress: string 
  }>();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', type: 'pickup', address: '' },
    { id: '2', type: 'dropoff', address: '' },
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Handler for updating a stop
  const handleUpdateStop = useCallback((id: string, address: string) => {
    setStops(
      stops.map((stop) => (stop.id === id ? { ...stop, address } : stop)),
    );
  }, [stops]);

  // Update stop address when returning from location search screen
  useEffect(() => {
    if (selectedStopId && selectedAddress) {
      handleUpdateStop(selectedStopId, selectedAddress);
    }
  }, [selectedStopId, selectedAddress, handleUpdateStop]);

  // Fetch vehicles directly from Supabase
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // Get vehicles directly from Supabase
        const response = await getActiveVehicleTypes();

        if (response.data && Array.isArray(response.data)) {
          // Sort vehicles by max_weight (from smaller to bigger)
          const sortedVehicles = [...response.data].sort((a, b) => {
            // Always put towing at the end
            if (a.name.includes('Towing')) return 1;
            if (b.name.includes('Towing')) return -1;

            // Extract numeric values from weight strings (e.g., "1000kg" -> 1000)
            const weightA = parseInt(a.max_weight?.replace(/\D/g, '') || '0');
            const weightB = parseInt(b.max_weight?.replace(/\D/g, '') || '0');
            return weightA - weightB; // Ascending order (smaller to bigger)
          });

          setVehicles(sortedVehicles);
        } else {
          setVehicles([]);
        }
      } catch (error) {
        // Log error but don't display to user
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleAddStop = () => {
    if (stops.length < 22) {
      // Place new stop before the last dropoff
      const newId = `${Date.now()}`;
      const newStops = [...stops];
      // Add as 'dropoff' type, the component will handle the placeholder text
      newStops.splice(newStops.length - 1, 0, {
        id: newId,
        type: 'dropoff',
        address: '',
      });
      setStops(newStops);
    }
  };

  const handleFocusStop = () => {
    // Empty handler for focus events (navigation happens in component)
  };

  const handleDeleteStop = (id: string) => {
    // Filter out the stop with the specified id
    setStops(stops.filter((stop) => stop.id !== id));
  };
  
  // Styles for placeholder views in header
  const placeholderStyle = { width: 24 };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <View style={placeholderStyle} />
        <Text style={styles.logoText}>MAXMOVE</Text>
        <View style={placeholderStyle} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stopsContainer}>
          <OrderStops
            stops={stops}
            onAddStop={handleAddStop}
            onUpdateStop={handleUpdateStop}
            onFocusStop={handleFocusStop}
            onDeleteStop={handleDeleteStop}
          />
        </View>

        <View style={styles.vehiclesContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available vehicles
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading vehicles...</Text>
            </View>
          ) : vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                icon={
                  <VehicleImage
                    vehicle={vehicle}
                    style={
                      // Car and Towing get the largest size (55% larger than original)
                      vehicle.name.includes('Car') ||
                      vehicle.name.includes('Towing')
                        ? styles.vehicleIconXLarge
                        : // 3.3m Van, Courier, and 2.7m Van get large size (30% larger than original)
                          vehicle.name.includes('3,3m Van') ||
                            vehicle.name.includes('Courier') ||
                            vehicle.name.includes('2,7m Van')
                          ? styles.vehicleIconLarge
                          : // All others get medium size (15% larger than original)
                            styles.vehicleIconMedium
                    }
                  />
                }
                title={vehicle.name}
                description={vehicle.description}
                dimensions={vehicle.max_dimensions}
                maxWeight={vehicle.max_weight}
                selected={selectedVehicle === vehicle.id}
                onPress={() => setSelectedVehicle(vehicle.id)}
              />
            ))
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.noVehiclesText}>
                No vehicles available at the moment.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: LOGO_TEXT_COLOR,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  stopsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  vehiclesContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
  },
  noVehiclesText: {
    opacity: 0.6,
  },
  vehicleIconXLarge: {
    width: 68,
    height: 68,
  },
  vehicleIconLarge: {
    width: 58,
    height: 58,
  },
  vehicleIconMedium: {
    width: 51,
    height: 51,
  },
});