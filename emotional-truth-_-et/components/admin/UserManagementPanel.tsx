import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { User } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';

const UserForm: React.FC<{ user?: User; onSave: (user: User | Omit<User, 'id'>) => Promise<void>; onCancel: () => void }> = ({ user, onSave, onCancel }) => {
    const t = useTranslator();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        videoUrl: user?.videoUrl || '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (user) {
                await onSave({ ...user, ...formData });
            } else {
                await onSave({ ...formData, role: 'user' });
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="username" value={formData.username} onChange={handleChange} placeholder={t('usernameLabel')} required disabled={isLoading} />
            <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder={t('firstName')} required disabled={isLoading} />
            <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder={t('lastName')} required disabled={isLoading} />
            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t('email')} required disabled={isLoading} />
            <Input name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder={t('videoUrl')} disabled={isLoading} />
            {!user && <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder={t('passwordLabel')} required disabled={isLoading} />}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>{t('cancel')}</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? t('saving') : t('save')}</Button>
            </div>
        </form>
    );
};


export const UserManagementPanel: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useAppContext();
  const t = useTranslator();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddUser = () => {
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (user: User | Omit<User, 'id'>) => {
    if ('id' in user) {
        await updateUser(user as User);
    } else {
        // FIX: The Omit utility type requires a union of keys as its second argument.
        await addUser(user as Omit<User, 'id' | 'password'> & {password: string});
    }
    setIsModalOpen(false);
    setEditingUser(undefined);
  };

  const handleDeleteConfirm = (user: User) => {
    setDeletingUser(user);
  };

  const handleDelete = async () => {
    if (deletingUser) {
        setIsDeleting(true);
        try {
            await deleteUser(deletingUser.id);
        } finally {
            setIsDeleting(false);
            setDeletingUser(null);
        }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{t('userList')}</h3>
        <Button onClick={handleAddUser}>{t('addUser')}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b text-left">{t('usernameLabel')}</th>
              <th className="py-2 px-4 border-b text-left">{t('firstName')}</th>
              <th className="py-2 px-4 border-b text-left">{t('lastName')}</th>
              <th className="py-2 px-4 border-b text-left">{t('email')}</th>
              <th className="py-2 px-4 border-b text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.role !== 'admin').map(user => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.firstName}</td>
                <td className="py-2 px-4 border-b">{user.lastName}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                    <button onClick={() => handleDeleteConfirm(user)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? t('editUser') : t('addUser')}>
        <UserForm user={editingUser} onSave={handleSaveUser} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!deletingUser} onClose={() => setDeletingUser(null)} title={t('deleteUserConfirmation')}>
          <div>{t('deleteUserConfirmation')}</div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secondary" onClick={() => setDeletingUser(null)} disabled={isDeleting}>{t('cancel')}</Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? t('deleting') : t('delete')}</Button>
          </div>
      </Modal>

    </div>
  );
};