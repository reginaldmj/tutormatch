import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { BookingProvider } from '@/src/context/BookingContext';
import { ChatProvider } from '@/src/context/ChatContext';
import { supabase } from '@/src/lib/supabase';

export default function RootLayout() {
  // Detect system light/dark mode
  const colorScheme = useColorScheme();

  // Stores active Supabase session
  const [session, setSession] = useState<any>(null);

  // Prevents redirecting before Supabase checks auth
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    // Clean up auth listener
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Wait until session check finishes
    if (loading) return;

    // Logged out users go to login
    if (!session) {
      router.replace('/auth/login' as any);
      return;
    }

    // Logged in users go to main app
    router.replace('/(tabs)' as any);
  }, [session, loading]);

  // Avoid flashing wrong screen while auth loads
  if (loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Global booking state */}
      <BookingProvider>
        {/* Global chat state + realtime subscription */}
        <ChatProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Auth routes */}
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />

            {/* Main tabs */}
            <Stack.Screen name="(tabs)" />

            {/* Detail routes */}
            <Stack.Screen name="tutor/[id]" />
            <Stack.Screen name="booking/[tutorId]" />
            <Stack.Screen name="chat/[id]" />
            <Stack.Screen name="profile/edit" />

            {/* Default Expo modal route */}
            <Stack.Screen name="modal" />
          </Stack>

          <StatusBar style="auto" />
        </ChatProvider>
      </BookingProvider>
    </ThemeProvider>
  );
}