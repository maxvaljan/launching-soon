import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CardField, useStripe, CardFieldInput } from '@stripe/stripe-react-native';
import api from '../services/api';
import Button from './ui/Button';
import Colors from '../constants/Colors';

interface PaymentSectionProps {
  order: {
    id: string;
    amount: number;
  };
  onPaymentComplete: (result: {
    status: 'success' | 'failed';
    paymentMethod: 'card' | 'cash';
    paymentIntentId?: string;
  }) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ order, onPaymentComplete }) => {
  const { confirmPayment, createPaymentMethod } = useStripe();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isCashPayment, setIsCashPayment] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const tipOptions = [0, 100, 200, 500]; // in cents (0, €1, €2, €5)

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/payment/methods');
      setPaymentMethods(data || []);
      if (data && data.length > 0) {
        setSelectedPaymentMethod(data[0].stripe_payment_method_id);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods', error);
      Alert.alert('Error', 'Unable to load your payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card information');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create payment method with Stripe
      const { paymentMethod, error } = await createPaymentMethod({
        type: 'Card',
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      // Save payment method to backend
      await api.post('/payment/methods', {
        paymentMethodId: paymentMethod.id,
      });

      // Update UI
      setIsAddingCard(false);
      await fetchPaymentMethods();
      setSelectedPaymentMethod(paymentMethod.id);
    } catch (error) {
      console.error('Error adding payment method:', error);
      Alert.alert('Error', 'Failed to add payment method');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      if (isCashPayment) {
        // Record cash payment
        await api.post('/payment/cash-payments', {
          orderId: order.id,
          tipAmount,
        });
        
        onPaymentComplete({
          status: 'success',
          paymentMethod: 'cash',
        });
        return;
      }

      // Make sure we have a payment method
      if (!selectedPaymentMethod && !cardDetails?.complete) {
        Alert.alert('Error', 'Please select or add a payment method');
        setIsProcessing(false);
        return;
      }

      // Create payment intent
      let paymentMethodId = selectedPaymentMethod;
      
      // If user is adding a new card while paying
      if (!paymentMethodId && cardDetails?.complete) {
        const { paymentMethod, error: pmError } = await createPaymentMethod({
          type: 'Card',
        });
        
        if (pmError) {
          Alert.alert('Error', pmError.message);
          setIsProcessing(false);
          return;
        }
        
        paymentMethodId = paymentMethod.id;
        
        // Save this card for future use
        await api.post('/payment/methods', {
          paymentMethodId: paymentMethod.id,
        });
      }

      // Create payment intent
      const { data: paymentIntent } = await api.post('/payment/intents', {
        orderId: order.id,
        paymentMethodId,
        tipAmount,
      });

      // Confirm payment intent
      const { error, paymentIntent: confirmedIntent } = await confirmPayment(
        paymentIntent.client_secret, 
        {
          paymentMethodId,
        }
      );

      if (error) {
        Alert.alert('Payment Failed', error.message);
        setIsProcessing(false);
        return;
      }

      onPaymentComplete({
        status: 'success',
        paymentMethod: 'card',
        paymentIntentId: confirmedIntent.id,
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Payment processing failed');
      setIsProcessing(false);
    }
  };

  const getTotal = () => {
    // Order amount + €1 platform fee + tip
    return order.amount + 100 + tipAmount;
  };

  // Handle card details change
  const handleCardChange = (cardDetails: CardFieldInput.Details) => {
    setCardDetails(cardDetails);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading payment options...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            !isCashPayment && styles.selectedPaymentOption
          ]}
          onPress={() => setIsCashPayment(false)}
        >
          <Text style={!isCashPayment ? styles.selectedPaymentOptionText : styles.paymentOptionText}>
            Card Payment
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.paymentOption,
            isCashPayment && styles.selectedPaymentOption
          ]}
          onPress={() => setIsCashPayment(true)}
        >
          <Text style={isCashPayment ? styles.selectedPaymentOptionText : styles.paymentOptionText}>
            Cash Payment
          </Text>
        </TouchableOpacity>
      </View>
      
      {!isCashPayment && (
        <>
          {paymentMethods.length > 0 && (
            <View style={styles.savedCards}>
              <Text style={styles.sectionTitle}>Saved Cards</Text>
              
              {paymentMethods.map(method => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.savedCard,
                    selectedPaymentMethod === method.stripe_payment_method_id && styles.selectedCard
                  ]}
                  onPress={() => setSelectedPaymentMethod(method.stripe_payment_method_id)}
                >
                  <Text style={styles.cardText}>•••• {method.last_four}</Text>
                  {selectedPaymentMethod === method.stripe_payment_method_id && (
                    <Text style={styles.selectedText}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {isAddingCard ? (
            <View style={styles.addCardForm}>
              <Text style={styles.sectionTitle}>Enter Card Details</Text>
              
              <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={styles.cardFieldStyle}
                style={styles.cardField}
                onCardChange={handleCardChange}
              />
              
              <View style={styles.cardButtonsRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsAddingCard(false)}
                  disabled={isProcessing}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <Button
                  onPress={handleAddPaymentMethod}
                  disabled={!cardDetails?.complete || isProcessing}
                  style={styles.addCardButton}
                >
                  {isProcessing ? 'Adding...' : 'Add Card'}
                </Button>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={() => setIsAddingCard(true)}
            >
              <Text style={styles.addCardButtonText}>+ Add Payment Method</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      
      <View style={styles.tipSection}>
        <Text style={styles.sectionTitle}>Add a tip for your driver</Text>
        <View style={styles.tipOptions}>
          {tipOptions.map(amount => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.tipOption,
                tipAmount === amount && styles.selectedTipOption
              ]}
              onPress={() => setTipAmount(amount)}
            >
              <Text style={tipAmount === amount ? styles.selectedTipText : styles.tipText}>
                {amount === 0 ? 'No Tip' : `€${(amount / 100).toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.summary}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee:</Text>
          <Text style={styles.summaryValue}>€{(order.amount / 100).toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Platform Fee:</Text>
          <Text style={styles.summaryValue}>€1.00</Text>
        </View>
        
        {tipAmount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Driver Tip:</Text>
            <Text style={styles.summaryValue}>€{(tipAmount / 100).toFixed(2)}</Text>
          </View>
        )}
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>
            €{(getTotal() / 100).toFixed(2)}
          </Text>
        </View>
      </View>
      
      <Button
        onPress={handlePayment}
        disabled={isProcessing || (!isCashPayment && !selectedPaymentMethod && !cardDetails?.complete)}
        style={styles.payButton}
      >
        {isProcessing
          ? 'Processing...'
          : isCashPayment
            ? 'Confirm Cash Payment'
            : `Pay €${(getTotal() / 100).toFixed(2)}`}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  // Payment options
  paymentOptions: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  paymentOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  paymentOptionText: {
    color: '#495057',
    fontWeight: '500',
  },
  selectedPaymentOption: {
    backgroundColor: Colors.primary,
  },
  selectedPaymentOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Saved cards
  savedCards: {
    marginBottom: 16,
  },
  savedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: '#e6f7ff',
  },
  cardText: {
    fontSize: 16,
    color: '#212529',
  },
  selectedText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  // Add card
  addCardButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 16,
  },
  addCardButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  // Card field
  addCardForm: {
    marginBottom: 16,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 8,
  },
  cardFieldStyle: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  cardButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#495057',
    fontWeight: '600',
  },
  // Tip section
  tipSection: {
    marginBottom: 16,
  },
  tipOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tipText: {
    color: '#495057',
  },
  selectedTipOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectedTipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Summary section
  summary: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#495057',
  },
  summaryValue: {
    fontSize: 15,
    color: '#212529',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  // Pay button
  payButton: {
    height: 50,
  },
});

export default PaymentSection;