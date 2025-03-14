import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Linking, Alert, Platform } from 'react-native';
import { WebView as RNWebView } from 'react-native-webview';
import Colors from '../constants/Colors';

// This component tries to use the native WebView first
// Falls back to a simulated version if there are issues

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
  const [isError, setIsError] = React.useState(false);
  
  // Handle WebView errors
  const handleError = () => {
    setIsError(true);
    
    // Try to open in external browser
    Alert.alert(
      'WebView Error',
      'Unable to load the page in the app. Would you like to open it in your browser?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // Simulate return to app after 500ms
            setTimeout(() => {
              if (onNavigationStateChange) {
                onNavigationStateChange({ url: 'maxmoveapp://earnings' });
              }
            }, 500);
          }
        },
        {
          text: 'Open',
          onPress: async () => {
            try {
              await Linking.openURL(source.uri);
              // Wait a bit then simulate return to app
              setTimeout(() => {
                if (onNavigationStateChange) {
                  onNavigationStateChange({ url: 'maxmoveapp://earnings' });
                }
              }, 2000);
            } catch (err) {
              Alert.alert('Error', 'Could not open the URL');
              setTimeout(() => {
                if (onNavigationStateChange) {
                  onNavigationStateChange({ url: 'maxmoveapp://earnings' });
                }
              }, 500);
            }
          }
        }
      ]
    );
  };

  // If error occurred, show the fallback UI
  if (isError) {
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
  }

  // Otherwise try to render the actual WebView
  try {
    return (
      <RNWebView
        source={source}
        onNavigationStateChange={onNavigationStateChange}
        startInLoadingState={startInLoadingState}
        renderLoading={renderLoading}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    );
  } catch (error) {
    // If WebView component failed to load or throws error, show fallback
    handleError();
    return null;
  }
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