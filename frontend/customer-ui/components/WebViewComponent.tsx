import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform, Linking } from 'react-native';
import Colors from '../constants/Colors';

// This component provides WebView functionality or a fallback UI
// when WebView isn't available

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
  // Use a platform check to avoid WebView import errors
  const WebViewImplementation = React.useMemo(() => {
    // Only import WebView when actually needed and if we're not in a problematic environment
    if (Platform.OS !== 'web' && !process.env.NODE_ENV?.includes('test')) {
      try {
        // Dynamic import to avoid module not found errors during initial load
        const WebViewModule = require('react-native-webview');
        return WebViewModule.WebView;
      } catch (e) {
        console.warn('WebView module not available:', e);
        return null;
      }
    }
    return null;
  }, []);

  // If WebView is available, use it
  if (WebViewImplementation) {
    return (
      <WebViewImplementation
        source={source}
        onNavigationStateChange={onNavigationStateChange}
        startInLoadingState={startInLoadingState}
        renderLoading={renderLoading}
      />
    );
  }
  
  // Otherwise use our fallback implementation
  React.useEffect(() => {
    // Open in browser if WebView isn't available
    Linking.openURL(source.uri).catch(err => {
      console.error('Failed to open URL:', err);
    });
    
    // Simulate navigation back to app after a delay
    const timer = setTimeout(() => {
      onNavigationStateChange({ url: 'maxmoveapp://earnings' });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>External Content</Text>
      <Text style={styles.message}>
        Opening in your browser...
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