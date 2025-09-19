import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { AdSlider } from '../components/common/AdSlider';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { UserDashboard } from '../components/dashboard/UserDashboard';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <AdSlider />
      <main className="flex-grow container mx-auto p-4">
        {currentUser?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
      </main>
      <Footer />
    </div>
  );
};
