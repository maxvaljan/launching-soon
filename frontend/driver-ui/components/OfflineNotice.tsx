import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Wifi, WifiOff } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useConnectivity } from '@/hooks/useConnectivity';

const { width } = Dimensions.get('window');

export default function OfflineNotice() {
  const { isConnected, isInternetReachable } = useConnectivity();
  const [animation] = React.useState(new Animated.Value(0));
  
  const isOffline = isConnected === false || isInternetReachable === false;

  React.useEffect(() => {
    if (isOffline) {
      // Slide down
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide up
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOffline, animation]);

  if (isConnected === null) {
    return null; // Still loading
  }

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateY }] }
      ]}
    >
      {isOffline ? (
        <>
          <WifiOff size={16} color="#fff" />
          <Text style={styles.text}>No Internet Connection</Text>
        </>
      ) : (
        <>
          <Wifi size={16} color="#fff" />
          <Text style={styles.text}>Connected</Text>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width,
    backgroundColor: Colors.offline,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    marginLeft: 8,
    fontFamily: 'Inter_500Medium',
  },
});