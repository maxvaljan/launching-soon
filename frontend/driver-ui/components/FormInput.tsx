import React from 'react';
import { StyleSheet, Text, TextInput, View, TextInputProps, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export default function FormInput({
  label,
  error,
  containerStyle,
  required = false,
  ...props
}: FormInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#999"
        autoCapitalize="none"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  required: {
    color: Colors.offline,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    color: Colors.inputText,
  },
  inputError: {
    borderColor: Colors.offline,
  },
  errorText: {
    color: Colors.offline,
    fontSize: 12,
    marginTop: 4,
  },
});