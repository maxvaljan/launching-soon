import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Card } from './ui/Card';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

interface VehicleCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function VehicleCard({
  icon,
  title,
  description,
  selected = false,
  onPress,
  style,
}: VehicleCardProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <Card
      style={[
        styles.card,
        { borderColor: selected ? colors.accent : colors.border },
        style
      ]}
      variant={selected ? 'outline' : 'default'}
      onPress={onPress}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {description && (
            <Text style={[styles.description, { color: colors.grayText }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderWidth: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
});