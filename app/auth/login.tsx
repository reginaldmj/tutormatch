import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '../../src/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Enter email and password.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    console.log('LOGIN DATA:', data);
    console.log('LOGIN ERROR:', error);

    if (error) {
      Alert.alert('Login failed', error.message);
      return;
    }

    router.replace('/(tabs)' as any);
  }

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
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10, marginBottom: 16 }}
      />

      <Pressable onPress={handleLogin} style={{ backgroundColor: 'black', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          Login
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