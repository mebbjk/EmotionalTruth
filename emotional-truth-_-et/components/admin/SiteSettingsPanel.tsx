import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const LogoSettings: React.FC = () => {
    const { logo, updateSiteLogo } = useAppContext();
    const t = useTranslator();
    const [logoUrl, setLogoUrl] = useState(logo);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            await updateSiteLogo(logoUrl);
            setMessage(t('logoUpdated'));
        } catch (error) {
            setMessage('Error updating logo.');
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <form onSubmit={handleUpdate} className="space-y-4">
            <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">{t('siteLogoUrl')}</label>
                <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} disabled={isLoading} />
            </div>
            {logoUrl && (
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{t('imagePreview')}</p>
                    <img src={logoUrl} alt="Logo Preview" className="h-16 border p-1 rounded-md bg-gray-50" />
                </div>
            )}
            <div>
                <Button type="submit" disabled={isLoading}>{isLoading ? t('updating') : t('updateSettings')}</Button>
            </div>
            {message && <p className="text-green-600 mt-2">{message}</p>}
        </form>
    );
};

const PasswordSettings: React.FC = () => {
    const { updateAdminPassword } = useAppContext();
    const t = useTranslator();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            return;
        }
        setError('');
        setMessage('');
        setIsLoading(true);
        try {
            await updateAdminPassword(newPassword);
            setMessage(t('passwordUpdated'));
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError('Error updating password.');
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setMessage('');
                setError('');
            }, 3000);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('newPassword')}</label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('confirmPassword')}</label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} required />
            </div>
            <div>
                 <Button type="submit" disabled={isLoading}>{isLoading ? t('updating') : t('changePassword')}</Button>
            </div>
            {message && <p className="text-green-600 mt-2">{message}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
    );
};

export const SiteSettingsPanel: React.FC = () => {
  const t = useTranslator();
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">{t('uploadLogo')}</h3>
        <LogoSettings />
      </div>
      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">{t('changePassword')}</h3>
        <PasswordSettings />
      </div>
    </div>
  );
};
