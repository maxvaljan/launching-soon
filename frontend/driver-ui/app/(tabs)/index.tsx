import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform, SafeAreaView } from 'react-native';
import { Info } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import StatusIndicator from '@/components/StatusIndicator';

// Conditionally import MapView components
let MapView, Marker, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
  // This code will only run on native platforms
  const MapComponents = require('react-native-maps');
  MapView = MapComponents.default;
  Marker = MapComponents.Marker;
  PROVIDER_GOOGLE = MapComponents.PROVIDER_GOOGLE;
}

export default function HomeScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState(null);
  
  // We'll track the current status on the server using our API service
  const updateDriverStatus = async (status) => {
    try {
      // Using the API service we created
      // For the actual implementation, you'd import { driverAPI } from '../../services/api';
      await driverAPI.updateStatus(status);
      console.log('Driver status updated successfully');
    } catch (err) {
      console.error('Error updating driver status:', err);
      // Revert UI state if server update fails
      setIsOnline(!status === 'available');
    }
  };
  
  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ];

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus); // Update UI immediately for responsiveness
    
    // Send status update to server
    updateDriverStatus(newStatus ? 'available' : 'offline');
  };
  
  // Setup location tracking if the driver is online
  useEffect(() => {
    let watchId;
    
    if (isOnline && Platform.OS !== 'web') {
      // Start location tracking
      watchId = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          // Update location on server
          updateDriverLocation(latitude, longitude);
        },
        error => console.error('Location error:', error),
        { enableHighAccuracy: true, distanceFilter: 10 } // Update every 10 meters
      );
    }
    
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline]);
  
  // Import the API services - for simplicity just show the import here
  // import { driverAPI } from '../../services/api';
  
  // We'll use our API service instead of direct fetch calls
  const updateDriverLocation = async (latitude, longitude) => {
    try {
      // Using the API service we created
      await driverAPI.updateLocation({
        latitude,
        longitude,
        status: isOnline ? 'available' : 'offline'
      });
      
      console.log('Driver location updated successfully');
    } catch (err) {
      console.error('Error updating driver location:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {Platform.OS !== 'web' ? (
          // Native platforms: Use actual MapView
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={mapStyle}
            initialRegion={{
              latitude: 52.520008,
              longitude: 13.404954,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{ latitude: 52.520008, longitude: 13.404954 }}
              title="Your Location"
            />
          </MapView>
        ) : (
          // Web platform: Show a placeholder
          <View style={[styles.map, styles.webMapPlaceholder]}>
            <Text style={styles.webMapText}>
              Map view (Berlin, Germany)
            </Text>
            <Text style={styles.webMapSubtext}>
              Interactive map available on mobile devices
            </Text>
          </View>
        )}

        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>MAXMOVE</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ 5.00</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.earnings}>
            <Text style={styles.earningsText}>Earnings</Text>
          </TouchableOpacity>
        </View>

        <StatusIndicator isOnline={isOnline} onToggle={toggleOnlineStatus} />
        
        <TouchableOpacity style={styles.infoButton}>
          <Info size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webMapPlaceholder: {
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMapText: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
  },
  webMapSubtext: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: Colors.textPrimary,
  },
  ratingContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 10,
  },
  rating: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  earnings: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  earningsText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  infoButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }
});