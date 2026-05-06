import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { supabase } from '../../src/lib/supabase';
import { Profile } from '../../src/types/profile';

export default function EditProfileScreen() {
  // Form state
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Profile['role']>('student');

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load profile when screen opens
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.log('EDIT PROFILE ERROR:', error);
      setLoading(false);
      return;
    }

    if (data) {
      setFullName(data.full_name ?? '');
      setRole(data.role ?? 'student');
    }

    setLoading(false);
  }

  async function handleSave() {
    if (!fullName.trim()) {
      Alert.alert('Missing name', 'Please enter your full name.');
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        role,
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      Alert.alert('Update failed', error.message);
      return;
    }

    Alert.alert('Profile updated', 'Your profile was saved.');
    router.back();
  }

  const saveDisabled = saving || !fullName.trim();

  if (loading) {
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
        Edit Profile
      </Text>

      {/* Full name field */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Full Name</Text>

      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full name"
        editable={!saving}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
        }}
      />

      {/* Role selector */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Role</Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
        {(['student', 'tutor'] as Profile['role'][]).map((option) => (
          <Pressable
            key={option}
            disabled={saving}
            onPress={() => setRole(option)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: role === option ? 'black' : '#ddd',
              backgroundColor: role === option ? 'black' : 'white',
            }}
          >
            <Text style={{ color: role === option ? 'white' : 'black' }}>
              {option === 'student' ? 'Student' : 'Tutor'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Save button */}
      <Pressable
        disabled={saveDisabled}
        onPress={handleSave}
        style={{
          backgroundColor: saveDisabled ? '#ccc' : 'black',
          padding: 14,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          {saving ? 'Saving...' : 'Save Profile'}
        </Text>
      </Pressable>
    </View>
  );
}