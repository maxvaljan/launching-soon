import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

// Sample data for chats
const chats = [
  {
    id: '1',
    name: 'Thomas Wagner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
    lastMessage: "I'll be there in 5 minutes",
    time: '14:32',
    unread: 2,
    isDriver: true,
  },
  {
    id: '2',
    name: 'MaxMove Support',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
    lastMessage: 'How can we help you today?',
    time: '11:15',
    unread: 0,
    isDriver: false,
  },
  {
    id: '3',
    name: 'Julia Schmidt',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Please deliver to the back entrance',
    time: 'Yesterday',
    unread: 0,
    isDriver: true,
  },
  {
    id: '4',
    name: 'Markus Müller',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Thank you for the quick delivery!',
    time: 'Yesterday',
    unread: 0,
    isDriver: true,
  },
  {
    id: '5',
    name: 'Billing Department',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Your invoice #45678 has been processed',
    time: 'Jun 25',
    unread: 0,
    isDriver: false,
  },
];

export default function MessagesScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        
        <Input
          placeholder="Search messages..."
          leftIcon={<Search size={20} color={colors.grayText} />}
          containerStyle={styles.searchContainer}
        />
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.grayText }]}>
              No messages yet
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chatItem,
              {
                backgroundColor: colorScheme === 'dark' ? colors.card : colors.background,
              },
            ]}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              {item.isDriver && (
                <View style={[styles.driverBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.driverText}>D</Text>
                </View>
              )}
            </View>
            
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={[styles.chatName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.chatTime, { color: colors.grayText }]}>
                  {item.time}
                </Text>
              </View>
              
              <View style={styles.chatFooter}>
                <Text 
                  style={[
                    styles.lastMessage, 
                    { 
                      color: item.unread > 0 ? colors.text : colors.grayText,
                      fontFamily: item.unread > 0 ? 'Inter-SemiBold' : 'Inter-Regular',
                    }
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                
                {item.unread > 0 && (
                  <View style={[styles.unreadBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  driverBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  chatTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
});