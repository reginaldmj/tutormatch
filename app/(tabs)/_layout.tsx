import { Tabs } from 'expo-router';
import React from 'react';

import { useChat } from '../../src/context/ChatContext';

export default function TabLayout() {
  // Count unread messages for badge display.
  const { unreadCount } = useChat();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => '🏠',
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: () => '📅',
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: () => '💬',

          // Show badge only when there are unread messages.
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => '👤',
        }}
      />
    </Tabs>
  );
}