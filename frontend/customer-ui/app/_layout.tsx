import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import useFonts from '@/hooks/useFonts';
import { Platform, View, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import React from 'react';
import Constants from 'expo-constants';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Export Slot directly initially
export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  // Wrap the entire app in AuthProvider
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { fontsReady, fontError } = useFonts();
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const segments = useSegments();

  const [error, setError] = useState<Error | null>(null);
  const [initLog, setInitLog] = useState<string[]>([]);
  
  // Enhanced debug initialization
  useEffect(() => {
    const log = (msg: string) => {
      console.log(msg);
      setInitLog(prev => [...prev, msg]);
    };

    log('App initializing...');
    log(`Fonts ready: ${fontsReady}`);
    if (fontError) log(`Font error: ${fontError}`);
    log(`Color scheme: ${colorScheme}`);
    
    // Check configuration
    const apiUrl = Constants.expoConfig?.extra?.apiUrl;
    log(`API URL from config: ${apiUrl}`);
    
    // Check environment
    log(`Environment: ${__DEV__ ? 'development' : 'production'}`);
    log(`Platform: ${Platform.OS}`);
  }, [fontsReady, fontError, colorScheme]);

  // Authentication redirection logic
  useEffect(() => {
    if (isLoading || !fontsReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    // Only force redirect IF user IS authenticated and they land in the auth group
    if (isAuthenticated && inAuthGroup) {
      console.log('User authenticated but in auth group, redirecting to tabs...');
      router.replace('/(tabs)/');
    }
    // Keep the logic that redirects authenticated users out of auth group
    // else if (isAuthenticated && inAuthGroup) { ... } // This case is covered by the first `if`

  }, [isAuthenticated, isLoading, fontsReady, segments, router]);

  // Show error state if there's an error
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff5252', padding: 20 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Error</Text>
        <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 20 }}>{error.message}</Text>
        <Text style={{ color: '#fff', fontSize: 12 }}>Init Log:</Text>
        {initLog.map((log, i) => (
          <Text key={i} style={{ color: '#fff', fontSize: 10 }}>{log}</Text>
        ))}
      </View>
    );
  }

  // Show loading state while checking auth or loading fonts
  if (isLoading || !fontsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading...</Text>
        {initLog.map((log, i) => (
          <Text key={i} style={{ color: colors.grayText, fontSize: 10, marginTop: 2 }}>{log}</Text>
        ))}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
      <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />
    </GestureHandlerRootView>
  );
}