import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface ConnectivityState {
  isConnected: boolean | null;
  connectionType: string | null;
  isInternetReachable: boolean | null;
  isLoading: boolean;
}

export function useConnectivity(): ConnectivityState {
  const [connectivity, setConnectivity] = useState<ConnectivityState>({
    isConnected: null,
    connectionType: null,
    isInternetReachable: null,
    isLoading: true,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setConnectivity({
        isConnected: state.isConnected,
        connectionType: state.type,
        isInternetReachable: state.isInternetReachable,
        isLoading: false,
      });
    });

    // Initial check
    NetInfo.fetch().then((state) => {
      setConnectivity({
        isConnected: state.isConnected,
        connectionType: state.type,
        isInternetReachable: state.isInternetReachable, 
        isLoading: false,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return connectivity;
}