import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { AccountTypeCard } from '@/components/AccountTypeCard';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function AccountTypeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: '#0e1424' }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Select your account type
        </Text>
        <Text style={styles.subtitle}>
          What type of delivery do you need?
        </Text>

        <View style={styles.optionsContainer}>
          <AccountTypeCard
            title="Individual"
            description="For both basic personal and small businesses use"
            onPress={() => router.push('/(auth)/register')}
          />
          
          <AccountTypeCard
            title="Business"
            description="Sign up for exclusive business features or submit your enquiry, and let's talk!"
            onPress={() => router.push('/(auth)/register?type=business')}
          />
        </View>
      </View>

      <View style={styles.footer}>
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
  backButton: {
    padding: 10,
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
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
    color: '#ddd',
  },
  optionsContainer: {
    marginTop: 16,
  },
  footer: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  loginLink: {
    paddingVertical: 16,
  },
  loginText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
});