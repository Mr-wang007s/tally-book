/**
 * SuccessCheck Animation Component
 * Displays animated success checkmark after operation completion
 * Combines scale, rotation, and stroke animations
 */

import React, { useEffect, useMemo } from 'react';
import {
  View,
  ViewProps,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  useReducedMotionIsEnabled,
  Easing,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

export interface SuccessCheckProps extends ViewProps {
  /** Size of the checkmark circle */
  size?: number;
  /** Duration of animation in milliseconds */
  duration?: number;
  /** Color of checkmark and circle */
  color?: string;
  /** Background circle color (optional) */
  backgroundColor?: string;
  /** Show background circle */
  showBackground?: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Custom children (overrides checkmark) */
  children?: React.ReactNode;
  /** Auto-start animation on mount */
  autoStart?: boolean;
}

/**
 * SuccessCheck component - animated success indicator with checkmark
 */
export const SuccessCheck = React.forwardRef<View, SuccessCheckProps>(
  (
    {
      size = 80,
      duration = 600,
      color,
      backgroundColor,
      showBackground = true,
      onComplete,
      children,
      autoStart = true,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const reducedMotion = useReducedMotionIsEnabled();
    
    const checkProgress = useSharedValue(0);
    const scaleProgress = useSharedValue(0);
    const rotateProgress = useSharedValue(0);

    const themeColor = color || theme.colors.success;
    const themeBgColor = backgroundColor || theme.colors.success;

    // Start animation
    useEffect(() => {
      if (!autoStart) return;

      const animDuration = reducedMotion ? 0 : duration;

      // Circle scale-in
      scaleProgress.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, {
          duration: animDuration * 0.4,
          easing: Easing.out(Easing.cubic),
        })
      );

      // Checkmark stroke animation
      checkProgress.value = withSequence(
        withDelay(animDuration * 0.2, withTiming(0, { duration: 0 })),
        withTiming(1, {
          duration: animDuration * 0.6,
          easing: Easing.out(Easing.cubic),
        })
      );

      // Completion callback
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, animDuration);
    }, [autoStart, reducedMotion, duration, checkProgress, scaleProgress, onComplete]);

    // Circle scale animation
    const circleAnimatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scaleProgress.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
      };
    });

    // Checkmark stroke animation (simulated via opacity)
    const checkmarkAnimatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        checkProgress.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP
      );

      return {
        opacity,
      };
    });

    return (
      <View ref={ref} style={style} {...props}>
        {children ? (
          children
        ) : (
          <>
            {/* Background circle */}
            {showBackground && (
              <Animated.View
                style={[
                  {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: themeBgColor,
                    opacity: 0.2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  circleAnimatedStyle,
                ]}
              >
                {/* Checkmark SVG or Text */}
                <Animated.Text
                  style={[
                    {
                      fontSize: size * 0.5,
                      color: themeColor,
                      fontWeight: 'bold',
                    },
                    checkmarkAnimatedStyle,
                  ]}
                >
                  ✓
                </Animated.Text>
              </Animated.View>
            )}

            {/* Checkmark only (no background) */}
            {!showBackground && (
              <Animated.Text
                style={[
                  {
                    fontSize: size,
                    color: themeColor,
                    fontWeight: 'bold',
                  },
                  circleAnimatedStyle,
                  checkmarkAnimatedStyle,
                ]}
              >
                ✓
              </Animated.Text>
            )}
          </>
        )}
      </View>
    );
  }
);

SuccessCheck.displayName = 'SuccessCheck';

/**
 * Success state variants for different sizes and styles
 */
export const successCheckVariants = {
  small: {
    size: 48,
    duration: 400,
    showBackground: true,
  },
  medium: {
    size: 80,
    duration: 600,
    showBackground: true,
  },
  large: {
    size: 120,
    duration: 800,
    showBackground: true,
  },
  minimal: {
    size: 40,
    duration: 300,
    showBackground: false,
  },
};

/**
 * Success toast variant
 */
export interface SuccessToastProps extends ViewProps {
  message?: string;
  size?: number;
  duration?: number;
  onDismiss?: () => void;
  autoHide?: boolean;
  hideDelay?: number;
}

export const SuccessToast = React.forwardRef<View, SuccessToastProps>(
  (
    {
      message = 'Success!',
      size = 60,
      duration = 600,
      onDismiss,
      autoHide = true,
      hideDelay = 2000,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();

    const handleComplete = () => {
      if (autoHide) {
        setTimeout(() => {
          if (onDismiss) {
            onDismiss();
          }
        }, hideDelay);
      }
    };

    return (
      <View
        ref={ref}
        style={[
          {
            backgroundColor: theme.colors.success,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.9,
          },
          style,
        ]}
        {...props}
      >
        <SuccessCheck
          size={size}
          duration={duration}
          color={theme.colors.textOnPrimary}
          backgroundColor={theme.colors.textOnPrimary}
          showBackground={false}
          onComplete={handleComplete}
          autoStart
        />
        {message && (
          <Animated.Text
            style={{
              color: theme.colors.textOnPrimary,
              fontSize: 16,
              fontWeight: '600',
              marginTop: 12,
              textAlign: 'center',
            }}
          >
            {message}
          </Animated.Text>
        )}
      </View>
    );
  }
);

SuccessToast.displayName = 'SuccessToast';

/**
 * Confirmation checkmark for buttons
 */
export interface ConfirmCheckProps extends ViewProps {
  isActive: boolean;
  size?: number;
  color?: string;
}

export const ConfirmCheck = React.forwardRef<View, ConfirmCheckProps>(
  (
    {
      isActive,
      size = 24,
      color,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const checkProgress = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
      checkProgress.value = withTiming(isActive ? 1 : 0, {
        duration: 300,
        easing: Easing.inOut(Easing.cubic),
      });
    }, [isActive, checkProgress]);

    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        checkProgress.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP
      );

      return {
        opacity,
      };
    });

    return (
      <Animated.View
        ref={ref}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color || theme.colors.success,
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyle,
          style,
        ]}
        {...props}
      >
        <Text style={{ color: theme.colors.textOnPrimary, fontSize: size * 0.6 }}>
          ✓
        </Text>
      </Animated.View>
    );
  }
);

ConfirmCheck.displayName = 'ConfirmCheck';

/**
 * Export as default for convenience
 */
export default SuccessCheck;
