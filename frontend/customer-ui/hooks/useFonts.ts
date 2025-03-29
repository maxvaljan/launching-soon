import { useEffect, useState } from 'react';
import { useFonts as useExpoFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch((err) => {
  console.warn('Error preventing splash screen from hiding:', err);
});

export default function useFonts() {
  const [fontAttempts, setFontAttempts] = useState(0);
  const [fontsLoaded, fontError] = useExpoFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  // Retry loading fonts if there's an error
  useEffect(() => {
    if (fontError && fontAttempts < 3) {
      console.log('Font loading error, retrying...', fontError);
      const timer = setTimeout(() => {
        setFontAttempts(prev => prev + 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [fontError, fontAttempts]);

  // Debug font loading
  useEffect(() => {
    console.log('Font loading status:', { fontsLoaded, fontError, fontAttempts });
  }, [fontsLoaded, fontError, fontAttempts]);

  useEffect(() => {
    const hideSplash = async () => {
      // Only hide splash screen if fonts successfully loaded or we've exhausted retries
      if (fontsLoaded || (fontError && fontAttempts >= 3)) {
        try {
          await SplashScreen.hideAsync();
          console.log('Splash screen hidden successfully');
        } catch (error) {
          console.warn('Error hiding splash screen:', error);
        }
      }
    };

    hideSplash();
  }, [fontsLoaded, fontError, fontAttempts]);

  return {
    fontsLoaded,
    fontError, 
    fontAttempts,
    // Consider fonts "ready" if they're loaded or we've tried 3 times
    fontsReady: fontsLoaded || (fontError && fontAttempts >= 3),
  };
}