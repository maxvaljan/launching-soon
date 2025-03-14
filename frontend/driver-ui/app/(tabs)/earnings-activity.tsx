import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Wallet, Activity, TrendingUp, CircleArrowDown as ArrowDownCircle, Calendar, ChevronRight } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function EarningsActivityScreen() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabPress = (index: number) => {
    setActiveTab(index);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming(activeTab * (width / 2 - 30), { duration: 250 }) },
      ],
    };
  });

  // Sample data
  const weeklyEarnings = [
    { day: 'Mon', amount: 75 },
    { day: 'Tue', amount: 120 },
    { day: 'Wed', amount: 85 },
    { day: 'Thu', amount: 140 },
    { day: 'Fri', amount: 195 },
    { day: 'Sat', amount: 220 },
    { day: 'Sun', amount: 180 },
  ];

  const recentActivities = [
    { id: 1, type: 'Delivery', time: '10:30 AM', date: 'Today', amount: 18.50, status: 'Completed' },
    { id: 2, type: 'Delivery', time: '2:15 PM', date: 'Today', amount: 22.75, status: 'Completed' },
    { id: 3, type: 'Delivery', time: '6:40 PM', date: 'Yesterday', amount: 15.20, status: 'Completed' },
    { id: 4, type: 'Delivery', time: '11:25 AM', date: 'Yesterday', amount: 28.90, status: 'Canceled' },
  ];

  // Find max amount for scaling chart
  const maxAmount = Math.max(...weeklyEarnings.map(item => item.amount));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => handleTabPress(0)}
          activeOpacity={0.8}
        >
          <Wallet 
            size={20} 
            color={activeTab === 0 ? Colors.textPrimary : Colors.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 0 && styles.activeTabText
          ]}>
            Earnings
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => handleTabPress(1)}
          activeOpacity={0.8}
        >
          <Activity 
            size={20} 
            color={activeTab === 1 ? Colors.textPrimary : Colors.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 1 && styles.activeTabText
          ]}>
            Activity
          </Text>
        </TouchableOpacity>
        
        <Animated.View style={[styles.tabIndicator, indicatorStyle]} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 0 ? (
          // Earnings Tab Content
          <View style={styles.earningsContainer}>
            <View style={styles.totalEarningsCard}>
              <Text style={styles.totalEarningsLabel}>
                Total Earnings This Week
              </Text>
              <Text style={styles.totalEarningsAmount}>€1,015.00</Text>
              <View style={styles.earningsChange}>
                <TrendingUp size={16} color={Colors.online} />
                <Text style={styles.earningsChangeText}>+12.5% from last week</Text>
              </View>
            </View>

            <View style={styles.earningsChartContainer}>
              <Text style={styles.sectionTitle}>Weekly Overview</Text>
              <View style={styles.chartContainer}>
                {weeklyEarnings.map((item, index) => (
                  <View key={index} style={styles.chartBarContainer}>
                    <View style={styles.chartBarLabelContainer}>
                      <Text style={styles.chartValue}>€{item.amount}</Text>
                      <View style={[
                        styles.chartBar, 
                        { 
                          height: interpolate(
                            item.amount, 
                            [0, maxAmount], 
                            [0, 120]
                          ) 
                        }
                      ]} />
                    </View>
                    <Text style={styles.chartLabel}>{item.day}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.earningsSummaryContainer}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Deliveries</Text>
                  <Text style={styles.summaryValue}>42</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Hours Online</Text>
                  <Text style={styles.summaryValue}>38.5</Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Avg. Per Delivery</Text>
                  <Text style={styles.summaryValue}>€24.20</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Avg. Per Hour</Text>
                  <Text style={styles.summaryValue}>€26.40</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View Complete History</Text>
              <ChevronRight size={18} color={Colors.accent} />
            </TouchableOpacity>
          </View>
        ) : (
          // Activity Tab Content
          <View style={styles.activityContainer}>
            <View style={styles.activityStatsCard}>
              <View style={styles.statItem}>
                <ArrowDownCircle size={24} color={Colors.accent} />
                <View style={styles.statTextContainer}>
                  <Text style={styles.statValue}>47</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Calendar size={24} color={Colors.accent} />
                <View style={styles.statTextContainer}>
                  <Text style={styles.statValue}>4.92</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Activity</Text>
            
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityLeft}>
                  <View style={styles.activityIcon}>
                    <Wallet size={20} color={Colors.textPrimary} />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityType}>{activity.type}</Text>
                    <Text style={styles.activityTime}>
                      {activity.time} • {activity.date}
                    </Text>
                  </View>
                </View>
                <View style={styles.activityRight}>
                  <Text style={styles.activityAmount}>€{activity.amount.toFixed(2)}</Text>
                  <Text 
                    style={[
                      styles.activityStatus, 
                      activity.status === 'Completed' ? styles.statusCompleted : styles.statusCanceled
                    ]}
                  >
                    {activity.status}
                  </Text>
                </View>
              </View>
            ))}
            
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Activity</Text>
              <ChevronRight size={18} color={Colors.accent} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: Colors.card,
    borderRadius: 30,
    position: 'relative',
    height: 50,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    zIndex: 1,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  activeTabText: {
    color: Colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  tabIndicator: {
    position: 'absolute',
    width: width / 2 - 25,
    height: 40,
    borderRadius: 25,
    backgroundColor: Colors.surfaceDark,
    top: 5,
    left: 5,
  },
  scrollView: {
    flex: 1,
  },
  // Earnings Tab Styles
  earningsContainer: {
    padding: 20,
  },
  totalEarningsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  totalEarningsLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  totalEarningsAmount: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  earningsChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsChangeText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.online,
    marginLeft: 5,
  },
  earningsChartContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  chartBarContainer: {
    alignItems: 'center',
    width: (width - 80) / 7,
  },
  chartBarLabelContainer: {
    alignItems: 'center',
    height: 130,
    justifyContent: 'flex-end',
  },
  chartValue: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  chartBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  chartLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    marginTop: 8,
  },
  earningsSummaryContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryItem: {
    width: '48%',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textPrimary,
  },
  // Activity Tab Styles
  activityContainer: {
    padding: 20,
  },
  activityStatsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
  },
  statTextContainer: {
    marginLeft: 10,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.divider,
  },
  activityItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityDetails: {
    marginLeft: 10,
  },
  activityType: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  activityStatus: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  statusCompleted: {
    color: Colors.online,
  },
  statusCanceled: {
    color: Colors.offline,
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  viewAllText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.accent,
    marginRight: 5,
  },
});