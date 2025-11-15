import { animations } from '@/theme/animations';

describe('Theme: Animations', () => {
  it('should have correct duration values', () => {
    expect(animations.duration.fast).toBe(200);
    expect(animations.duration.normal).toBe(350);
    expect(animations.duration.slow).toBe(500);
  });

  it('should have spring config with damping', () => {
    expect(animations.spring.default.damping).toBe(20);
  });
});
