// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from './store/store';
import Header from './components/shared/Header';
import { Root } from 'react-dom/client';

const AppWrapper = () => {
  const isAuthenticated = useSelector((state:RootState) => state.auth.isAuthenticated);

  return (
    <>
      {isAuthenticated && <Header />}
      <AppRoutes />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
