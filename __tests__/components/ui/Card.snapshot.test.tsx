import { render } from '@testing-library/react-native';
import { Card } from '@/components/ui/Card';
import { useColorScheme } from 'react-native';

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useColorScheme: jest.fn(),
}));

describe('Card - Snapshot', () => {
  it('renders correctly in light mode', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const tree = render(<Card>Light Card</Card>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly in dark mode', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    const tree = render(<Card>Dark Card</Card>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
