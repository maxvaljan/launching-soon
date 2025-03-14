import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Shield } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import FormInput from '@/components/FormInput';
import AuthButton from '@/components/AuthButton';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [countryCode, setCountryCode] = useState('+49');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = () => {
    // In a real app, validate inputs and submit to API
    router.push('/(auth)/verify');
  };

  const handleSelectCity = () => {
    // In a real app, open city selection modal
    setCity('Berlin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft color={Colors.textPrimary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Register as Driver</Text>
        </View>

        <View style={styles.formCard}>
          <FormInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="first name"
            required
          />

          <FormInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="last name"
          />

          <View style={styles.phoneContainer}>
            <TouchableOpacity style={styles.countryCodeContainer}>
              <Text style={styles.countryCode}>{countryCode}</Text>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.phoneInputContainer}>
              <FormInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="phone number"
                keyboardType="phone-pad"
                required
                containerStyle={styles.phoneInput}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.citySelector} onPress={handleSelectCity}>
            <FormInput
              value={city}
              onChangeText={setCity}
              placeholder="city"
              editable={false}
              required
            />
            <ChevronRight 
              style={styles.citySelectorIcon} 
              size={20} 
              color={Colors.textSecondary} 
            />
          </TouchableOpacity>

          <FormInput
            value={referralCode}
            onChangeText={setReferralCode}
            placeholder="referral code (optional)"
          />

          <View style={styles.securityNote}>
            <Shield size={18} color={Colors.accent} style={styles.securityIcon} />
            <Text style={styles.securityText}>
              Your information is secure and will only be used for verification purposes.
            </Text>
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.checkbox} 
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View style={[
                styles.checkboxInner, 
                termsAccepted && styles.checkboxChecked
              ]} />
            </TouchableOpacity>
            
            <Text style={styles.termsText}>
              By proceeding, I agree that MAXMOVE can collect, use and disclose the information provided by me in accordance with the{' '}
              <Text style={styles.termsLink}>Privacy Notice</Text> and I fully comply with{' '}
              <Text style={styles.termsLink}>Terms & Conditions</Text> which I have read and understand.
            </Text>
          </View>

          <AuthButton
            title="Next"
            onPress={handleSubmit}
            variant="primary"
            style={[styles.submitButton, (!termsAccepted || !firstName || !phoneNumber || !city) && styles.disabledButton]}
            textStyle={styles.submitButtonText}
            disabled={!termsAccepted || !firstName || !phoneNumber || !city}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formHeader: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  phoneContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    marginRight: 10,
    height: 56,
  },
  countryCode: {
    fontSize: 16,
    color: Colors.inputText,
    marginRight: 8,
  },
  phoneInputContainer: {
    flex: 1,
  },
  phoneInput: {
    flex: 1,
  },
  citySelector: {
    position: 'relative',
  },
  citySelectorIcon: {
    position: 'absolute',
    right: 16,
    top: 56,
  },
  securityNote: {
    flexDirection: 'row',
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  securityIcon: {
    marginRight: 10,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  termsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  termsLink: {
    color: Colors.accent,
    textDecorationLine: 'underline',
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonText: {
    fontFamily: 'Inter_600SemiBold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});