import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { UserIcon } from '../icons/UserIcon';
import { LockIcon } from '../icons/LockIcon';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const { login, findUserByEmail } = useAppContext();
  const t = useTranslator();

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(username, password, false)) {
      setError(t('invalidCredentials'));
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login('admin', adminPassword, true)) {
        setIsAdminModalOpen(false);
    } else {
      setError(t('invalidAdminPassword'));
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    findUserByEmail(resetEmail); // Simulate checking
    setResetMessage(t('resetLinkSent'));
  };
  
  return (
    <>
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{t('loginTitle')}</h2>
        <p className="text-center text-gray-500 mb-6">{t('loginSubtitle')}</p>
        <form onSubmit={handleUserSubmit}>
          <div className="space-y-4">
            <Input
              icon={<UserIcon className="w-5 h-5" />}
              type="text"
              placeholder={t('usernameLabel')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-label={t('usernameLabel')}
            />
            <Input
              icon={<LockIcon className="w-5 h-5" />}
              type="password"
              placeholder={t('passwordLabel')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label={t('passwordLabel')}
            />
          </div>
          {error && !isAdminModalOpen && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <Button type="submit" className="w-full mt-6">
            {t('login')}
          </Button>
        </form>

        <div className="text-center mt-4">
            <button onClick={() => setIsAdminModalOpen(true)} className="text-sm text-gray-600 hover:text-blue-600 hover:underline">
                {t('adminLogin')}
            </button>
        </div>
        
        <div className="text-center mt-4">
            <button onClick={() => setIsForgotPasswordModalOpen(true)} className="text-sm text-gray-600 hover:text-blue-600">
                {t('forgotPassword')}
            </button>
        </div>
      </div>

      {/* Admin Login Modal */}
      <Modal
        isOpen={isAdminModalOpen}
        onClose={() => {setIsAdminModalOpen(false); setError('')}}
        title={t('adminLoginTitle')}
      >
        <form onSubmit={handleAdminSubmit}>
            <div className="space-y-4">
                 <Input
                    icon={<LockIcon className="w-5 h-5" />}
                    type="password"
                    placeholder={t('passwordLabel')}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    aria-label={t('passwordLabel')}
                    autoFocus
                />
            </div>
            {error && isAdminModalOpen && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
             <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="secondary" onClick={() => {setIsAdminModalOpen(false); setError('')}}>
                    {t('cancel')}
                </Button>
                <Button type="submit">
                    {t('login')}
                </Button>
            </div>
        </form>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        title={t('forgotPassword')}
      >
        <p className="text-gray-600 mb-4">{t('forgotPasswordPrompt')}</p>
        <form onSubmit={handleForgotPassword}>
          <Input
            type="email"
            placeholder={t('emailForReset')}
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          {resetMessage && <p className="text-green-600 text-sm mt-4">{resetMessage}</p>}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsForgotPasswordModalOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit">{t('sendResetLink')}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};