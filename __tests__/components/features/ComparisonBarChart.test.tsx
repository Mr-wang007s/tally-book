import { render } from '@testing-library/react-native';
import { ComparisonBarChart } from '@/components/features/ComparisonBarChart';

describe('ComparisonBarChart - Snapshot', () => {
  it('renders correctly', () => {
    const data = [{ x: 'A', y: 100 }, { x: 'B', y: 200 }];
    const tree = render(<ComparisonBarChart data={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
