import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { Ad } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { EditIcon } from '../icons/EditIcon';

export const AdSettingsPanel: React.FC = () => {
  const { ads, updateAd } = useAppContext();
  const t = useTranslator();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [adPreview, setAdPreview] = useState<string | null>(null);

  const openEditModal = (ad: Ad) => {
    setCurrentAd(ad);
    setAdPreview(ad.imageUrl);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAd(null);
    setAdPreview(null);
  };

  const handleSaveAd = () => {
    if (currentAd) {
      updateAd({ ...currentAd, imageUrl: adPreview || currentAd.imageUrl });
    }
    handleCloseModal();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentAd) {
        setCurrentAd(prev => ({ ...prev!, [name]: value }));
    }
  };
  
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{t('adList')}</h3>
      <div className="space-y-4">
        {ads.map(ad => (
          <div key={ad.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-4">
              <img src={ad.imageUrl} alt={ad.title} className="w-24 h-12 object-cover rounded-md"/>
              <div>
                <p className="font-semibold text-gray-800">{ad.title}</p>
                <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{ad.link}</a>
              </div>
            </div>
            <Button onClick={() => openEditModal(ad)} variant="secondary">
              <EditIcon className="w-5 h-5 mr-2" />
              {t('editAd')}
            </Button>
          </div>
        ))}
      </div>
      
      {/* Edit Ad Modal */}
      {currentAd && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={t('editAd')}
          footer={
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>{t('cancel')}</Button>
              <Button onClick={handleSaveAd}>{t('save')}</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input name="title" value={currentAd.title} onChange={handleChange} placeholder={t('title')} />
            <Input name="link" value={currentAd.link} onChange={handleChange} placeholder={t('link')} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('changeImage')}</label>
              <Input 
                type="file"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleImageFileChange}
              />
            </div>
            {adPreview && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('imagePreview')}</label>
                    <img src={adPreview} alt="Ad Preview" className="w-full h-32 object-cover rounded-md border" />
                </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};