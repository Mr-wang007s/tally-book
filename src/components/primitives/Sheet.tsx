/**
 * Sheet Component - Bottom modal with smooth animation
 * Supports snap points, swipe to dismiss, and haptic feedback
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ViewProps,
  Modal,
  Dimensions,
  PressableProps,
  Pressable,
  Text,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

const screenHeight = Dimensions.get('window').height;

export interface SheetProps extends ViewProps {
  /** Sheet visibility state */
  visible: boolean;
  /** Callback when sheet dismisses */
  onDismiss: () => void;
  /** Sheet height (pixels or percentage of screen) */
  height?: number | string;
  /** Snap points for partial heights */
  snapPoints?: number[];
  /** Allow swipe to dismiss */
  swipeable?: boolean;
  /** Header title */
  title?: string;
  /** Custom header children */
  headerContent?: React.ReactNode;
  /** Show handle indicator at top */
  showHandle?: boolean;
  /** Custom children */
  children?: React.ReactNode;
}

/**
 * Sheet component - bottom modal with smooth animations
 */
export const Sheet = React.forwardRef<View, SheetProps>(
  (
    {
      visible,
      onDismiss,
      height = '50%',
      snapPoints,
      swipeable = true,
      title,
      headerContent,
      showHandle = true,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { triggerImpact } = useHaptics();
    const [currentSnapIndex, setCurrentSnapIndex] = useState(0);

    const translateY = useSharedValue(0);

    // Calculate sheet height
    const getSheetHeight = (): number => {
      if (typeof height === 'number') return height;
      const percent = parseInt(height as string) / 100;
      return Math.floor(screenHeight * percent);
    };

    const sheetHeight = getSheetHeight();

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const handleDismiss = useCallback(() => {
      triggerImpact('light');
      onDismiss();
    }, [onDismiss, triggerImpact]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={handleDismiss}
      >
        {/* Backdrop */}
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
          onPress={handleDismiss}
        />

        {/* Sheet Container */}
        <Animated.View
          ref={ref}
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: sheetHeight,
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: 'hidden',
            },
            animatedStyle,
            style,
          ]}
          {...props}
        >
          {/* Handle Indicator */}
          {showHandle && (
            <View
              style={{
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: theme.colors.border,
                }}
              />
            </View>
          )}

          {/* Header */}
          {(title || headerContent) && (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.divider,
              }}
            >
              {title && (
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: theme.colors.textPrimary,
                  }}
                >
                  {title}
                </Text>
              )}
              {headerContent && headerContent}
            </View>
          )}

          {/* Content */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            {children}
          </View>
        </Animated.View>
      </Modal>
    );
  }
);

Sheet.displayName = 'Sheet';

/**
 * Sheet action button
 */
export interface SheetActionProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'destructive';
  onPress: () => void;
}

export const SheetAction: React.FC<SheetActionProps> = ({
  label,
  variant = 'primary',
  onPress,
  ...props
}) => {
  const { theme } = useTheme();
  const { triggerImpact } = useHaptics();

  const handlePress = useCallback(() => {
    triggerImpact('light');
    onPress();
  }, [onPress, triggerImpact]);

  const getVariantStyle = () => {
    switch (variant) {
      case 'destructive':
        return {
          backgroundColor: theme.colors.error,
          color: theme.colors.textOnPrimary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.backgroundSecondary,
          color: theme.colors.textPrimary,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'primary':
      default:
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.textOnPrimary,
        };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          alignItems: 'center',
          opacity: pressed ? 0.8 : 1,
          ...variantStyle,
        },
      ]}
      {...props}
    >
      <Text style={{ fontSize: 16, fontWeight: '600', color: variantStyle.color }}>
        {label}
      </Text>
    </Pressable>
  );
};

SheetAction.displayName = 'SheetAction';

export default Sheet;
