import React, { useState, useEffect } from 'react';
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

export default function HomeScreen() {
  // Router removed as it's not used
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', type: 'pickup', address: '' },
    { id: '2', type: 'dropoff', address: '' },
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Fetch vehicles directly from Supabase
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // Get vehicles directly from Supabase
        const response = await getActiveVehicleTypes();

        if (response.data && Array.isArray(response.data)) {
          setVehicles(response.data);
        } else {
          setVehicles([]);
        }
      } catch (error) {
        console.error('Error fetching vehicles from Supabase:', error);
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

  const handleUpdateStop = (id: string, address: string) => {
    setStops(
      stops.map((stop) => (stop.id === id ? { ...stop, address } : stop)),
    );
  };

  const handleFocusStop = (id: string) => {
    // This would typically open a map or address search
    console.log('Focus on stop', id);
  };

  const handleDeleteStop = (id: string) => {
    // Filter out the stop with the specified id
    setStops(stops.filter((stop) => stop.id !== id));
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.logoText}>MAXMOVE</Text>
        <View style={{ width: 24 }} />
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
            vehicles.map((vehicle) => {
              // Debug to see what's available in the vehicle object
              console.log('Vehicle data:', vehicle);
              return (
                <VehicleCard
                  key={vehicle.id}
                  icon={
                    <VehicleImage
                      vehicle={vehicle}
                      style={styles.vehicleIcon}
                    />
                  }
                  title={vehicle.name}
                  description={vehicle.description}
                  dimensions={vehicle.max_dimensions}
                  maxWeight={vehicle.max_weight}
                  selected={selectedVehicle === vehicle.id}
                  onPress={() => setSelectedVehicle(vehicle.id)}
                />
              );
            })
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
    color: '#f1ebdb',
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
  vehicleIcon: {
    width: 44,
    height: 44,
  },
});
