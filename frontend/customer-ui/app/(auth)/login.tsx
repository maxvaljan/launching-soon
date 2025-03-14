import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Lock } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import * as api from '@/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+49');

  const isEmail = (text: string) => {
    return text.includes('@') && text.includes('.');
  };

  const handleLogin = async () => {
    if (!identifier) {
      Alert.alert('Error', 'Please enter your email or phone number');
      return;
    }
    
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    setLoading(true);
    
    try {
      // Determine if input is email or phone
      const isEmailInput = isEmail(identifier);
      
      // For phone numbers, prepend country code if it doesn't already have one
      const formattedIdentifier = !isEmailInput && !identifier.startsWith('+') 
        ? `${countryCode}${identifier}` 
        : identifier;
      
      // Call login API with appropriate identifier type
      await api.login(formattedIdentifier, password, isEmailInput);
      
      // On success, navigate to tabs
      router.push('/(tabs)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: '#0e1424' }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.logoText}>MAXMOVE</Text>
        
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: '#fff' }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: '#bbb' }]}>
          Login to your account to continue
        </Text>

        <View style={styles.form}>
          <Input
            label="Email or Phone Number"
            placeholder="Enter your email or phone number"
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<User size={20} color={colors.grayText} />}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
            leftIcon={<Lock size={20} color={colors.grayText} />}
          />
          
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.accent }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          <Button 
            title="Login" 
            style={styles.button}
            onPress={handleLogin}
            isLoading={loading}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.registerLink}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={[styles.registerText, { color: '#bbb' }]}>
            Don't have an account? <Text style={{ color: colors.accent }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 40,
  },
  backButton: {
    padding: 10,
  },
  logoText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#f1ebdb',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
  },
  form: {
    marginTop: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  button: {
    height: 56,
    borderRadius: 12,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  registerLink: {
    paddingVertical: 16,
  },
  registerText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});