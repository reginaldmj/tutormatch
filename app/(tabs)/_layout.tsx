import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      {/* Home tab: browse tutors, search, filter, and open tutor profiles */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      {/* Bookings tab: view confirmed/cancelled tutoring sessions */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
        }}
      />

      {/* Messages tab: view conversations unlocked by booked tutors */}
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
        }}
      />

      {/* Profile tab: view/edit profile, see stats, and log out */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}