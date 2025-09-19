// Created the AdminDashboard component.
import React, { useState } from 'react';
import { UserManagementPanel } from './UserManagementPanel';
import { SiteSettingsPanel } from './SiteSettingsPanel';
import { AdSettingsPanel } from './AdSettingsPanel';
import { useTranslator } from '../../hooks/useTranslator';

type Tab = 'users' | 'site' | 'ads';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const t = useTranslator();
  
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagementPanel />;
      case 'site':
        return <SiteSettingsPanel />;
      case 'ads':
        return <AdSettingsPanel />;
      default:
        return null;
    }
  };

  const getTabClass = (tab: Tab) => 
    `px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200 ${
      activeTab === tab 
      ? 'border-b-2 border-blue-600 text-blue-600' 
      : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
    }`;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">{t('adminPanelTitle')}</h2>
      <div className="border-b mb-4">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('users')} className={getTabClass('users')}>
            {t('userManagement')}
          </button>
          <button onClick={() => setActiveTab('site')} className={getTabClass('site')}>
            {t('siteSettings')}
          </button>
          <button onClick={() => setActiveTab('ads')} className={getTabClass('ads')}>
            {t('adSettings')}
          </button>
        </nav>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};