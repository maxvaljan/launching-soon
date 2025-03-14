import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { Car, Map as MapIcon, Wallet, Menu } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surfaceDark,
          borderTopWidth: 0,
          height: 50,
          paddingBottom: Platform.OS === 'ios' ? 10 : 5,
          paddingTop: 10,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 25 : 15,
          left: 20,
          right: 20,
          borderRadius: 25,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Service Types',
          tabBarIcon: ({ color, size }) => (
            <Car size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="destination"
        options={{
          title: 'My Destination',
          tabBarIcon: ({ color, size }) => (
            <MapIcon size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings-activity"
        options={{
          title: 'Earnings & Activity',
          tabBarIcon: ({ color, size }) => (
            <Wallet size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <Menu size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}