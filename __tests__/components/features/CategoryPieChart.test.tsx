import { render } from '@testing-library/react-native';
import { CategoryPieChart } from '@/components/features/CategoryPieChart';

describe('CategoryPieChart - Snapshot', () => {
  it('renders correctly', () => {
    const data = [{ x: 'Food', y: 100 }, { x: 'Transport', y: 200 }];
    const tree = render(<CategoryPieChart data={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
