import { render, screen } from '@testing-library/react';
import App from './App';

it('renders Login component by default', () => {
  render(<App />);
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
