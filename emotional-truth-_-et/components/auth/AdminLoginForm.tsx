import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LockIcon } from '../icons/LockIcon';
import { UserIcon } from '../icons/UserIcon';

export const AdminLoginForm: React.FC = () => {
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
      const success = await login('admin', password);
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
    <div className="w-full bg-white p-8 rounded-b-lg shadow-lg border border-t-0 border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('adminLoginTitle')}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="block text-sm font-medium text-gray-700 mb-1">
              {t('usernameLabel')}
            </label>
            <Input
              id="admin-username"
              type="text"
              icon={<UserIcon className="w-5 h-5" />}
              value="admin"
              required
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('passwordLabel')}
            </label>
            <Input
              id="admin-password"
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
