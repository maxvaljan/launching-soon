import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertOctagon, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorScreen({ 
  message = 'Something went wrong', 
  onRetry, 
  showRetry = true 
}: ErrorScreenProps) {
  return (
    <View style={styles.container}>
      <AlertOctagon size={50} color={Colors.offline} />
      <Text style={styles.message}>{message}</Text>
      
      {showRetry && onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw size={20} color={Colors.surfaceLight} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  retryText: {
    color: Colors.surfaceLight,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
});