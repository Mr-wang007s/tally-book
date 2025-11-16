/**
 * Visual Effects - Glassmorphism, Blur, and Advanced Shadows
 * iOS 18 inspired visual effects for modern UI
 */

import { StyleSheet } from 'react-native';

/**
 * Glassmorphism effect styles
 * Creates frosted glass appearance with backdrop blur
 */
export const glassmorphism = {
  // Light glassmorphism
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(20px)',
  },
  
  // Dark glassmorphism
  dark: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
  },
  
  // Deep glassmorphism (more opaque)
  deepLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 0.3)',
    backdropFilter: 'blur(30px)',
  },
  
  deepDark: {
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(100, 100, 100, 0.2)',
    backdropFilter: 'blur(30px)',
  },
};

/**
 * Blur intensities for Android/iOS fallback
 */
export const blurIntensities = {
  light: 20,      // Light blur for subtle effects
  medium: 40,     // Medium blur for glassmorphism
  heavy: 60,      // Heavy blur for strong effects
};

/**
 * Overlay effects with color and opacity
 */
export const overlays = {
  // Light mode overlays
  lightOverlay10: 'rgba(0, 0, 0, 0.1)',
  lightOverlay20: 'rgba(0, 0, 0, 0.2)',
  lightOverlay30: 'rgba(0, 0, 0, 0.3)',
  lightOverlay40: 'rgba(0, 0, 0, 0.4)',
  
  // Dark mode overlays
  darkOverlay10: 'rgba(255, 255, 255, 0.1)',
  darkOverlay20: 'rgba(255, 255, 255, 0.2)',
  darkOverlay30: 'rgba(255, 255, 255, 0.3)',
  
  // Scrim for modals
  scrimLight: 'rgba(0, 0, 0, 0.4)',
  scrimDark: 'rgba(0, 0, 0, 0.6)',
};

/**
 * Advanced shadow definitions for complex depth
 */
export const advancedShadows = {
  // Subtle elevation shadows
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  
  // Card shadows
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  
  // Modal shadows
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  
  // Floating action shadows
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  
  // Popover shadows
  popover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 48,
    elevation: 16,
  },
};

/**
 * Gradient backgrounds for cards and containers
 */
export const gradientBackgrounds = {
  // Subtle gradients
  subtleLight: {
    start: 'rgba(255, 255, 255, 1)',
    end: 'rgba(242, 242, 247, 0.5)',
  },
  
  subtleDark: {
    start: 'rgba(28, 28, 30, 1)',
    end: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Primary accent gradients
  primaryLight: {
    start: 'rgba(0, 122, 255, 0.1)',
    end: 'rgba(90, 200, 250, 0.05)',
  },
  
  primaryDark: {
    start: 'rgba(10, 132, 255, 0.1)',
    end: 'rgba(100, 210, 255, 0.05)',
  },
};

/**
 * Utility function to create glassmorphism effect (web-compatible)
 */
export function getGlassmorphismStyle(mode: 'light' | 'dark', intensity: 'light' | 'deep' = 'light') {
  if (mode === 'light') {
    return intensity === 'deep' ? glassmorphism.deepLight : glassmorphism.light;
  }
  return intensity === 'deep' ? glassmorphism.deepDark : glassmorphism.dark;
}

/**
 * Utility function to get overlay color
 */
export function getOverlayColor(mode: 'light' | 'dark', opacity: 10 | 20 | 30 | 40 = 20) {
  const key = mode === 'light' ? `lightOverlay${opacity}` : `darkOverlay${opacity}`;
  return overlays[key as keyof typeof overlays];
}
