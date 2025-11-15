import { useRef, useEffect, useState } from 'react';
import { useFrameCallback } from 'react-native-reanimated';

export function usePerformanceMonitor() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const frameTimestamps = useRef<number[]>([]);

  useFrameCallback((frameInfo) => {
    const now = frameInfo.timestamp;
    frameTimestamps.current.push(now);

    if (frameTimestamps.current.length > 10) {
      frameTimestamps.current.shift();
    }

    if (frameTimestamps.current.length >= 10) {
      const duration = now - frameTimestamps.current[0];
      const fps = (frameTimestamps.current.length / duration) * 1000;

      if (fps < 45) {
        setIsLowPerformance(true);
      }
    }
  });

  return isLowPerformance;
}
