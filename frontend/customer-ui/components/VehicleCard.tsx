import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Card } from './ui/Card';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

interface VehicleCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  dimensions?: string;
  maxWeight?: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function VehicleCard({
  icon,
  title,
  description,
  dimensions,
  maxWeight,
  selected = false,
  onPress,
  style,
}: VehicleCardProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  // Update the styling to match web UI with navy background when selected
  const cardStyle: ViewStyle = {
    ...styles.card,
    ...(selected
      ? {
          backgroundColor: '#002147', // navy background when selected
          borderColor: '#002147',
        }
      : {
          borderColor: colors.border,
          backgroundColor: colors.card,
        }),
    ...(style || {}),
  };

  // Text colors based on selection state
  const titleColor = selected ? '#f1ebdb' : colors.text; // creme color when selected
  const descriptionColor = selected
    ? 'rgba(241, 235, 219, 0.8)'
    : colors.grayText; // semi-transparent creme when selected

  return (
    <Card
      style={cardStyle}
      variant={selected ? 'outline' : 'default'}
      onPress={onPress}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          {description && (
            <Text style={[styles.description, { color: descriptionColor }]}>
              {description}
            </Text>
          )}
          {/* Display additional information if available */}
          <View style={styles.specsContainer}>
            {dimensions && (
              <Text style={[styles.specs, { color: descriptionColor }]}>
                {dimensions}
              </Text>
            )}
            {maxWeight && (
              <Text style={[styles.specs, { color: descriptionColor }]}>
                {maxWeight}
              </Text>
            )}
          </View>
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
  specsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  specs: {
    fontSize: 13,
    marginRight: 10,
    opacity: 0.9,
  },
});
