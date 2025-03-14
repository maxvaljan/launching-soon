import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, User, WifiOff } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import FormInput from '@/components/FormInput';
import AuthButton from '@/components/AuthButton';
import * as api from '@/services/api';
import { ApiError } from '@/services/api';
import { useConnectivity } from '@/hooks/useConnectivity';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  // Default country code to +44 (UK) but can be updated based on user settings or locale later
  const [countryCode, setCountryCode] = useState('+44');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isConnected, isInternetReachable } = useConnectivity();
  const isOffline = isConnected === false || isInternetReachable === false;

  const handleClose = () => {
    router.back();
  };

  const isEmail = (text: string) => {
    // RFC 5322 compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(text);
  };

  const handleLogin = async () => {
    // Clear previous errors
    setError(null);
    
    // Validate offline state first
    if (isOffline) {
      setError('No internet connection. Please connect to the internet and try again.');
      return;
    }
    
    // Validate inputs
    if (!identifier) {
      setError('Please enter your email or phone number');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
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
      
      // Call login API with appropriate identifier
      await api.login(formattedIdentifier, password, !isEmailInput);
      
      // On success, navigate to tabs
      router.push('/(tabs)');
    } catch (error) {
      if (error instanceof ApiError) {
        // Handle specific API errors
        if (error.isOffline) {
          setError('Unable to connect to the server. Please check your internet connection.');
        } else if (error.isTimeout) {
          setError('Connection timed out. Please try again.');
        } else if (error.status === 401) {
          setError('Invalid credentials. Please check your email/phone and password.');
        } else if (error.status === 429) {
          setError('Too many login attempts. Please try again later.');
        } else {
          setError(error.message || 'Login failed. Please try again.');
        }
      } else {
        // Handle generic errors
        setError(error instanceof Error ? error.message : 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft color={Colors.textPrimary} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        {isOffline && (
          <View style={styles.offlineContainer}>
            <WifiOff size={20} color={Colors.offline} />
            <Text style={styles.offlineText}>
              No internet connection detected. Connect to a network to log in.
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessageText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <FormInput
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              setError(null); // Clear error when user types
            }}
            placeholder="Email or phone number"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<User size={18} color={Colors.textSecondary} />}
            required
            error={error && !identifier ? "Required" : undefined}
          />
          
          <FormInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null); // Clear error when user types
            }}
            placeholder="Password"
            secureTextEntry
            required
            containerStyle={styles.passwordInput}
            error={error && !password ? "Required" : undefined}
          />

          <AuthButton
            title={loading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            variant="primary"
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
            disabled={!identifier || !password || loading || isOffline}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  offlineContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineText: {
    color: Colors.offline,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  errorMessageContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorMessageText: {
    color: Colors.offline,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  form: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
  },
  passwordInput: {
    marginTop: 8,
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 8,
  },
  loginButtonText: {
    fontFamily: 'Inter_600SemiBold',
  },
});