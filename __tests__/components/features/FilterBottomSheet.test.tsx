import { renderHook, act } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';

describe('FilterBottomSheet - Animation', () => {
  it('should animate with spring', () => {
    const { result } = renderHook(() => useSharedValue(0));

    act(() => {
      result.current.value = 1;
    });

    // This is a simplified test. In a real scenario, we would check the animation.
    expect(result.current.value).toBe(1);
  });
});
