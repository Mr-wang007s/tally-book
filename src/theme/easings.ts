/**
 * Timing Curves & Easing Functions - iOS 18 Inspired
 * Standardized easing for consistent animation feel
 */

/**
 * Standard easing curves
 */
export const easingCurves = {
  // Material Design standard easing
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  // iOS standard easing (ease-in-out)
  ios: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  
  // Deceleration (ease-out)
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  
  // Acceleration (ease-in)
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  
  // Linear
  linear: 'cubic-bezier(0, 0, 1, 1)',
  
  // Anticipation (ease-in-back)
  anticipate: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  
  // Back out
  backOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  
  // Elastic
  elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  
  // Bounce out
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  // Smooth ease-in-out
  smooth: 'cubic-bezier(0.45, 0, 0.55, 1)',
  
  // Sharp ease-in-out
  sharp: 'cubic-bezier(0.33, 0, 0.67, 1)',
};

/**
 * Easing curves for specific interactions
 */
export const interactionEasings = {
  // Button press feedback
  press: easingCurves.decelerate,
  
  // Card elevation
  elevation: easingCurves.standard,
  
  // Modal appearance
  modal: easingCurves.decelerate,
  
  // List item entrance
  listItem: easingCurves.standard,
  
  // Scroll position
  scroll: easingCurves.linear,
  
  // Drag and drop
  drag: easingCurves.smooth,
  
  // Focus ring
  focus: easingCurves.standard,
  
  // Dismiss/close
  dismiss: easingCurves.accelerate,
  
  // Enter screen
  enterScreen: easingCurves.decelerate,
  
  // Exit screen
  exitScreen: easingCurves.accelerate,
};

/**
 * Easing for data visualization
 */
export const chartEasings = {
  // Count-up numbers
  countUp: easingCurves.decelerate,
  
  // Bar chart growth
  barGrowth: easingCurves.decelerate,
  
  // Pie/donut animation
  pieSegment: easingCurves.standard,
  
  // Line chart draw
  lineDraw: easingCurves.linear,
  
  // Legend fade
  legendFade: easingCurves.smooth,
};

/**
 * Reduced motion alternatives
 */
export const reducedMotionEasings = {
  instant: 'linear',
  none: 'step-end',
};

/**
 * Cubic bezier helper for custom curves
 */
export interface CubicBezier {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function toCubicBezier(curve: string): CubicBezier | null {
  const match = curve.match(/cubic-bezier\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/);
  if (!match) return null;
  
  return {
    x1: parseFloat(match[1]),
    y1: parseFloat(match[2]),
    x2: parseFloat(match[3]),
    y2: parseFloat(match[4]),
  };
}

export function fromCubicBezier(bezier: CubicBezier): string {
  return `cubic-bezier(${bezier.x1}, ${bezier.y1}, ${bezier.x2}, ${bezier.y2})`;
}

/**
 * Get easing by interaction type
 */
export function getEasingForInteraction(interaction: keyof typeof interactionEasings): string {
  return interactionEasings[interaction];
}

/**
 * Get easing for chart element
 */
export function getChartEasing(element: keyof typeof chartEasings): string {
  return chartEasings[element];
}
