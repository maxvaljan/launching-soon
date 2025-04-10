import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { User, Briefcase } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

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
        <View
          style={[styles.iconContainer, { backgroundColor: colors.accent }]}
        >
          {title === 'Individual' ? (
            <User size={40} color={colors.primary} />
          ) : (
            <Briefcase size={40} color={colors.primary} />
          )}
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.primary }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.textLight }]}>
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
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});
