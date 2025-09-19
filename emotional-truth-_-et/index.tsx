import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppContextProvider } from './contexts/AppContext';
import { useAppContext } from './hooks/useAppContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import './index.css';

// This component uses the context and must be a child of the provider.
const AppRouter: React.FC = () => {
  const { currentUser } = useAppContext();
  return currentUser ? <DashboardPage /> : <LoginPage />;
};

// The root of the application
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  </React.StrictMode>
);
