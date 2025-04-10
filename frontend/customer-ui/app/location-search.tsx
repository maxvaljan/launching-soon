import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MapPin, ArrowLeft, X, Navigation } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

// Define interfaces to avoid using any
interface GeocodingAddress {
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface LocationModule {
  requestForegroundPermissionsAsync: () => Promise<{ status: string }>;
  getCurrentPositionAsync: (options?: Record<string, unknown>) => Promise<{ coords: LocationCoords }>;
  reverseGeocodeAsync: (location: LocationCoords) => Promise<GeocodingAddress[]>;
}

// Create a location mock implementation
const locationMock: LocationModule = {
  requestForegroundPermissionsAsync: async () => ({ status: 'denied' }),
  getCurrentPositionAsync: async () => ({ coords: { latitude: 0, longitude: 0 } }),
  reverseGeocodeAsync: async () => ([{ street: '', city: '', region: '', postalCode: '', country: '' }]),
};

// Set up mock or real location module
let Location: LocationModule;
try {
  // Use dynamic import with eslint disable for require
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Location = require('expo-location');
} catch (_) {
  // Use mock if module is not available
  Location = locationMock;
}

// Mock data for saved and recent addresses
interface Address {
  id: string;
  primary: string;
  secondary?: string;
  type?: 'current' | 'saved' | 'recent';
}

export default function LocationSearchScreen() {
  const { stopId, type } = useLocalSearchParams<{ stopId: string; type: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [searchResults, setSearchResults] = useState<Address[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Address | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState<boolean>(false);

  // Title based on stop type
  const title = type === 'pickup' ? 'Pick-up location' : 'Drop-off location';

  // Fetch current location implementation
  const fetchCurrentLocation = useCallback(async () => {
    if (!locationPermission) return;
    
    setLoadingCurrentLocation(true);
    try {
      // Check if the real Location module is available (not the mock)
      if (!Location || typeof Location.getCurrentPositionAsync !== 'function') {
        throw new Error('Location module not available');
      }
      
      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      if (geocode.length > 0) {
        const address = geocode[0];
        const formattedAddress = [
          address.street,
          address.city,
          address.region,
          address.postalCode,
          address.country
        ].filter(Boolean).join(', ');
        
        setCurrentLocation({
          id: 'current',
          primary: 'Current location',
          secondary: formattedAddress,
          type: 'current'
        });
      }
    } catch (error) {
      // If we couldn't get the location, set a fallback
      setCurrentLocation({
        id: 'current',
        primary: 'Current location',
        secondary: 'Enable location services to use this feature',
        type: 'current'
      });
    } finally {
      setLoadingCurrentLocation(false);
    }
  }, [locationPermission]);

  // Initialize mock data
  useEffect(() => {
    setAddresses([
      { 
        id: '1', 
        primary: '75 Ayer Rajah Crescent', 
        secondary: '75 Ayer Rajah Crescent, Singapore 139953', 
        type: 'saved' 
      },
      { 
        id: '2', 
        primary: '4008 Ang Mo Kio Avenue 10', 
        secondary: '4008', 
        type: 'recent' 
      },
      { 
        id: '3', 
        primary: 'Jean Yip Building', 
        secondary: '50 Kaki Bukit Pl, Singapore 415926', 
        type: 'recent' 
      },
      { 
        id: '4', 
        primary: '3 Fraser Street', 
        secondary: 'Max • 81209493', 
        type: 'recent' 
      },
      { 
        id: '5', 
        primary: 'Bevolution Pte Ltd', 
        secondary: 'Max • 81209493', 
        type: 'recent' 
      },
    ]);

    // Request location permission
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    };

    getLocationPermission();
  }, []);

  // Fetch current location when permission is granted
  useEffect(() => {
    if (locationPermission) {
      fetchCurrentLocation();
    }
  }, [locationPermission, fetchCurrentLocation]);

  // Search handler
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Mock search with delay to simulate API call
    setLoading(true);
    setTimeout(() => {
      const results = [
        {
          id: 's1',
          primary: `${text} Street`,
          secondary: `Singapore 123456`,
        },
        {
          id: 's2',
          primary: `${text} Avenue`,
          secondary: `Singapore 234567`,
        },
        {
          id: 's3',
          primary: `${text} Road`,
          secondary: `Singapore 345678`,
        },
      ];
      setSearchResults(results);
      setLoading(false);
    }, 500);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Select address and return to previous screen
  const selectAddress = (address: Address) => {
    // Get address text - prefer secondary if available (full address), otherwise use primary 
    const addressText = address.secondary || address.primary;
    
    // Store selected address in route parameters
    router.push({
      pathname: '/(tabs)',
      params: { 
        selectedStopId: stopId, 
        selectedAddress: addressText 
      }
    });
  };

  // Extract styles for address items to avoid inline styles
  const getAddressSectionStyles = () => {
    const addressItemStyle = [styles.addressItem];
    const primaryTextStyle = [styles.addressPrimary, { color: colors.text }];
    const secondaryTextStyle = [styles.addressSecondary, { color: colors.grayText }];
    
    return { addressItemStyle, primaryTextStyle, secondaryTextStyle };
  };
  
  const { addressItemStyle, primaryTextStyle, secondaryTextStyle } = getAddressSectionStyles();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <View style={styles.searchBarContainer}>
          <View style={[styles.searchBar, { backgroundColor: colorScheme === 'dark' ? colors.secondary : colors.gray }]}>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={title}
              placeholderTextColor={colors.grayText}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery ? (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <X size={18} color={colors.text} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : searchQuery ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={addressItemStyle}
                onPress={() => selectAddress(item)}
              >
                <MapPin size={20} color={colors.primary} style={styles.addressIcon} />
                <View style={styles.addressTextContainer}>
                  <Text style={primaryTextStyle}>{item.primary}</Text>
                  {item.secondary && (
                    <Text style={secondaryTextStyle}>
                      {item.secondary}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.grayText }]}>
                  No results found
                </Text>
              </View>
            }
          />
        ) : (
          <>
            {currentLocation && (
              <View style={styles.section}>
                <TouchableOpacity 
                  style={addressItemStyle}
                  onPress={() => selectAddress(currentLocation)}
                >
                  <Navigation size={20} color={colors.primary} style={styles.addressIcon} />
                  <View style={styles.addressTextContainer}>
                    <Text style={primaryTextStyle}>
                      Current location
                    </Text>
                    <Text style={secondaryTextStyle}>
                      {currentLocation.secondary}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            
            {loadingCurrentLocation && (
              <View style={styles.currentLocationLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.grayText }]}>
                  Getting current location...
                </Text>
              </View>
            )}

            {addresses.some(a => a.type === 'saved') && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  Saved addresses
                </Text>
                {addresses
                  .filter(a => a.type === 'saved')
                  .map(address => (
                    <TouchableOpacity 
                      key={address.id}
                      style={addressItemStyle}
                      onPress={() => selectAddress(address)}
                    >
                      <MapPin size={20} color={colors.primary} style={styles.addressIcon} />
                      <View style={styles.addressTextContainer}>
                        <Text style={primaryTextStyle}>
                          {address.primary}
                        </Text>
                        {address.secondary && (
                          <Text style={secondaryTextStyle}>
                            {address.secondary}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                }
              </View>
            )}

            {addresses.some(a => a.type === 'recent') && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  Recent locations
                </Text>
                {addresses
                  .filter(a => a.type === 'recent')
                  .map(address => (
                    <TouchableOpacity 
                      key={address.id}
                      style={addressItemStyle}
                      onPress={() => selectAddress(address)}
                    >
                      <MapPin size={20} color={colors.primary} style={styles.addressIcon} />
                      <View style={styles.addressTextContainer}>
                        <Text style={primaryTextStyle}>
                          {address.primary}
                        </Text>
                        {address.secondary && (
                          <Text style={secondaryTextStyle}>
                            {address.secondary}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                }
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchBarContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  clearButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  addressIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressPrimary: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  addressSecondary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  currentLocationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});