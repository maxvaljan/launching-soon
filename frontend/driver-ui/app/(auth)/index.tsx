import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import AuthButton from '@/components/AuthButton';

export default function LoginScreen() {
  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleSignUp = () => {
    router.push('/(auth)/register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>MAXMOVE</Text>
        <Text style={styles.subtitle}>Partner</Text>
        
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Deliver with freedom,{' '}
            <Text style={styles.accent}>earn</Text> on your terms
          </Text>
          <Text style={styles.heroDescription}>
            Join thousands of delivery partners earning competitive rates across Germany.
          </Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <AuthButton
          title="Login"
          onPress={handleLogin}
          variant="secondary"
          style={styles.loginButton}
          textStyle={styles.buttonText}
        />

        <AuthButton
          title="Sign Up"
          onPress={handleSignUp}
          variant="primary"
          style={styles.signUpButton}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  topSection: {
    flex: 3,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.textSecondary,
    marginTop: -8,
  },
  heroContent: {
    marginTop: 60,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    lineHeight: 42,
  },
  accent: {
    color: Colors.accent,
  },
  heroDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    lineHeight: 24,
  },
  bottomSection: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  loginButton: {
    marginBottom: 16,
  },
  signUpButton: {
    marginBottom: 16,
  },
  buttonText: {
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
});