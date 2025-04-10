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

// Define font fallbacks to be more resilient
const fontAssets = {
  'Inter-Regular': Inter_400Regular,
  'Inter-Medium': Inter_500Medium,
  'Inter-SemiBold': Inter_600SemiBold,
  'Inter-Bold': Inter_700Bold,
  'Poppins-Regular': Poppins_400Regular,
  'Poppins-Medium': Poppins_500Medium,
  'Poppins-SemiBold': Poppins_600SemiBold,
  'Poppins-Bold': Poppins_700Bold,
};

// Create fallbacks for font families
const FALLBACK_FONT_MAP = {
  'Inter-Regular': 'System',
  'Inter-Medium': 'System',
  'Inter-SemiBold': 'System',
  'Inter-Bold': 'System',
  'Poppins-Regular': 'System',
  'Poppins-Medium': 'System',
  'Poppins-SemiBold': 'System',
  'Poppins-Bold': 'System',
};

// Prevent splash screen from auto-hiding immediately
try {
  SplashScreen.preventAutoHideAsync();
} catch (err) {
  // Log but don't crash the app if splash screen API fails
  console.warn('Error preventing splash screen from hiding, ignoring', err);
}

export default function useFonts() {
  const [fontAttempts, setFontAttempts] = useState(0);
  const [fontsLoaded, fontError] = useExpoFonts(fontAssets);

  // Retry loading fonts if there's an error (up to 2 retries)
  useEffect(() => {
    if (fontError && fontAttempts < 2) {
      const timer = setTimeout(() => {
        setFontAttempts((prev) => prev + 1);
      }, 500); // Slightly faster retry

      return () => clearTimeout(timer);
    }
  }, [fontError, fontAttempts]);

  // Hide splash screen once fonts are loaded or after max retries
  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded || fontAttempts >= 2) {
        try {
          await SplashScreen.hideAsync();
        } catch {
          // Just continue if there's an error hiding the splash screen
        }
      }
    };

    hideSplash();
  }, [fontsLoaded, fontAttempts]);

  // Report font loading status (minimal logging)
  const fontsReady = fontsLoaded || fontAttempts >= 2;

  return {
    fontsLoaded,
    fontError,
    fontsReady,
    fontFamilies: fontsReady
      ? fontAssets
      : // If fonts aren't ready, return fallback font map
        FALLBACK_FONT_MAP,
  };
}
