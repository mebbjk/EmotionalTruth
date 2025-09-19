import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { User } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';

const initialUserState: Omit<User, 'id' | 'role' | 'password'> & { password?: string } = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  videoUrl: '',
};

export const UserManagementPanel: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useAppContext();
  const t = useTranslator();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | (Omit<User, 'id' | 'role' | 'password'> & { password?: string })>(initialUserState);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const openAddModal = () => {
    setCurrentUser(initialUserState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleSaveUser = () => {
    if (isEditing) {
      updateUser(currentUser as User);
    } else {
      addUser(currentUser as Omit<User, 'id' | 'role'>);
    }
    handleCloseModal();
  };
  
  const handleDeleteUser = () => {
    if (userToDelete) {
        deleteUser(userToDelete.id);
    }
    handleCloseModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{t('userList')}</h3>
        <Button onClick={openAddModal}>{t('addUser')}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">{t('firstName')}</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">{t('lastName')}</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">{t('email')}</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">{t('videoUrl')}</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-sm text-gray-700">{user.firstName}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">{user.lastName}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">{user.email}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700 truncate max-w-xs">{user.videoUrl}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  <div className="flex space-x-2">
                    <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-800"><EditIcon className="w-5 h-5" /></button>
                    <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? t('editUser') : t('addUser')}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>{t('cancel')}</Button>
            <Button onClick={handleSaveUser}>{t('save')}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input name="username" value={'username' in currentUser ? currentUser.username : ''} onChange={handleChange} placeholder={t('usernameLabel')} disabled={isEditing} />
          <Input name="firstName" value={'firstName' in currentUser ? currentUser.firstName : ''} onChange={handleChange} placeholder={t('firstName')} />
          <Input name="lastName" value={'lastName' in currentUser ? currentUser.lastName : ''} onChange={handleChange} placeholder={t('lastName')} />
          <Input name="email" value={'email' in currentUser ? currentUser.email : ''} onChange={handleChange} placeholder={t('email')} />
          <Input name="videoUrl" value={'videoUrl' in currentUser ? currentUser.videoUrl : ''} onChange={handleChange} placeholder={t('videoUrl')} />
          {!isEditing && <Input name="password" type="password" value={('password' in currentUser ? currentUser.password : '') || ''} onChange={handleChange} placeholder={t('passwordLabel')} />}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        title={t('delete')}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>{t('cancel')}</Button>
            <Button variant="danger" onClick={handleDeleteUser}>{t('delete')}</Button>
          </div>
        }
      >
        <p>{t('deleteUserConfirmation')}</p>
      </Modal>
    </div>
  );
};