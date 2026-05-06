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
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.replace('/auth/login' as any);
    } else {
      router.replace('/(tabs)' as any);
    }
  }, [session, loading]);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BookingProvider>
        <ChatProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="tutor/[id]" />
            <Stack.Screen name="booking/[tutorId]" />
            <Stack.Screen name="chat/[id]" />
            <Stack.Screen name="modal" />
            <Stack.Screen name="profile/edit" />
          </Stack>

          <StatusBar style="auto" />
        </ChatProvider>
      </BookingProvider>
    </ThemeProvider>
  );
}