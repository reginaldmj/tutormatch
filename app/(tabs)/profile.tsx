import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';
import { supabase } from '../../src/lib/supabase';
import { Profile } from '../../src/types/profile';

export default function ProfileScreen() {
  // Stores the current user's profile row from Supabase.
  const [profile, setProfile] = useState<Profile | null>(null);

  // BookingContext provides booking data used for profile stats.
  const { bookings } = useBookings();

  // Count unique tutors from bookings to estimate active conversations.
  const uniqueTutors = bookings.filter(
    (booking, index, self) =>
      index === self.findIndex((item) => item.tutorId === booking.tutorId),
  );

  // Reload profile whenever the Profile tab becomes active.
  // This is useful after returning from Edit Profile.
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  async function loadProfile() {
    // Get the currently logged-in Supabase user.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Load the profile row connected to this auth user.
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.log('PROFILE ERROR:', error);
      return;
    }

    if (data) {
      setProfile(data);
    }
  }

  async function handleLogout() {
    // End the Supabase auth session.
    await supabase.auth.signOut();

    // Send the user back to login.
    router.replace('/auth/login' as any);
  }

  // Shared loading state while profile is being fetched.
  if (!profile) {
    return <ScreenState message="Loading profile..." />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Page title */}
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        Profile
      </Text>

      {/* Profile summary card */}
      <View
        style={{
          padding: 20,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 16,
          backgroundColor: '#fafafa',
        }}
      >
        {/* User full name from Supabase profiles table */}
        <Text style={{ fontSize: 22, fontWeight: '700' }}>
          {profile.full_name}
        </Text>

        {/* User role from Supabase profiles table */}
        <Text style={{ marginTop: 6, color: '#666' }}>
          {profile.role === 'student' ? 'Student' : 'Tutor'}
        </Text>

        {/* Visual divider */}
        <View
          style={{
            height: 1,
            backgroundColor: '#eee',
            marginVertical: 16,
          }}
        />

        {/* Profile stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              {bookings.length}
            </Text>
            <Text style={{ color: '#666' }}>Bookings</Text>
          </View>

          <View>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              {uniqueTutors.length}
            </Text>
            <Text style={{ color: '#666' }}>Chats</Text>
          </View>
        </View>
      </View>

      {/* Navigate to edit profile screen */}
      <Pressable
        onPress={() => router.push('/profile/edit' as any)}
        style={{
          marginTop: 24,
          backgroundColor: '#eee',
          padding: 14,
          borderRadius: 12,
        }}
      >
        <Text style={{ textAlign: 'center', fontWeight: '600' }}>
          Edit Profile
        </Text>
      </Pressable>

      {/* Logout button */}
      <Pressable
        onPress={handleLogout}
        style={{
          marginTop: 12,
          backgroundColor: 'black',
          padding: 14,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          Log Out
        </Text>
      </Pressable>
    </View>
  );
}