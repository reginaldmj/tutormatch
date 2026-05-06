import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useBookings } from '../../src/context/BookingContext';
import { supabase } from '../../src/lib/supabase';
import { Profile } from '../../src/types/profile';

export default function ProfileScreen() {
  // Stores the current user's profile row from Supabase
  const [profile, setProfile] = useState<Profile | null>(null);

  // Pull booking data from BookingContext for profile stats
  const { bookings } = useBookings();

  // Count unique tutors to estimate active conversations
  const uniqueTutors = bookings.filter(
    (booking, index, self) =>
      index === self.findIndex((item) => item.tutorId === booking.tutorId),
  );

  // Reload profile every time this tab/screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  async function loadProfile() {
    // Get currently logged-in Supabase user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Fetch profile row connected to auth user id
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
    // End Supabase session
    await supabase.auth.signOut();

    // Return user to login page
    router.replace('/auth/login' as any);
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Loading profile...</Text>
      </View>
    );
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
        {/* User full name from Supabase */}
        <Text style={{ fontSize: 22, fontWeight: '700' }}>
          {profile.full_name}
        </Text>

        {/* User role from Supabase */}
        <Text style={{ marginTop: 6, color: '#666' }}>
          {profile.role === 'student' ? 'Student' : 'Tutor'}
        </Text>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: '#eee',
            marginVertical: 16,
          }}
        />

        {/* Stats */}
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

      {/* Edit profile button */}
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