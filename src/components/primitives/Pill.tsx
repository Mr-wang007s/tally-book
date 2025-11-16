/**
 * Pill Component - Category chip/tag
 * Compact, rounded selector for categories, tags, or filters
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export type PillSize = 'small' | 'medium' | 'large';
export type PillVariant = 'filled' | 'outlined' | 'subtle';

export interface PillProps extends Omit<PressableProps, 'children'> {
  /** Pill label text */
  label: string;
  /** Pill size */
  size?: PillSize;
  /** Visual variant */
  variant?: PillVariant;
  /** Is pill selected */
  selected?: boolean;
  /** Leading icon/badge */
  leadingIcon?: React.ReactNode;
  /** Trailing badge (count, close icon) */
  trailingBadge?: React.ReactNode;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Haptic feedback on press */
  hapticFeedback?: boolean;
  /** Color (hex or theme color key) */
  color?: string;
}

/**
 * Pill component - compact category/tag selector
 */
export const Pill = React.forwardRef<View, PillProps>(
  (
    {
      label,
      size = 'medium',
      variant = 'outlined',
      selected = false,
      leadingIcon,
      trailingBadge,
      containerStyle,
      textStyle,
      hapticFeedback = true,
      color,
      onPress,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { triggerImpact } = useHaptics();
    const selectProgress = useSharedValue(selected ? 1 : 0);

    // Size configurations
    const getSizeStyles = (): {
      height: number;
      paddingHorizontal: number;
      fontSize: number;
    } => {
      switch (size) {
        case 'small':
          return { height: 28, paddingHorizontal: 10, fontSize: 12 };
        case 'large':
          return { height: 40, paddingHorizontal: 16, fontSize: 16 };
        case 'medium':
        default:
          return { height: 32, paddingHorizontal: 12, fontSize: 14 };
      }
    };

    // Get colors based on variant and state
    const getColorScheme = () => {
      const baseColor = color || theme.colors.primary;
      
      if (variant === 'filled') {
        return {
          bg: selected ? baseColor : theme.colors.backgroundSecondary,
          text: selected ? theme.colors.textOnPrimary : theme.colors.textPrimary,
          border: selected ? baseColor : theme.colors.border,
        };
      } else if (variant === 'outlined') {
        return {
          bg: selected ? baseColor : 'transparent',
          text: selected ? theme.colors.textOnPrimary : theme.colors.textPrimary,
          border: selected ? baseColor : theme.colors.border,
        };
      } else {
        // subtle
        return {
          bg: selected ? baseColor : theme.colors.backgroundTertiary,
          text: selected ? theme.colors.textOnPrimary : theme.colors.textSecondary,
          border: 'transparent',
        };
      }
    };

    const colorScheme = getColorScheme();
    const sizeStyles = getSizeStyles();

    const handlePress = useCallback(
      (e: any) => {
        if (hapticFeedback) {
          triggerImpact('light');
        }

        selectProgress.value = withTiming(selected ? 0 : 1, {
          duration: 200,
          easing: Easing.inOut(Easing.ease),
        });

        onPress?.(e);
      },
      [selected, hapticFeedback, triggerImpact, onPress, selectProgress]
    );

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: interpolateColor(
        selectProgress.value,
        [0, 1],
        [0.6, 1]
      ) as any,
    }));

    return (
      <Animated.View
        ref={ref}
        style={[
          {
            height: sizeStyles.height,
            borderRadius: sizeStyles.height / 2,
            overflow: 'hidden',
          },
          animatedStyle,
        ]}
      >
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ selected }}
          style={({ pressed }) => [
            {
              height: sizeStyles.height,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              borderRadius: sizeStyles.height / 2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: colorScheme.bg,
              borderWidth: 1.5,
              borderColor: colorScheme.border,
              opacity: pressed ? 0.8 : 1,
            },
            containerStyle,
          ]}
          {...props}
        >
          {leadingIcon && (
            <View style={{ marginRight: -4 }}>
              {leadingIcon}
            </View>
          )}

          <Text
            style={[
              {
                fontSize: sizeStyles.fontSize,
                fontWeight: '600',
                color: colorScheme.text,
                textAlign: 'center',
              },
              textStyle,
            ]}
          >
            {label}
          </Text>

          {trailingBadge && (
            <View style={{ marginLeft: -4 }}>
              {trailingBadge}
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  }
);

Pill.displayName = 'Pill';

/**
 * Pill group for multi-selection
 */
export interface PillGroupProps {
  pills: Array<{
    id: string;
    label: string;
    leadingIcon?: React.ReactNode;
  }>;
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  size?: PillSize;
  variant?: PillVariant;
  maxSelections?: number;
  gap?: number;
  horizontal?: boolean;
}

export const PillGroup: React.FC<PillGroupProps> = ({
  pills,
  selectedIds,
  onSelectionChange,
  size = 'medium',
  variant = 'outlined',
  maxSelections,
  gap = 8,
  horizontal = true,
}) => {
  const handlePillPress = useCallback(
    (pillId: string) => {
      let newSelection = [...selectedIds];

      if (selectedIds.includes(pillId)) {
        newSelection = newSelection.filter((id) => id !== pillId);
      } else {
        if (maxSelections && newSelection.length >= maxSelections) {
          newSelection = [pillId]; // Replace first selection
        } else {
          newSelection.push(pillId);
        }
      }

      onSelectionChange(newSelection);
    },
    [selectedIds, maxSelections, onSelectionChange]
  );

  return (
    <View
      style={{
        flexDirection: horizontal ? 'row' : 'column',
        flexWrap: 'wrap',
        gap,
      }}
    >
      {pills.map((pill) => (
        <Pill
          key={pill.id}
          label={pill.label}
          size={size}
          variant={variant}
          selected={selectedIds.includes(pill.id)}
          leadingIcon={pill.leadingIcon}
          onPress={() => handlePillPress(pill.id)}
        />
      ))}
    </View>
  );
};

PillGroup.displayName = 'PillGroup';

export default Pill;
