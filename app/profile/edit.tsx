import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { ScreenState } from '../../src/components/ScreenState';
import { supabase } from '../../src/lib/supabase';
import { Profile } from '../../src/types/profile';

export default function EditProfileScreen() {
  // Form state for editable profile fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Profile['role']>('student');

  // Tracks initial profile loading from Supabase
  const [loading, setLoading] = useState(true);

  // Tracks save request state to prevent duplicate submissions
  const [saving, setSaving] = useState(false);

  // Load current profile when screen opens
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    // Get currently logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch profile row linked to auth user id
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

    // Pre-fill form with current profile values
    if (data) {
      setFullName(data.full_name ?? '');
      setRole(data.role ?? 'student');
    }

    setLoading(false);
  }

  async function handleSave() {
    // Validate required field
    if (!fullName.trim()) {
      Alert.alert('Missing name', 'Please enter your full name.');
      return;
    }

    setSaving(true);

    // Get current auth user before updating profile
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    // Update profile row in Supabase
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

    // Return to Profile tab after successful update
    Alert.alert('Profile updated', 'Your profile was saved.');
    router.back();
  }

  // Disable save while saving or if name is empty
  const saveDisabled = saving || !fullName.trim();

  if (loading) {
    return <ScreenState message="Loading profile..." />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Page title */}
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        Edit Profile
      </Text>

      {/* Full name input */}
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