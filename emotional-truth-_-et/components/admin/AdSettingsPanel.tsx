import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { Ad } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';

const AdForm: React.FC<{ ad?: Ad; onSave: (ad: Ad | Omit<Ad, 'id'>) => Promise<void>; onCancel: () => void }> = ({ ad, onSave, onCancel }) => {
    const t = useTranslator();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: ad?.title || '',
        imageUrl: ad?.imageUrl || '',
        link: ad?.link || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(ad ? { ...ad, ...formData } : formData);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" value={formData.title} onChange={handleChange} placeholder={t('title')} required disabled={isLoading} />
            <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder={t('imageUrl')} required disabled={isLoading} />
            <Input name="link" value={formData.link} onChange={handleChange} placeholder={t('link')} required disabled={isLoading} />
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>{t('cancel')}</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? t('saving') : t('save')}</Button>
            </div>
        </form>
    );
};

export const AdSettingsPanel: React.FC = () => {
  const { ads, addAd, updateAd, deleteAd } = useAppContext();
  const t = useTranslator();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | undefined>(undefined);
  const [deletingAd, setDeletingAd] = useState<Ad | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddAd = () => {
    setEditingAd(undefined);
    setIsModalOpen(true);
  };

  const handleEditAd = (ad: Ad) => {
    setEditingAd(ad);
    setIsModalOpen(true);
  };

  const handleSaveAd = async (ad: Ad | Omit<Ad, 'id'>) => {
    if ('id' in ad) {
        await updateAd(ad as Ad);
    } else {
        await addAd(ad as Omit<Ad, 'id'>);
    }
    setIsModalOpen(false);
    setEditingAd(undefined);
  };

  const handleDeleteConfirm = (ad: Ad) => {
    setDeletingAd(ad);
  };

  const handleDelete = async () => {
    if (deletingAd) {
        setIsDeleting(true);
        try {
            await deleteAd(deletingAd.id);
        } finally {
            setIsDeleting(false);
            setDeletingAd(null);
        }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{t('adList')}</h3>
        <Button onClick={handleAddAd}>{t('addAd')}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b text-left">{t('title')}</th>
              <th className="py-2 px-4 border-b text-left">{t('imageUrl')}</th>
              <th className="py-2 px-4 border-b text-left">{t('link')}</th>
              <th className="py-2 px-4 border-b text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(ad => (
              <tr key={ad.id}>
                <td className="py-2 px-4 border-b">{ad.title}</td>
                <td className="py-2 px-4 border-b truncate max-w-xs">{ad.imageUrl}</td>
                <td className="py-2 px-4 border-b truncate max-w-xs">{ad.link}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditAd(ad)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                    <button onClick={() => handleDeleteConfirm(ad)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAd ? t('editAd') : t('addAd')}>
        <AdForm ad={editingAd} onSave={handleSaveAd} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!deletingAd} onClose={() => setDeletingAd(null)} title={t('deleteAdConfirmation')}>
          <div>{t('deleteAdConfirmation')}</div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secondary" onClick={() => setDeletingAd(null)} disabled={isDeleting}>{t('cancel')}</Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? t('deleting') : t('delete')}</Button>
          </div>
      </Modal>
    </div>
  );
};
