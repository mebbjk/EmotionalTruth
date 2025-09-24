// Created the Header component.
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { LANGUAGES } from '../../constants';
import { LanguageCode } from '../../types';
import { UserIcon } from '../icons/UserIcon';

export const Header: React.FC = () => {
  const { currentUser, logout, language, setLanguage, logo } = useAppContext();
  const t = useTranslator();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <img src={logo} alt="Site Logo" className="h-10" />
            <div>
                <h1 className="text-xl font-bold text-gray-800">Emotional Truth | ET</h1>
                <p className="text-sm text-gray-500">Feel ET, Dream ET, Explore ET</p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="w-32"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </Select>
          
          {currentUser && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-800 font-medium">
                {t('welcomeUser').replace('{{username}}', currentUser.username)}
              </span>
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <UserIcon className="h-10 w-10 text-gray-500 bg-gray-200 rounded-full p-1" />
              )}
              <Button onClick={logout} variant="secondary">
                {t('logout')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
