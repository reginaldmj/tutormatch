import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useBookings } from '../../src/context/BookingContext';
import { supabase } from '../../src/lib/supabase';

export default function ProfileScreen() {
  // Holds the user's profile row from Supabase
  const [profile, setProfile] = useState<any>(null);

  // Pull real booking data from BookingContext
  const { bookings } = useBookings();

  // Count unique tutors for chat/conversation stats
  const uniqueTutors = bookings.filter(
    (booking, index, self) =>
      index === self.findIndex((item) => item.tutorId === booking.tutorId),
  );

  // useFocusEffect runs every time the Profile tab becomes active.
  // This is better than useEffect here because profile data may change
  // after returning from the Edit Profile screen.
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  async function loadProfile() {
    // Get the currently logged-in Supabase user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Load that user's profile row
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('PROFILE DATA:', data);
    console.log('PROFILE ERROR:', error);

    if (data) {
      setProfile(data);
    }
  }

  async function handleLogout() {
    // End Supabase session
    await supabase.auth.signOut();

    // Send user back to login page
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
        {/* User name from Supabase */}
        <Text style={{ fontSize: 22, fontWeight: '700' }}>
          {profile.full_name}
        </Text>

        {/* User role from Supabase */}
        <Text style={{ marginTop: 6, color: '#666' }}>
          {profile.role === 'student' ? 'Student' : 'Tutor'}
        </Text>

        <View
          style={{
            height: 1,
            backgroundColor: '#eee',
            marginVertical: 16,
          }}
        />

        {/* Stats from app state */}
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