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
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: user?.username || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        videoUrl: user?.videoUrl || '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const wantsToChangePassword = user ? isChangingPassword : true;

        if (wantsToChangePassword && formData.password !== formData.confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            return;
        }

        setIsLoading(true);
        try {
            // Create a clean data object to save
            const dataToSave: Omit<User, 'id' | 'role'> & { password?: string; role?: 'user' } = {
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                videoUrl: formData.videoUrl,
            };

            if (wantsToChangePassword && formData.password) {
                dataToSave.password = formData.password;
            }

            if (user) {
                await onSave({ ...user, ...dataToSave });
            } else {
                dataToSave.role = 'user';
                await onSave(dataToSave as Omit<User, 'id'>);
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
            
            {user && (
                <Button type="button" variant="secondary" onClick={() => { setIsChangingPassword(!isChangingPassword); setError(''); }}>
                    {isChangingPassword ? t('cancel') : t('changePassword')}
                </Button>
            )}

            {(!user || isChangingPassword) && (
                <>
                    <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder={t('newPassword')} required={!user || isChangingPassword} disabled={isLoading} />
                    <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder={t('confirmPassword')} required={!user || isChangingPassword} disabled={isLoading} />
                </>
            )}
            
            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <div className="flex justify-end space-x-2 pt-4">
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
        await updateUser(user);
    } else {
        await addUser(user);
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
            {users.map(user => (
              <tr key={user.id} className={user.role === 'admin' ? 'bg-gray-100' : ''}>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.firstName}</td>
                <td className="py-2 px-4 border-b">{user.lastName}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditUser(user)} 
                      className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      disabled={user.role === 'admin'}
                      aria-label={user.role === 'admin' ? "Cannot edit admin" : `Edit ${user.username}`}
                    >
                      <EditIcon />
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirm(user)} 
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      disabled={user.role === 'admin'}
                      aria-label={user.role === 'admin' ? "Cannot delete admin" : `Delete ${user.username}`}
                    >
                      <TrashIcon />
                    </button>
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