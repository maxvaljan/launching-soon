import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: '#0e1424' }]}>
      <View style={styles.header}>
        <Text style={styles.logoText}>MAXMOVE</Text>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Reliable delivery, whenever you need it
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Get Started" 
          style={styles.button}
          onPress={() => router.push('/(onboarding)/account-type')}
        />
        
        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginText}>
            Already have an account?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#f1ebdb',
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    textAlign: 'left',
    color: '#fff',
  },
  footer: {
    marginTop: 40,
    marginBottom: 40,
  },
  button: {
    height: 56,
    borderRadius: 12,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
    padding: 8,
  },
  loginText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
});