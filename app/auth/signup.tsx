import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { supabase } from '../../src/lib/supabase';

export default function SignupScreen() {
  // Stores form input values
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Prevents duplicate signup requests
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    // Basic validation
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter name, email, and password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password should be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // Create Supabase Auth user
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert('Signup failed', error.message);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        Alert.alert('Account created', 'Check your email, then log in.');
        router.push('/auth/login' as any);
        return;
      }

      // Create profile row linked to auth user
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        full_name: fullName.trim(),
        role: 'student',
      });

      if (profileError) {
        Alert.alert('Profile error', profileError.message);
        return;
      }

      Alert.alert('Account created', 'Now log in.');
      router.push('/auth/login' as any);
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !fullName.trim() || !email.trim() || !password;

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, fontWeight: '700', marginBottom: 24 }}>
        Sign Up
      </Text>

      <TextInput
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 12,
          borderRadius: 10,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 12,
          borderRadius: 10,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 12,
          borderRadius: 10,
          marginBottom: 16,
        }}
      />

      <Pressable
        disabled={disabled}
        onPress={handleSignup}
        style={{
          backgroundColor: disabled ? '#ccc' : 'black',
          padding: 14,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push('/auth/login' as any)}>
        <Text style={{ marginTop: 16, textAlign: 'center' }}>
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
}