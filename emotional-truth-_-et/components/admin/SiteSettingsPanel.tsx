import React, { useState, useCallback } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const SiteSettingsPanel: React.FC = () => {
  const { logo, updateLogo, updateAdminPassword } = useAppContext();
  const t = useTranslator();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(logo);
  const [message, setMessage] = useState('');

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage(t('passwordsDoNotMatch'));
      return;
    }
    if (newPassword) {
      updateAdminPassword(newPassword);
      setMessage(t('passwordUpdated'));
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    }
  };
  
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = () => {
    if (logoPreview && logoPreview !== logo) {
      updateLogo(logoPreview);
      setMessage(t('logoUpdated'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      {/* Change Password Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{t('changePassword')}</h3>
        <form onSubmit={handlePasswordSave} className="space-y-4 max-w-sm">
          <Input 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('newPassword')}
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('confirmPassword')}
          />
          <Button type="submit">{t('save')}</Button>
        </form>
      </div>

      {/* Change Logo Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">{t('uploadLogo')}</h3>
        <div className="flex items-center space-x-4">
          {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-12 border p-1 rounded-md" />}
          <Input 
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleLogoFileChange}
            className="max-w-xs"
          />
          <Button onClick={handleLogoUpload}>{t('uploadLogo')}</Button>
        </div>
      </div>
      
      {message && <p className="text-green-600 mt-4">{message}</p>}
    </div>
  );
};