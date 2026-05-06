import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { supabase } from '../../src/lib/supabase';

export default function LoginScreen() {
  // Stores form input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Prevents double-clicking login
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    // Basic validation
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter email and password.');
      return;
    }

    setLoading(true);

    try {
      // Sign in with Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert('Login failed', error.message);
        return;
      }

      // Send user to main app
      router.replace('/(tabs)' as any);
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !email.trim() || !password;

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, fontWeight: '700', marginBottom: 24 }}>
        Login
      </Text>

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
        onPress={handleLogin}
        style={{
          backgroundColor: disabled ? '#ccc' : 'black',
          padding: 14,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push('/auth/signup' as any)}>
        <Text style={{ marginTop: 16, textAlign: 'center' }}>
          Need an account? Sign up
        </Text>
      </Pressable>
    </View>
  );
}