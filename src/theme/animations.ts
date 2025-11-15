import { Easing } from 'react-native-reanimated';

export const animations = {
  duration: {
    instant: 0,
    fast: 200,
    normal: 350,
    slow: 500,
  },
  easing: {
    easeInOut: Easing.bezier(0.25, 0.1, 0.25, 1),
    easeOut: Easing.bezier(0, 0, 0.2, 1),
    easeIn: Easing.bezier(0.4, 0, 1, 1),
  },
  spring: {
    gentle: {
      damping: 15,
      stiffness: 150,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    },
    default: {
      damping: 20,
      stiffness: 200,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    },
    bouncy: {
      damping: 10,
      stiffness: 100,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    },
  },
};
