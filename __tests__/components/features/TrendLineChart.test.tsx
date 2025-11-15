import { render } from '@testing-library/react-native';
import { TrendLineChart } from '@/components/features/TrendLineChart';

describe('TrendLineChart - Snapshot', () => {
  it('renders correctly', () => {
    const data = [{ x: new Date(), y: 100 }, { x: new Date(), y: 200 }];
    const tree = render(<TrendLineChart data={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
