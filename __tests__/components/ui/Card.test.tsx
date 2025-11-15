import { render } from '@testing-library/react-native';
import { Card } from '@/components/ui/Card';

describe('Card - iOS Visual Redesign', () => {
  it('should use 12pt border radius', () => {
    const { getByTestId } = render(
      <Card testID=\"test-card\">Content</Card>
    );
    
    const card = getByTestId('test-card');
    expect(card.props.style).toMatchObject({
      borderRadius: 12,
    });
  });

  it('should apply medium shadow in light mode', () => {
    const { getByTestId } = render(
      <Card testID=\"test-card\" elevation=\"md\">Content</Card>
    );
    
    const card = getByTestId('test-card');
    expect(card.props.style.shadowOpacity).toBe(0.12);
    expect(card.props.style.shadowRadius).toBe(4);
  });
});
