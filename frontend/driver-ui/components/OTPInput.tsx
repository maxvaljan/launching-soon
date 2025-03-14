import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Colors from '@/constants/Colors';

interface OTPInputProps {
  codeCount: number;
  onCodeFilled: (code: string) => void;
}

export default function OTPInput({ codeCount, onCodeFilled }: OTPInputProps) {
  const [code, setCode] = useState<string[]>(Array(codeCount).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);

  const focusInput = (index: number) => {
    if (inputs.current[index]) {
      inputs.current[index]?.focus();
    }
  };

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input if current input is filled
    if (text.length === 1 && index < codeCount - 1) {
      focusInput(index + 1);
    }

    // Call onCodeFilled when all inputs are filled
    if (newCode.every(digit => digit !== '') && newCode.join('').length === codeCount) {
      onCodeFilled(newCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {Array(codeCount)
          .fill(0)
          .map((_, index) => (
            <TextInput
              key={index}
              ref={ref => {
                inputs.current[index] = ref;
              }}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={1}
              value={code[index]}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              autoFocus={index === 0}
              selectionColor={Colors.accent}
            />
          ))}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  input: {
    height: 60,
    width: 60,
    borderRadius: 10,
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.inputText,
  },
});