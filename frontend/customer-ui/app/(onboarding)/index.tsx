import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/(onboarding)/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: '#0e1424' }]}>
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>MAXMOVE</Text>
        <Text style={styles.tagline}>Efficient logistics for Germany</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.accountLink}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.accountText}>
          Already have an account?
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#f1ebdb',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    textAlign: 'center',
  },
  accountLink: {
    position: 'absolute',
    bottom: 60,
    padding: 10,
  },
  accountText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
});