import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserIcon } from '../icons/UserIcon';
import { LockIcon } from '../icons/LockIcon';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const t = useTranslator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (!success) {
        setError(t('invalidCredentials'));
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('loginTitle')}</h2>
        <p className="text-gray-500 mt-2">{t('loginSubtitle')}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              {t('usernameLabel')}
            </label>
            <Input
              id="username"
              type="text"
              icon={<UserIcon className="w-5 h-5" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 mb-1">
              {t('passwordLabel')}
            </label>
            <Input
              id="password-login"
              type="password"
              icon={<LockIcon className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
        <div className="mt-6">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('loggingIn') : t('login')}
          </Button>
        </div>
      </form>
    </div>
  );
};
