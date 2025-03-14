import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

// This is a fallback component that will be used when WebView fails to load
// It provides a placeholder UI instead of crashing the app

interface WebViewComponentProps {
  source: { uri: string };
  onNavigationStateChange: (navState: any) => void;
  startInLoadingState?: boolean;
  renderLoading?: () => React.ReactNode;
}

const WebViewComponent: React.FC<WebViewComponentProps> = ({ 
  source, 
  onNavigationStateChange,
  startInLoadingState,
  renderLoading 
}) => {
  // In a real implementation, you would need to import the actual WebView
  // This is just a placeholder component

  React.useEffect(() => {
    // Simulate loading complete and navigation back to app URL after 2 seconds
    const timer = setTimeout(() => {
      onNavigationStateChange({ url: 'maxmoveapp://earnings' });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stripe Connect Setup</Text>
      <Text style={styles.message}>
        Opening Stripe Connect in browser...
      </Text>
      <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      <Text style={styles.url}>{source.uri}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.primary,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  loader: {
    marginVertical: 24,
  },
  url: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default WebViewComponent;