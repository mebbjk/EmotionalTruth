import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const SiteSettingsPanel: React.FC = () => {
  const { logo, updateSiteLogo } = useAppContext();
  const t = useTranslator();
  const [logoUrl, setLogoUrl] = useState(logo);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteLogo(logoUrl);
    setMessage(t('settingsUpdated'));
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{t('siteSettings')}</h3>
      <form onSubmit={handleUpdate} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">{t('siteLogoUrl')}</label>
          <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
        </div>
        {logoUrl && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">{t('imagePreview')}</p>
            <img src={logoUrl} alt="Logo Preview" className="h-16 border p-1 rounded-md" />
          </div>
        )}
        <div>
          <Button type="submit">{t('updateSettings')}</Button>
        </div>
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};
