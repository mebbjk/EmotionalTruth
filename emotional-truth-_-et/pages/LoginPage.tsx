// Created the LoginPage component.
import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { AdSlider } from '../components/common/AdSlider';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <AdSlider />
      <main className="flex-grow flex items-center justify-center p-4">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};