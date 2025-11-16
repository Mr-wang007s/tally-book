/**
 * ViewModeToggle Component
 * 
 * Toggle between different view modes (list, grid, chart)
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type ViewMode = 'list' | 'grid' | 'chart';

export interface ViewModeToggleProps {
  value?: ViewMode;
  onChangeMode?: (mode: ViewMode) => void;
  modes?: ViewMode[];
  containerStyle?: ViewStyle;
}

const modeIcons = {
  list: '☰',
  grid: '⊞',
  chart: '📊',
};

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  value = 'list',
  onChangeMode,
  modes = ['list', 'grid', 'chart'],
  containerStyle,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    button: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    },
    lastButton: {
      borderRightWidth: 0,
    },
    buttonActive: {
      backgroundColor: theme.colors.primary + '20',
    },
    buttonIcon: {
      fontSize: 18,
      color: theme.colors.textSecondary,
    },
    buttonIconActive: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {modes.map((mode, index) => (
        <Pressable
          key={mode}
          style={[
            styles.button,
            index === modes.length - 1 && styles.lastButton,
            value === mode && styles.buttonActive,
          ]}
          onPress={() => onChangeMode?.(mode)}
        >
          <View
            style={[
              styles.buttonIcon,
              value === mode && styles.buttonIconActive,
            ]}
            as="text"
          >
            {modeIcons[mode]}
          </View>
        </Pressable>
      ))}
    </View>
  );
};

ViewModeToggle.displayName = 'ViewModeToggle';
