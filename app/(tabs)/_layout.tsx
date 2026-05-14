import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';

import { AppTheme } from '@/constants/theme';

import { useChat } from '../../src/context/ChatContext';

export default function TabLayout() {
  const { unreadCount } = useChat();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AppTheme.colors.primary,
        tabBarInactiveTintColor: AppTheme.colors.subtle,
        tabBarLabelStyle: {
          fontSize: AppTheme.typography.caption,
          fontWeight: '700',
        },
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: AppTheme.colors.border,
          backgroundColor: AppTheme.colors.surface,
        },
        tabBarBadgeStyle: {
          backgroundColor: AppTheme.colors.danger,
          color: AppTheme.colors.white,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} name="home" size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} name="event-note" size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} name="chat-bubble-outline" size={size} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} name="person-outline" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
