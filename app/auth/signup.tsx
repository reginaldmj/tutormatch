import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '../../src/lib/supabase';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

async function handleSignup() {
  console.log('Signup button pressed');

  if (!email || !password) {
    Alert.alert('Missing fields', 'Enter email and password.');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  console.log('SIGNUP DATA:', data);
  console.log('SIGNUP ERROR:', error);

  if (error) {
    Alert.alert('Signup failed', error.message);
    return;
  }

  Alert.alert('Account created', 'Now try logging in.');
  router.push('/auth/login' as any);
}

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, fontWeight: '700', marginBottom: 24 }}>
        Sign Up
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10, marginBottom: 16 }}
      />

      <Pressable onPress={handleSignup} style={{ backgroundColor: 'black', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          Create Account
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