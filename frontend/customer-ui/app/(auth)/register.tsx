import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Phone, Mail, Lock, Globe } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  
  const type = params.type || 'individual';
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/(tabs)');
    }, 1500);
  };

  return (
    <ScrollView 
      style={[styles.container]}
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
        <Text style={styles.title}>
          Create a {type === 'business' ? 'business' : 'personal'} account
        </Text>

        <View style={styles.form}>
          <Input
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.grayText} />}
          />
          
          <Input
            placeholder="Enter your email (optional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.grayText} />}
          />
          
          <Input
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            isPassword
            leftIcon={<Lock size={20} color={colors.grayText} />}
          />
          
          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors.grayText }]}>
              By clicking Sign Up below, you've read the full text and agreed to the{' '}
              <Text style={{ color: colors.accent }}>Terms & Conditions</Text> and{' '}
              <Text style={{ color: colors.accent }}>Privacy Policy</Text>.
            </Text>
          </View>
          
          <Button 
            title="Sign Up" 
            style={styles.button}
            onPress={handleRegister}
            isLoading={loading}
          />
          
          <Text style={[styles.verificationText, { color: colors.grayText }]}>
            You will receive an SMS or call for verification
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={[styles.loginText, { color: colors.grayText }]}>
            Already have an account? <Text style={{ color: colors.accent }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e1424',
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
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 32,
    color: '#f1ebdb',
  },
  form: {
    marginTop: 8,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  button: {
    height: 56,
    borderRadius: 12,
  },
  verificationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginLink: {
    paddingVertical: 16,
  },
  loginText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});