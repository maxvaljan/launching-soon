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

  // Update the styling to have grey border normally and blue border when selected
  const cardStyle: ViewStyle = {
    ...styles.card,
    borderColor: selected
      ? colors.blue // blue border when selected
      : colorScheme === 'dark'
        ? 'rgba(237, 237, 237, 0.3)'
        : '#e0e0e0', // grey border
    borderWidth: selected ? 2 : 1, // slightly thicker border when selected
    backgroundColor: 'transparent', // always transparent background
    ...(style || {}),
  };

  // Text colors remain the same regardless of selection
  const titleColor = colors.text;
  const descriptionColor = colors.grayText;

  return (
    <Card style={cardStyle} variant="outline" onPress={onPress}>
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
    shadowOpacity: 0,
    elevation: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
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
