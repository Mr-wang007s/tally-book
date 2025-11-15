/**
 * App Entry Point (fallback for non-Expo Router environments)
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ui/ErrorBoundary';

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        {/* Expo Router will handle routing */}
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
