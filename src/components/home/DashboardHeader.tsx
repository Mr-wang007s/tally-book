/**
 * DashboardHeader Component
 * Greeting header with user name, date, and settings access
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface DashboardHeaderProps {
  /** User name for greeting */
  userName?: string;
  /** Settings button callback */
  onSettingsPress?: () => void;
  /** Show date and day of week */
  showDate?: boolean;
}

/**
 * Get greeting based on time of day
 */
function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Format current date
 */
function formatDate(): string {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * DashboardHeader component - greeting and date display
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'User',
  onSettingsPress,
  showDate = true,
}) => {
  const { theme } = useTheme();

  const greeting = useMemo(() => getGreeting(), []);
  const dateStr = useMemo(() => formatDate(), []);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}
    >
      {/* Left: Greeting */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.textSecondary,
            fontWeight: '500',
            marginBottom: 4,
          }}
        >
          {greeting}
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: showDate ? 8 : 0,
          }}
        >
          {userName}
        </Text>
        {showDate && (
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.textTertiary,
            }}
          >
            {dateStr}
          </Text>
        )}
      </View>

      {/* Right: Settings Button */}
      {onSettingsPress && (
        <Pressable
          onPress={onSettingsPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [
            {
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.backgroundSecondary,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </Pressable>
      )}
    </View>
  );
};

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
