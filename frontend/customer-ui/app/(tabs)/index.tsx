import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { OrderStops, Stop } from '@/components/OrderStops';
import { VehicleCard } from '@/components/VehicleCard';
import { MotorcycleSvg, CarSvg, VanSvg, TruckSvg } from '@/assets/images/vehicles';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { getActiveVehicles } from '@/services/api';

// Add Vehicle interface
interface Vehicle {
  id: string;
  name: string;
  description: string;
  category?: string;
  icon_type?: string;
  custom_icon_url?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', type: 'pickup', address: '' },
    { id: '2', type: 'dropoff', address: '' },
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  // Fetch vehicles from the API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await getActiveVehicles();
        
        if (response.data && response.data.vehicles) {
          setVehicles(response.data.vehicles);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleAddStop = () => {
    if (stops.length < 5) {
      // Place new dropoff before the last dropoff
      const newId = `${Date.now()}`;
      const newStops = [...stops];
      newStops.splice(newStops.length - 1, 0, { id: newId, type: 'dropoff', address: '' });
      setStops(newStops);
    }
  };

  const handleUpdateStop = (id: string, address: string) => {
    setStops(stops.map(stop => stop.id === id ? { ...stop, address } : stop));
  };

  const handleFocusStop = (id: string) => {
    // This would typically open a map or address search
    console.log('Focus on stop', id);
  };

  const handleDeleteStop = (id: string) => {
    // Filter out the stop with the specified id
    setStops(stops.filter(stop => stop.id !== id));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
              <Text style={{ color: colors.text, marginTop: 8 }}>Loading vehicles...</Text>
            </View>
          ) : vehicles && vehicles.length > 0 ? (
            // If we have vehicles from the API, use those
            vehicles.map(vehicle => {
              // Handle custom icon or use built-in icons
              let icon;
              
              // If there's a custom icon URL, create an image component
              if (vehicle.custom_icon_url) {
                // Custom SVG component would be rendered here
                // For React Native, you'd need to use Image or SvgUri from react-native-svg
                // For now we'll fall back to standard icons
                const category = (vehicle.icon_type || vehicle.category || '').toLowerCase();
                if (category === 'bike' || category.includes('motorcycle') || category.includes('courier')) {
                  icon = <MotorcycleSvg />;
                } else if (category === 'truck' || category.includes('van') || category.includes('lorry')) {
                  icon = <TruckSvg />;
                } else {
                  icon = <CarSvg />;
                }
              } else {
                // Use built-in icons based on category or icon_type
                const category = (vehicle.icon_type || vehicle.category || '').toLowerCase();
                if (category === 'bike' || category.includes('motorcycle') || category.includes('courier')) {
                  icon = <MotorcycleSvg />;
                } else if (category === 'truck' || category.includes('van') || category.includes('lorry')) {
                  icon = <TruckSvg />;
                } else {
                  icon = <CarSvg />;
                }
              }
              
              return (
                <VehicleCard
                  key={vehicle.id}
                  icon={icon}
                  title={vehicle.name}
                  description={vehicle.description}
                  selected={selectedVehicle === vehicle.id}
                  onPress={() => setSelectedVehicle(vehicle.id)}
                />
              );
            })
          ) : (
            // Fallback to hardcoded vehicles if API returns no data
            <>
              <VehicleCard
                icon={<MotorcycleSvg />}
                title="Courier"
                description="Small items, documents"
                selected={selectedVehicle === 'courier'}
                onPress={() => setSelectedVehicle('courier')}
              />
              
              <VehicleCard
                icon={<CarSvg />}
                title="Car"
                description="Small and medium parcels"
                selected={selectedVehicle === 'car'}
                onPress={() => setSelectedVehicle('car')}
              />
              
              <VehicleCard
                icon={<CarSvg />}
                title="MPV (Weight<25KG x 2)"
                description="Multiple medium parcels"
                selected={selectedVehicle === 'mpv'}
                onPress={() => setSelectedVehicle('mpv')}
              />
              
              <VehicleCard
                icon={<VanSvg />}
                title="1.7M Van"
                description="Furniture, home appliances"
                selected={selectedVehicle === 'van1.7'}
                onPress={() => setSelectedVehicle('van1.7')}
              />
              
              <VehicleCard
                icon={<VanSvg />}
                title="2.4M Van"
                description="Larger furniture, multiple items"
                selected={selectedVehicle === 'van2.4'}
                onPress={() => setSelectedVehicle('van2.4')}
              />
              
              <VehicleCard
                icon={<TruckSvg />}
                title="Lorry 10ft"
                description="Commercial goods, bulk items"
                selected={selectedVehicle === 'lorry10'}
                onPress={() => setSelectedVehicle('lorry10')}
              />
              
              <VehicleCard
                icon={<TruckSvg />}
                title="Lorry 14ft"
                description="Moving, large quantity goods"
                selected={selectedVehicle === 'lorry14'}
                onPress={() => setSelectedVehicle('lorry14')}
              />
            </>
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
    paddingVertical: 16,
  },
  logoText: {
    fontSize: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  }
});