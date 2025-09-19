import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppContextProvider } from './contexts/AppContext';
import { useAppContext } from './hooks/useAppContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import './index.css';

const AppRouter: React.FC = () => {
  const { currentUser, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return currentUser ? <DashboardPage /> : <LoginPage />;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  </React.StrictMode>
);
