import { render, screen } from '@testing-library/react';
import AppRoutes from '../src/routes/AppRoutes';
import { Provider } from 'react-redux';
import { store } from '../src/store/store'; // Adjust the path as needed
import { BrowserRouter } from 'react-router-dom';

test('renders login route initially', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
