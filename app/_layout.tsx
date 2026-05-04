import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { BookingProvider } from '@/src/context/BookingContext';
import { ChatProvider } from '@/src/context/ChatContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BookingProvider>
        <ChatProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="tutor/[id]" options={{ title: 'Tutor Profile' }} />
            <Stack.Screen
              name="booking/[tutorId]"
              options={{ title: 'Book Session' }}
            />
            <Stack.Screen name="chat/[id]" options={{ title: 'Chat' }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: 'modal', title: 'Modal' }}/>

            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />  
          </Stack>

          <StatusBar style="auto" />
        </ChatProvider>
      </BookingProvider>
    </ThemeProvider>
  );
}