import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/contexts/ThemeContext';

/**
 * Root Layout
 * 
 * Wraps the entire application with:
 * - ThemeProvider for dark/light mode support
 * - Expo Router Stack for navigation
 * - i18n context (to be added in Phase 3)
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen
          name="transactions/add"
          options={{
            title: 'Add Transaction',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="transactions/[id]/edit"
          options={{
            title: 'Edit Transaction',
            presentation: 'modal',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
