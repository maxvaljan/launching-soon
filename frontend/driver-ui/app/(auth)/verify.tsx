import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import OTPInput from '@/components/OTPInput';

export default function VerifyScreen() {
  const [countdown, setCountdown] = useState(120);
  const [code, setCode] = useState('');
  const phoneNumber = '+49 1578******';
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleResendCode = () => {
    // In a real app, this would trigger a new code to be sent
    setCountdown(120);
  };
  
  const handleVerify = (verificationCode: string) => {
    // In a real app, verify the code with the backend
    setCode(verificationCode);
    
    // Navigate to main app after successful verification
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={Colors.textPrimary} size={24} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Verify account with OTP</Text>
        <Text style={styles.subtitle}>
          We've sent a 4-digit code to {phoneNumber}
        </Text>
        
        <OTPInput codeCount={4} onCodeFilled={handleVerify} />
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendLabel}>
            {countdown > 0 
              ? `Didn't get a code?`
              : 'Need a new code?'
            }
          </Text>
          {countdown > 0 ? (
            <Text style={styles.countdownText}>
              Request new code in {formatTime(countdown)}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendButton}>Request new code</Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  resendLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  countdownText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resendButton: {
    fontSize: 16,
    color: Colors.accent,
    fontFamily: 'Inter_600SemiBold',
  },
});