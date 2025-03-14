import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { 
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { SplashScreen } from 'expo-router';
import { View, StyleSheet, Text, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import ErrorBoundary from '@/components/ErrorBoundary';
import OfflineNotice from '@/components/OfflineNotice';
import { useConnectivity } from '@/hooks/useConnectivity';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  console.warn('Failed to prevent splash screen from auto-hiding');
});

function AppContent() {
  const [layoutError, setLayoutError] = useState<string | null>(null);
  const { isConnected, isInternetReachable, isLoading } = useConnectivity();
  
  // Initialize framework
  try {
    useFrameworkReady();
  } catch (error) {
    console.error('Framework ready error:', error);
    setLayoutError('Framework initialization error');
  }

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Poppins_600SemiBold,
    Poppins_700Bold
  });

  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
      setLayoutError('Font loading error');
    }

    if (fontsLoaded || fontError) {
      // Hide the splash screen
      SplashScreen.hideAsync().catch(e => {
        console.warn('Failed to hide splash screen:', e);
      });
    }
  }, [fontsLoaded, fontError]);

  // Show a simple fallback while fonts are loading
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading fonts...</Text>
      </View>
    );
  }

  // Show error fallback
  if (layoutError || fontError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {layoutError || 'Font error: Using system font instead'}
        </Text>
      </View>
    );
  }

  // Check if we're offline when app is starting
  const isOffline = !isLoading && (isConnected === false || isInternetReachable === false);

  return (
    <View style={styles.container}>
      <OfflineNotice />
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: Colors.primary }
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
      <StatusBar style="light" />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: Colors.textPrimary,
    fontSize: 18,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 5,
  }
});