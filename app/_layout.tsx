import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import '@/i18n/config'; // Initialize i18n

/**
 * Root Layout
 * 
 * Wraps the entire application with:
 * - ThemeProvider for dark/light mode support
 * - Expo Router Stack for navigation
 * - i18n initialized via config import
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
