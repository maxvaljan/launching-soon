import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, ActivityIndicator, Image } from 'react-native';
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
  icon_path: string | null;
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
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setVehicles(response.data.data);
        } else {
          console.error('Unexpected API response structure:', response.data);
          setVehicles([]);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
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
            vehicles.map(vehicle => {
              let icon: React.ReactNode;
              const supabaseUrl = "https://xuehdmslktlsgpoexilo.supabase.co"; // <-- Use actual Supabase URL
              const storageBucket = "pics"; // Assuming the bucket is named 'pics'
              let iconUrl = null;
              if (vehicle.icon_path && supabaseUrl) {
                const path = vehicle.icon_path.startsWith('/') 
                             ? vehicle.icon_path.substring(1) 
                             : vehicle.icon_path;
                iconUrl = `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${path}`;
              }
              
              if (iconUrl) {
                icon = <Image 
                         source={{ uri: iconUrl }} 
                         style={styles.vehicleIcon} 
                         resizeMode="contain"
                       />;
              } else {
                const typeName = (vehicle.category || vehicle.name || '').toLowerCase();
                if (typeName.includes('motorcycle') || typeName.includes('courier')) {
                  icon = <MotorcycleSvg style={styles.vehicleIcon} />;
                } else if (typeName.includes('van')) {
                  icon = <VanSvg style={styles.vehicleIcon} />;
                } else if (typeName.includes('truck') || typeName.includes('lorry')) {
                  icon = <TruckSvg style={styles.vehicleIcon} />;
                } else {
                  icon = <CarSvg style={styles.vehicleIcon} />;
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
            <View style={styles.loadingContainer}> 
              <Text style={{ color: colors.grayText }}>No vehicles available at the moment.</Text>
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
  vehicleIcon: {
    width: 40,
    height: 40,
  }
});