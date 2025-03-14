import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
  SafeAreaView
} from 'react-native';
// Import our improved WebView component
import WebViewComponent from '../../components/WebViewComponent';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StatusIndicator } from '../../components/StatusIndicator';
import api, { 
  getConnectAccount, 
  createConnectAccount, 
  getOnboardingLink,
  getDashboardLink,
  getDriverSubscription,
  getDriverEarnings,
  getCashFeePaymentLink
} from '../../services/api';
import Colors from '../../constants/Colors';

type EarningPeriod = 'week' | 'month' | 'all';

export default function EarningsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [account, setAccount] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<EarningPeriod>('week');
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalOrders: 0,
    totalTips: 0,
    pendingFees: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get Connect account status
      try {
        const { data: accountData } = await getConnectAccount();
        setAccount(accountData);
      } catch (error) {
        console.log('No Connect account yet or error fetching', error);
        setAccount(null);
      }
      
      // Get subscription status
      try {
        const { data: subscriptionData } = await getDriverSubscription();
        setSubscription(subscriptionData);
      } catch (error) {
        console.log('No subscription found or error fetching', error);
        setSubscription(null);
      }
      
      // Get earnings
      const { data: earningsData } = await getDriverEarnings(selectedPeriod);
      setEarnings(earningsData?.transactions || []);
      
      // Calculate stats
      if (earningsData) {
        setStats({
          totalEarnings: earningsData.totalEarnings || 0,
          totalOrders: earningsData.totalOrders || 0,
          totalTips: earningsData.totalTips || 0,
          pendingFees: earningsData.pendingFees || 0
        });
      }
    } catch (error) {
      console.error('Error fetching earnings data', error);
      Alert.alert('Error', 'Failed to load earnings data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [selectedPeriod]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleStartOnboarding = async () => {
    try {
      setIsLoading(true);
      
      // Create account if needed
      if (!account) {
        const { data: newAccount } = await createConnectAccount();
        setAccount(newAccount);
      }
      
      // Generate onboarding link
      const { data: link } = await getOnboardingLink('maxmoveapp://earnings');
      setOnboardingUrl(link.url);
      setShowWebView(true);
    } catch (error) {
      console.error('Error starting onboarding', error);
      Alert.alert('Error', 'Failed to start account setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDashboard = async () => {
    try {
      setIsLoading(true);
      const { data: link } = await getDashboardLink();
      Linking.openURL(link.url);
    } catch (error) {
      console.error('Error getting dashboard link', error);
      Alert.alert('Error', 'Failed to get Stripe dashboard link');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayFees = async (transactionId: string) => {
    try {
      setIsLoading(true);
      const { data: link } = await getCashFeePaymentLink(transactionId);
      Linking.openURL(link.url);
    } catch (error) {
      console.error('Error getting fee payment link', error);
      Alert.alert('Error', 'Failed to get payment link');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle WebView navigation state changes
  const handleNavigationStateChange = (navState: any) => {
    // If we're back at our app URL, close the WebView
    if (navState.url.startsWith('maxmoveapp://')) {
      setShowWebView(false);
      fetchData(); // Refresh data
    }
  };

  // Render WebView for onboarding
  if (showWebView && onboardingUrl) {
    return (
      <WebViewComponent
        source={{ uri: onboardingUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading account setup...</Text>
          </View>
        )}
      />
    );
  }

  // Format currency amount
  const formatCurrency = (amount: number) => {
    return `€${(amount / 100).toFixed(2)}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Earnings</Text>
        
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            {/* Account Status Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Status</Text>
              
              {account?.payouts_enabled ? (
                <View style={styles.accountInfo}>
                  <View style={styles.statusRow}>
                    <Text style={styles.accountLabel}>Status:</Text>
                    <StatusIndicator status="active" label="Verified" />
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.dashboardButton}
                    onPress={handleViewDashboard}
                  >
                    <Text style={styles.dashboardButtonText}>
                      View Stripe Dashboard
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.setupCard}>
                  <Text style={styles.setupText}>
                    Complete your account setup to receive payments directly to your bank account
                  </Text>
                  <TouchableOpacity 
                    style={styles.setupButton}
                    onPress={handleStartOnboarding}
                  >
                    <Text style={styles.setupButtonText}>
                      Complete Account Setup
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            {/* Subscription Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Driver Plan</Text>
              
              <View style={styles.planCard}>
                <Text style={styles.planTitle}>
                  {subscription?.is_premium ? 'Premium Plan' : 'Standard Plan'}
                </Text>
                
                <View style={styles.planDetails}>
                  <Text style={styles.planDetail}>
                    Platform Fee: {subscription?.is_premium ? '5%' : '15%'}
                  </Text>
                  
                  {subscription?.is_premium && (
                    <Text style={styles.planDetail}>
                      Renewal: {new Date(subscription.current_period_end).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.planButton,
                    subscription?.is_premium ? styles.cancelButton : styles.upgradeButton
                  ]}
                  onPress={() => {
                    // Navigate to subscription screen
                    // This will be implemented separately
                    Alert.alert(
                      subscription?.is_premium ? 'Cancel Subscription' : 'Upgrade to Premium',
                      subscription?.is_premium 
                        ? 'Are you sure you want to cancel your premium subscription?' 
                        : 'Upgrade to Premium for €99/month to reduce your platform fee from 15% to 5%'
                    );
                  }}
                >
                  <Text style={styles.planButtonText}>
                    {subscription?.is_premium ? 'Cancel Premium' : 'Upgrade to Premium €99/month'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Earnings Stats Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Earnings Summary</Text>
              
              <View style={styles.periodSelector}>
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    selectedPeriod === 'week' && styles.activePeriod
                  ]}
                  onPress={() => setSelectedPeriod('week')}
                >
                  <Text style={selectedPeriod === 'week' ? styles.activePeriodText : styles.periodButtonText}>
                    This Week
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    selectedPeriod === 'month' && styles.activePeriod
                  ]}
                  onPress={() => setSelectedPeriod('month')}
                >
                  <Text style={selectedPeriod === 'month' ? styles.activePeriodText : styles.periodButtonText}>
                    This Month
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    selectedPeriod === 'all' && styles.activePeriod
                  ]}
                  onPress={() => setSelectedPeriod('all')}
                >
                  <Text style={selectedPeriod === 'all' ? styles.activePeriodText : styles.periodButtonText}>
                    All Time
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statAmount}>
                    {formatCurrency(stats.totalEarnings)}
                  </Text>
                  <Text style={styles.statLabel}>Total Earnings</Text>
                </View>
                
                <View style={styles.statBox}>
                  <Text style={styles.statAmount}>{stats.totalOrders}</Text>
                  <Text style={styles.statLabel}>Deliveries</Text>
                </View>
                
                <View style={styles.statBox}>
                  <Text style={styles.statAmount}>
                    {formatCurrency(stats.totalTips)}
                  </Text>
                  <Text style={styles.statLabel}>Tips</Text>
                </View>
              </View>
              
              {stats.pendingFees > 0 && (
                <View style={styles.warningCard}>
                  <Text style={styles.warningText}>
                    You have {formatCurrency(stats.pendingFees)} in unpaid platform fees from cash payments
                  </Text>
                  <TouchableOpacity 
                    style={styles.warningButton}
                    onPress={() => {
                      // This would navigate to a screen showing all pending fees
                      Alert.alert('Pay Fees', 'You will be directed to a payment page to pay your platform fees');
                    }}
                  >
                    <Text style={styles.warningButtonText}>View and Pay Fees</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            {/* Recent Transactions Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              
              {earnings.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No transactions yet</Text>
                </View>
              ) : (
                earnings.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View style={styles.transactionHeader}>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </Text>
                      <Text style={styles.transactionId}>
                        Order #{transaction.order_id.substring(0, 8)}
                      </Text>
                    </View>
                    
                    <View style={styles.transactionDetails}>
                      <View style={styles.transactionRow}>
                        <Text style={styles.transactionLabel}>Payment Method:</Text>
                        <Text style={styles.transactionValue}>
                          {transaction.payment_method === 'cash' ? 'Cash' : 'Card'}
                        </Text>
                      </View>
                      
                      <View style={styles.transactionRow}>
                        <Text style={styles.transactionLabel}>Delivery Amount:</Text>
                        <Text style={styles.transactionValue}>
                          {formatCurrency(transaction.amount)}
                        </Text>
                      </View>
                      
                      <View style={styles.transactionRow}>
                        <Text style={styles.transactionLabel}>Platform Fee:</Text>
                        <Text style={styles.feeValue}>
                          -{formatCurrency(transaction.platform_fee)}
                        </Text>
                      </View>
                      
                      <View style={styles.transactionRow}>
                        <Text style={styles.transactionLabel}>Service Fee ({transaction.is_premium ? '5%' : '15%'}):</Text>
                        <Text style={styles.feeValue}>
                          -{formatCurrency(transaction.driver_fee)}
                        </Text>
                      </View>
                      
                      {transaction.tip_amount > 0 && (
                        <View style={styles.transactionRow}>
                          <Text style={styles.transactionLabel}>Customer Tip:</Text>
                          <Text style={styles.tipValue}>
                            +{formatCurrency(transaction.tip_amount)}
                          </Text>
                        </View>
                      )}
                      
                      <View style={[styles.transactionRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Your Earnings:</Text>
                        <Text style={styles.totalValue}>
                          {formatCurrency(
                            transaction.amount - 
                            transaction.platform_fee - 
                            transaction.driver_fee + 
                            transaction.tip_amount
                          )}
                        </Text>
                      </View>
                    </View>
                    
                    {/* For cash payments where platform fee is not paid */}
                    {transaction.is_cash && !transaction.cash_fee_paid && (
                      <View style={styles.feeAlert}>
                        <Text style={styles.feeAlertText}>
                          Platform fees due: {formatCurrency(transaction.platform_fee + transaction.driver_fee)}
                        </Text>
                        <TouchableOpacity
                          style={styles.payFeeButton}
                          onPress={() => handlePayFees(transaction.id)}
                        >
                          <Text style={styles.payFeeButtonText}>Pay Now</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollView: {
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  // Account status styles
  accountInfo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  dashboardButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dashboardButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  setupCard: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  setupText: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 16,
    textAlign: 'center',
  },
  setupButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  setupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Subscription plan styles
  planCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  planDetails: {
    marginBottom: 16,
  },
  planDetail: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 4,
  },
  planButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  planButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Period selector styles
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  periodButtonText: {
    color: '#495057',
    fontSize: 14,
  },
  activePeriod: {
    backgroundColor: Colors.primary,
  },
  activePeriodText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Stats styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 1,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  // Warning card for pending fees
  warningCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 12,
  },
  warningButton: {
    backgroundColor: '#ffc107',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  warningButtonText: {
    color: '#212529',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Transaction styles
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
    overflow: 'hidden',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  transactionDate: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  transactionId: {
    fontSize: 14,
    color: '#6c757d',
  },
  transactionDetails: {
    padding: 12,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  transactionLabel: {
    fontSize: 14,
    color: '#495057',
  },
  transactionValue: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '500',
  },
  feeValue: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '500',
  },
  tipValue: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  // Fee alert for unpaid cash fees
  feeAlert: {
    backgroundColor: '#f8d7da',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5c6cb',
  },
  feeAlertText: {
    fontSize: 14,
    color: '#721c24',
    marginBottom: 8,
  },
  payFeeButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  payFeeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Empty state
  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
});