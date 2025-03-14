import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, CreditCard, Shield, Bell, MapPin, Settings, CircleHelp as HelpCircle, Star } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: colors.border }]}
            onPress={() => router.push('/(auth)/login')}
          >
            <LogOut size={18} color={colors.text} />
            <Text style={[styles.logoutText, { color: colors.text }]}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80' }}
            style={styles.profileImage}
          />
          
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>Michael Schmidt</Text>
            <Text style={[styles.userPhone, { color: colors.grayText }]}>+49 123 456 7890</Text>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.rating, { color: colors.text }]}>4.9</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment</Text>
          
          <Card style={styles.menuItem} onPress={() => {}}>
            <CreditCard size={22} color={colors.accent} />
            <Text style={[styles.menuText, { color: colors.text }]}>Payment Methods</Text>
          </Card>
          
          <Card style={styles.menuItem} onPress={() => {}}>
            <Shield size={22} color={colors.accent} />
            <Text style={[styles.menuText, { color: colors.text }]}>Transaction History</Text>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          
          <Card style={styles.menuItem} onPress={() => {}}>
            <Bell size={22} color={colors.accent} />
            <Text style={[styles.menuText, { color: colors.text }]}>Notifications</Text>
          </Card>
          
          <Card style={styles.menuItem} onPress={() => {}}>
            <MapPin size={22} color={colors.accent} />
            <Text style={[styles.menuText, { color: colors.text }]}>Addresses</Text>
          </Card>
          
          <Card style={styles.menuItem} onPress={() => {}}>
            <Settings size={22} color={colors.accent} />
            <Text style={[styles.menuText, { color: colors.text }]}>App Settings</Text>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          
          <Card style={styles.menuItem} onPress={() => {}}>
            <HelpCircle size={22} color={colors.accent} />
            <Text style={[styles.menuText, { color: colors.text }]}>Help Center</Text>
          </Card>
          
          <Card style={styles.menuItem} onPress={() => {}}>
            <Star size={22} color={colors.accent} />
            <Text style={[styles.menuText, { color: colors.text }]}>Rate Our App</Text>
          </Card>
        </View>
        
        <Text style={[styles.versionText, { color: colors.grayText }]}>
          MaxMove v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 16,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 16,
  },
});