import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { supabase } from '../../src/lib/supabase';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

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

      <View
        style={{
          padding: 16,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '600' }}>
          {profile.full_name}
        </Text>

        <Text style={{ marginTop: 6 }}>
          Role: {profile.role}
        </Text>

        <Text style={{ marginTop: 6 }}>
          User ID: {profile.id}
        </Text>
      </View>
    </View>
  );
}