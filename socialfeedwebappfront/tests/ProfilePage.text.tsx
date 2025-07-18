import { render, screen } from '@testing-library/react';
import ProfilePage from '../src/pages/ProfilePage';

test('renders profile details', () => {
  localStorage.setItem('user', JSON.stringify({
    username: 'john',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: '',
  }));

  render(<ProfilePage />);
  expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  expect(screen.getByText(/username:/i)).toBeInTheDocument();
});
