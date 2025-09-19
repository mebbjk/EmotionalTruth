import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppContextProvider } from './contexts/AppContext';
import { useAppContext } from './hooks/useAppContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import './index.css'; // <-- ADD THIS LINE

const App: React.FC = () => {
  const { currentUser } = useAppContext();
  
  return currentUser ? <DashboardPage /> : <LoginPage />;
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </React.StrictMode>
  );
}
