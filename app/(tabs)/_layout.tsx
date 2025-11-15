import { Tabs } from 'expo-router';
import { colors } from '@/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Transactions',
          tabBarLabel: 'Transactions',
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Summary',
          tabBarLabel: 'Summary',
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: 'Trends',
          tabBarLabel: 'Trends',
        }}
      />
    </Tabs>
  );
}
