import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import useFonts from '@/hooks/useFonts';
import { Platform, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import React from 'react';
import Constants from 'expo-constants';

export default function RootLayout() {
  const { fontsReady, fontError } = useFonts();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
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

  // Loading state with debug info
  if (!fontsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, padding: 20 }}>
        <Text style={{ color: '#fff', marginBottom: 20 }}>Loading...</Text>
        <Text style={{ color: '#fff', fontSize: 12 }}>Init Log:</Text>
        {initLog.map((log, i) => (
          <Text key={i} style={{ color: '#fff', fontSize: 10 }}>{log}</Text>
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