// Created the LoginPage component.
import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { AdminLoginForm } from '../components/auth/AdminLoginForm';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { AdSlider } from '../components/common/AdSlider';
import { useTranslator } from '../hooks/useTranslator';

export const LoginPage: React.FC = () => {
  const [formType, setFormType] = useState<'user' | 'admin'>('user');
  const t = useTranslator();

  const getTabClass = (type: 'user' | 'admin') => {
    return `w-1/2 py-3 text-center font-semibold cursor-pointer transition-colors duration-300 rounded-t-lg ${
      formType === type
        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
    }`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <AdSlider />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex">
            <button onClick={() => setFormType('user')} className={getTabClass('user')}>
              {t('login')}
            </button>
            <button onClick={() => setFormType('admin')} className={getTabClass('admin')}>
              {t('adminLogin')}
            </button>
          </div>
          {formType === 'user' ? <LoginForm /> : <AdminLoginForm />}
        </div>
      </main>
      <Footer />
    </div>
  );
};