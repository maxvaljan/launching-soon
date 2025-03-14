import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image } from 'react-native';
import { Search } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function ExploreScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
        
        <Input
          placeholder="Search services, locations..."
          leftIcon={<Search size={20} color={colors.grayText} />}
          containerStyle={styles.searchContainer}
        />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Popular Services
          </Text>
          
          <View style={styles.servicesGrid}>
            <Card style={styles.serviceCard} onPress={() => {}}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1627567838717-c6c3dddb4fd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80' }} 
                style={styles.serviceImage} 
              />
              <Text style={[styles.serviceTitle, { color: colors.text }]}>Same-Day Delivery</Text>
            </Card>
            
            <Card style={styles.serviceCard} onPress={() => {}}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1605256585681-455837661b76?ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80' }} 
                style={styles.serviceImage} 
              />
              <Text style={[styles.serviceTitle, { color: colors.text }]}>Furniture Moving</Text>
            </Card>
            
            <Card style={styles.serviceCard} onPress={() => {}}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80' }} 
                style={styles.serviceImage} 
              />
              <Text style={[styles.serviceTitle, { color: colors.text }]}>Grocery Delivery</Text>
            </Card>
            
            <Card style={styles.serviceCard} onPress={() => {}}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80' }} 
                style={styles.serviceImage} 
              />
              <Text style={[styles.serviceTitle, { color: colors.text }]}>Office Moves</Text>
            </Card>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Locations
          </Text>
          
          <Card style={styles.locationCard} onPress={() => {}}>
            <Text style={[styles.locationTitle, { color: colors.text }]}>
              Home
            </Text>
            <Text style={[styles.locationAddress, { color: colors.grayText }]}>
              Friedrichstraße 123, 10117 Berlin
            </Text>
          </Card>
          
          <Card style={styles.locationCard} onPress={() => {}}>
            <Text style={[styles.locationTitle, { color: colors.text }]}>
              Office
            </Text>
            <Text style={[styles.locationAddress, { color: colors.grayText }]}>
              Torstraße 45, 10119 Berlin
            </Text>
          </Card>
          
          <Card style={styles.locationCard} onPress={() => {}}>
            <Text style={[styles.locationTitle, { color: colors.text }]}>
              Grocery Store
            </Text>
            <Text style={[styles.locationAddress, { color: colors.grayText }]}>
              Alexanderplatz 7, 10178 Berlin
            </Text>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Special Offers
          </Text>
          
          <Card style={styles.offerCard} onPress={() => {}}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1586892478025-2b5472316981?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
              style={styles.offerImage} 
            />
            <View style={styles.offerContent}>
              <Text style={[styles.offerTitle, { color: colors.text }]}>
                15% OFF Your First Delivery
              </Text>
              <Text style={[styles.offerDesc, { color: colors.grayText }]}>
                Use code: MAXMOVE15
              </Text>
            </View>
          </Card>
          
          <Card style={styles.offerCard} onPress={() => {}}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
              style={styles.offerImage} 
            />
            <View style={styles.offerContent}>
              <Text style={[styles.offerTitle, { color: colors.text }]}>
                Business Package Deal
              </Text>
              <Text style={[styles.offerDesc, { color: colors.grayText }]}>
                Save 20% on bulk deliveries
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  serviceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    padding: 12,
  },
  locationCard: {
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  offerCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  offerContent: {
    padding: 16,
  },
  offerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  offerDesc: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});