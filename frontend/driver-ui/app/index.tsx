import { useEffect, useState } from 'react';
import 'react-native-url-polyfill/auto';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

// Import React Native components in a way that works with web
import { StyleSheet, Platform } from 'react-native';
// Explicitly import the named exports to work around TypeScript errors
import { View } from 'react-native';
import { Text } from 'react-native';
import { Image } from 'react-native';
import { Alert } from 'react-native';

export default function StartScreen() {
  const [isDebug, setIsDebug] = useState(true);
  const [navigationError, setNavigationError] = useState<string | null>(null);
  
  useEffect(() => {
    // Show debug info in console instead of Alert for web compatibility
    if (isDebug) {
      console.log('Debug mode enabled');
      console.log('App is loading in debug mode. Will redirect to auth screen soon.');
    }
    
    // Simulate a splash screen by navigating to the auth screen after a short delay
    const timer = setTimeout(() => {
      try {
        // For web compatibility, use a more direct approach
        console.log('Attempting navigation to auth screen...');
        router.replace('/(auth)');
      } catch (error) {
        // Handle error more gracefully for web
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Navigation error:', errorMessage);
        setNavigationError(errorMessage);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isDebug]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>MAXMOVE</Text>
        <Text style={styles.tagline}>Driver Partner</Text>
        {isDebug && (
          <Text style={styles.debug}>DEBUG MODE</Text>
        )}
        {navigationError && (
          <Text style={styles.error}>Error: {navigationError}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontFamily: 'Poppins_700Bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 20,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  debug: {
    fontSize: 12,
    color: 'red',
    backgroundColor: 'yellow',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  error: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    textAlign: 'center',
  },
});