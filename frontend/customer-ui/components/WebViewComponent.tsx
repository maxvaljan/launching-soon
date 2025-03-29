import React, { useState, ReactElement } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import Colors from '../constants/Colors';

// This component provides a fallback UI for WebView functionality

interface WebViewComponentProps {
  source: { uri: string };
  onNavigationStateChange: (navState: any) => void;
  startInLoadingState?: boolean;
  renderLoading?: () => ReactElement;
}

const WebViewComponent: React.FC<WebViewComponentProps> = ({ 
  source, 
  onNavigationStateChange,
  startInLoadingState = true,
  renderLoading 
}) => {
  const [isLoading, setIsLoading] = useState(startInLoadingState);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Log the source URL for debugging
  console.log('WebViewComponent loaded with URL:', source.uri);

  const defaultLoadingView = (): ReactElement => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setHasError(true);
    setErrorMessage(nativeEvent.description || 'Unknown error');
    
    // Show alert with error details
    Alert.alert(
      'WebView Error',
      `Unable to load the page: ${nativeEvent.description || 'Unknown error'}. Would you like to open it in browser?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // Navigate back to app after a short delay
            setTimeout(() => {
              onNavigationStateChange({ url: 'maxmoveapp://back' });
            }, 500);
          }
        },
        {
          text: 'Open in Browser',
          onPress: async () => {
            try {
              await Linking.openURL(source.uri);
              setTimeout(() => {
                onNavigationStateChange({ url: 'maxmoveapp://back' });
              }, 2000);
            } catch (err) {
              console.error('Could not open URL:', err);
              Alert.alert('Error', 'Could not open the URL');
            }
          }
        }
      ]
    );
  };

  // If there's an error, show error UI
  if (hasError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error Loading Content</Text>
        <Text style={styles.message}>{errorMessage}</Text>
        <Text style={styles.url}>{source.uri}</Text>
      </View>
    );
  }

  return (
    <WebView
      source={source}
      onNavigationStateChange={(navState) => {
        console.log('Navigation state changed:', navState);
        onNavigationStateChange(navState);
      }}
      startInLoadingState={startInLoadingState}
      renderLoading={() => renderLoading ? renderLoading() : defaultLoadingView()}
      onLoadStart={(event) => {
        console.log('WebView started loading:', event.nativeEvent.url);
        setIsLoading(true);
      }}
      onLoadEnd={(event) => {
        console.log('WebView finished loading:', event.nativeEvent.url);
        setIsLoading(false);
      }}
      onError={handleError}
      onHttpError={(event) => {
        console.error('HTTP Error:', event.nativeEvent);
      }}
      style={styles.webview}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    color: '#333',
  },
  // Keep other styles for fallback scenarios
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
    color: Colors.light.primary,
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