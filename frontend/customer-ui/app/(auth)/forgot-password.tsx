import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
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
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: '#fff' }]}>Forgot Password</Text>
        <Text style={[styles.subtitle, { color: colors.grayText }]}>
          {sent 
            ? "We've sent password reset instructions to your email."
            : 'Enter your email address to reset your password'}
        </Text>

        {!sent ? (
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={colors.grayText} />}
            />
            
            <Button 
              title="Reset Password" 
              style={styles.button}
              onPress={handleResetPassword}
              isLoading={loading}
            />
          </View>
        ) : (
          <View style={styles.sentContainer}>
            <Button 
              title="Back to Login" 
              style={styles.button}
              onPress={() => router.push('/(auth)/login')}
            />
            
            <TouchableOpacity 
              style={styles.resendLink}
              onPress={() => setSent(false)}
            >
              <Text style={[styles.resendText, { color: colors.accent }]}>
                Didn't receive the email? Resend
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingTop: 60,
    marginBottom: 40,
  },
  backButton: {
    padding: 10,
    width: 40,
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
    lineHeight: 24,
  },
  form: {
    marginTop: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    marginTop: 24,
  },
  sentContainer: {
    marginTop: 24,
  },
  resendLink: {
    alignSelf: 'center',
    marginTop: 24,
    padding: 8,
  },
  resendText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});