import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { Power } from 'lucide-react-native';

interface StatusIndicatorProps {
  isOnline: boolean;
  onToggle: () => void;
}

export default function StatusIndicator({ isOnline, onToggle }: StatusIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.statusBar, { backgroundColor: isOnline ? 'transparent' : Colors.surfaceDark }]}>
        <View style={styles.statusIndicator}>
          <View style={[styles.dot, { backgroundColor: isOnline ? Colors.online : Colors.offline }]} />
          <Text style={styles.statusText}>
            {isOnline ? 'You\'re online.' : 'You\'re offline.'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.toggleButton, { backgroundColor: isOnline ? Colors.offline : Colors.online }]}
        onPress={onToggle}
      >
        <Power color={Colors.surfaceLight} size={24} />
        <Text style={styles.toggleText}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 90,
    alignItems: 'center',
  },
  statusBar: {
    width: '95%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '50%',
  },
  toggleText: {
    color: Colors.surfaceLight,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});