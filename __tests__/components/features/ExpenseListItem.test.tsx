import { render } from '@testing-library/react-native';
import { ExpenseListItem } from '@/components/features/ExpenseListItem';

describe('ExpenseListItem - iOS Visual Redesign', () => {
  it('should have a 48x48 icon', () => {
    // Mock data
    const item = { id: '1', amount: 100, category: { id: '1', name: 'Food', icon: 'food' }, date: new Date() };
    const { getByTestId } = render(<ExpenseListItem item={item} />);
    const icon = getByTestId('category-icon');
    expect(icon.props.style).toMatchObject({
      width: 48,
      height: 48,
      borderRadius: 24,
    });
  });
});
