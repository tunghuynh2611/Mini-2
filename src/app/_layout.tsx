import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { requestNotificationPermissions } from '../utils/notifications';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  useEffect(() => {
    // Request notification permissions when app loads
    requestNotificationPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: '700',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="room/[id]"
          options={{
            title: 'Room Details',
            headerBackTitle: 'Back',
            presentation: 'card',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
