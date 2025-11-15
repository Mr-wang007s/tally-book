/**
 * useFABAnimation Hook
 * 
 * Provides Reanimated 3 animations for FAB expansion/collapse
 * 60fps smooth animations per Constitution Principle V
 * 
 * @module useFABAnimation
 */

import { useState } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { UseFABAnimationResult } from '@/types/transaction';

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
};

export function useFABAnimation(): UseFABAnimationResult {
  const [isExpanded, setIsExpanded] = useState(false);

  // Shared values for animations
  const rotation = useSharedValue(0);
  const translateY1 = useSharedValue(0);
  const translateY2 = useSharedValue(0);
  const translateY3 = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Toggle expand state
  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);

    // Animate rotation (0deg → 45deg)
    rotation.value = withSpring(newState ? 45 : 0, SPRING_CONFIG);

    // Animate sub-buttons
    if (newState) {
      // Expand: staggered animation upward
      translateY1.value = withSpring(-70, SPRING_CONFIG);
      translateY2.value = withSpring(-140, { ...SPRING_CONFIG, damping: 16 });
      translateY3.value = withSpring(-210, { ...SPRING_CONFIG, damping: 17 });
      opacity.value = withSpring(1, SPRING_CONFIG);
    } else {
      // Collapse: all at once
      translateY1.value = withSpring(0, SPRING_CONFIG);
      translateY2.value = withSpring(0, SPRING_CONFIG);
      translateY3.value = withSpring(0, SPRING_CONFIG);
      opacity.value = withSpring(0, SPRING_CONFIG);
    }
  };

  // Main button animated style
  const mainButtonStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Sub-button animated styles
  const subButtonStyles = [
    useAnimatedStyle(() => ({
      transform: [{ translateY: translateY1.value }],
      opacity: opacity.value,
    })),
    useAnimatedStyle(() => ({
      transform: [{ translateY: translateY2.value }],
      opacity: opacity.value,
    })),
    useAnimatedStyle(() => ({
      transform: [{ translateY: translateY3.value }],
      opacity: opacity.value,
    })),
  ];

  return {
    isExpanded,
    toggleExpanded,
    rotationValue: rotation,
    mainButtonStyle,
    subButtonStyles,
  };
}
