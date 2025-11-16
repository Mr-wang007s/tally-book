/**
 * Home Tab Screen
 * Main dashboard displaying financial overview, recent activity, and quick actions
 * Located at: app/(tabs)/home.tsx (part of tab navigation)
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { useResponsive } from '../../src/hooks/useResponsive';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { screenWidth } = useResponsive();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTrigger = useSharedValue(0);

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    // Trigger spring animation
    refreshTrigger.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });

    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      refreshTrigger.value = 0;
    }, 1000);
  }, [refreshTrigger]);

  const contentPadding = screenWidth < 375 ? 12 : 16;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
        contentContainerStyle={{
          paddingHorizontal: contentPadding,
          paddingVertical: 12,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            progressBackgroundColor={theme.colors.surface}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          // Skeleton loader
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 400 }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <>
            {/* Dashboard Header */}
            {/* TODO: T089 - Add DashboardHeader component */}
            <View style={{ marginBottom: 24 }}>
              {/* Header placeholder */}
            </View>

            {/* Financial Overview Widget */}
            {/* TODO: T091 - Add BalanceCard component */}
            <View style={{ marginBottom: 24 }}>
              {/* BalanceCard placeholder */}
            </View>

            {/* Recent Transactions Widget */}
            {/* TODO: T095 - Add RecentTransactions component */}
            <View style={{ marginBottom: 24 }}>
              {/* RecentTransactions placeholder */}
            </View>

            {/* Quick Insights Widget */}
            {/* TODO: T099 - Add QuickInsights component */}
            <View style={{ marginBottom: 24 }}>
              {/* QuickInsights placeholder */}
            </View>

            {/* Spending Breakdown Widget */}
            {/* TODO: T103 - Add SpendingBreakdown component */}
            <View style={{ marginBottom: 24 }}>
              {/* SpendingBreakdown placeholder */}
            </View>
          </>
        )}
      </ScrollView>

      {/* Quick Actions FAB */}
      {/* TODO: T107 - Add QuickActionsFAB component */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
