import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card } from './ui/Card';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { User, Briefcase } from 'lucide-react-native';

interface AccountTypeCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

export function AccountTypeCard({
  title,
  description,
  onPress,
}: AccountTypeCardProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {title === "Individual" ? (
            <User size={40} color="#0e1424" />
          ) : (
            <Briefcase size={40} color="#0e1424" />
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>
            {description}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#f9f2e4',
    borderRadius: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0e1424',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
});