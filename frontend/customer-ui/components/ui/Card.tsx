import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'outline' | 'filled';
  touchable?: boolean;
}

export function Card({
  children,
  style,
  variant = 'default',
  touchable = true,
  ...props
}: CardProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const cardStyles = [
    styles.card,
    {
      backgroundColor: 
        variant === 'default' 
          ? colors.card
          : variant === 'filled' 
            ? colors.secondary 
            : 'transparent',
      borderColor: variant === 'outline' ? colors.border : 'transparent',
      borderWidth: variant === 'outline' ? 1 : 0,
    },
    style,
  ];

  if (touchable) {
    return (
      <TouchableOpacity style={cardStyles} activeOpacity={0.7} {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});