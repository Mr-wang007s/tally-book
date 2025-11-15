import { render } from '@testing-library/react-native';
import ListScreen from '@/app/(tabs)/list';

describe('ListScreen - iOS Visual Redesign', () => {
  it('should render FlatList with 8pt item spacing', () => {
    const { getByTestId } = render(<ListScreen />);
    const flatList = getByTestId('expense-list');
    expect(flatList.props.contentContainerStyle).toMatchObject({
      paddingBottom: 8,
    });
  });
});
