import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Package, Clock, CircleCheck as CheckCircle, X, ChevronRight } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

// Sample data for orders
const orders = [
  {
    id: '1',
    pickupAddress: 'Friedrichstraße 123, Berlin',
    dropoffAddress: 'Alexanderplatz 7, Berlin',
    status: 'active',
    date: '30 June 2025',
    time: '14:30',
    vehicle: 'Car',
    price: '€18.50',
  },
  {
    id: '2',
    pickupAddress: 'Torstraße 45, Berlin',
    dropoffAddress: 'Potsdamer Platz 1, Berlin',
    status: 'completed',
    date: '28 June 2025',
    time: '10:15',
    vehicle: 'Courier',
    price: '€12.75',
  },
  {
    id: '3',
    pickupAddress: 'Unter den Linden 10, Berlin',
    dropoffAddress: 'Kurfürstendamm 234, Berlin',
    status: 'completed',
    date: '25 June 2025',
    time: '16:45',
    vehicle: 'Van',
    price: '€32.00',
  },
  {
    id: '4',
    pickupAddress: 'Mühlenstraße 3, Berlin',
    dropoffAddress: 'Warschauer Str. 55, Berlin',
    status: 'cancelled',
    date: '22 June 2025',
    time: '09:30',
    vehicle: 'Car',
    price: '€15.25',
  },
];

export default function OrdersScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') return order.status === 'active';
    if (activeTab === 'completed') return order.status === 'completed';
    return order.status === 'cancelled';
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock size={18} color={colors.accent} />;
      case 'completed':
        return <CheckCircle size={18} color={colors.success} />;
      case 'cancelled':
        return <X size={18} color={colors.error} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Orders</Text>
        
        <View style={[styles.tabContainer, { backgroundColor: colorScheme === 'dark' ? colors.secondary : colors.gray }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'active' && { backgroundColor: colors.accent },
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'active' ? '#0e1424' : colors.text },
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && { backgroundColor: colors.accent },
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'completed' ? '#0e1424' : colors.text },
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'cancelled' && { backgroundColor: colors.accent },
            ]}
            onPress={() => setActiveTab('cancelled')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'cancelled' ? '#0e1424' : colors.text },
              ]}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Package size={48} color={colors.grayText} />
            <Text style={[styles.emptyText, { color: colors.grayText }]}>
              No {activeTab} orders found
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={[styles.orderDate, { color: colors.text }]}>
                  {item.date} • {item.time}
                </Text>
                <View style={styles.statusContainer}>
                  {getStatusIcon(item.status)}
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          item.status === 'active'
                            ? colors.accent
                            : item.status === 'completed'
                              ? colors.success
                              : colors.error,
                      },
                    ]}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.orderPrice, { color: colors.text }]}>{item.price}</Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? colors.border : '#e0e0e0' }]} />
            
            <View style={styles.addressContainer}>
              <View style={styles.addressRow}>
                <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                <View style={styles.addressContent}>
                  <Text style={[styles.addressLabel, { color: colors.grayText }]}>From</Text>
                  <Text style={[styles.address, { color: colors.text }]}>
                    {item.pickupAddress}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.verticalLine, { backgroundColor: colors.border }]} />
              
              <View style={styles.addressRow}>
                <View style={[styles.pin, { borderColor: colors.accent }]} />
                <View style={styles.addressContent}>
                  <Text style={[styles.addressLabel, { color: colors.grayText }]}>To</Text>
                  <Text style={[styles.address, { color: colors.text }]}>
                    {item.dropoffAddress}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.cardFooter}>
              <Text style={[styles.vehicleText, { color: colors.grayText }]}>
                Vehicle: {item.vehicle}
              </Text>
              
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={[styles.detailsText, { color: colors.accent }]}>Details</Text>
                <ChevronRight size={16} color={colors.accent} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
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
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  orderPrice: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 12,
  },
  addressContainer: {
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  pin: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  verticalLine: {
    width: 2,
    height: 20,
    marginLeft: 5,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  vehicleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
});