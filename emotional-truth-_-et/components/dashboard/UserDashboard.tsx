// Created the UserDashboard component.
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { UserIcon } from '../icons/UserIcon';

export const UserDashboard: React.FC = () => {
  const { currentUser } = useAppContext();
  const t = useTranslator();
  
  if (!currentUser || currentUser.role !== 'user') return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('userDashboardTitle')}</h2>
      <div className="flex items-center space-x-4">
        {currentUser.avatarUrl ? (
          <img src={currentUser.avatarUrl} alt="Your Avatar" className="h-24 w-24 rounded-full object-cover" />
        ) : (
          <UserIcon className="h-24 w-24 text-gray-400 bg-gray-100 rounded-full p-4" />
        )}
        <div>
          <h3 className="text-xl font-semibold text-gray-700">
            {t('welcomeUser').replace('{{username}}', `${currentUser.firstName} ${currentUser.lastName}`)}
          </h3>
          <p className="text-gray-500">{currentUser.email}</p>
        </div>
      </div>
    </div>
  );
};
