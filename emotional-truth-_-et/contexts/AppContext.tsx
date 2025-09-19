import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { User, LanguageCode, Ad, AppContextType } from '../types';

// Mock Data with working image URLs
const MOCK_USERS: User[] = [
  // Passwords are removed from client-side mock data for security
  { id: 1, username: 'admin', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: 'admin' },
  { id: 2, username: 'user1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'user', videoUrl: 'https://www.youtube.com/watch?v=M7FIvfx5J10' },
  { id: 3, username: 'user2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', role: 'user', videoUrl: 'https://www.youtube.com/watch?v=z_AbfPXTKms' },
];

const MOCK_ADS: Ad[] = [
  { id: 1, title: 'Unbeatable Deals Just for You', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop', link: 'https://example.com/deal/1' },
  { id: 2, title: 'Discover Amazing Products', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop', link: 'https://example.com/product/2' },
  { id: 3, title: 'Limited Time Offer!', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', link: 'https://example.com/offer/3' },
];


export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [ads, setAds] = useState<Ad[]>(MOCK_ADS);
  const [logo, setLogo] = useState<string>('https://i.imgur.com/gCe1sV2.png'); // Default working logo
  const [adminPassword, setAdminPassword] = useState('adminpassword'); // In-memory admin password

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang as LanguageCode) || 'en';
  });

  const setLanguage = useCallback((language: LanguageCode) => {
    localStorage.setItem('language', language);
    setLanguageState(language);
  }, []);

  const login = useCallback((username: string, password: string, isAdmin: boolean): boolean => {
    if (isAdmin) {
        if (username === 'admin' && password === adminPassword) {
            const adminUser = users.find(u => u.role === 'admin');
            if(adminUser) {
                setCurrentUser(adminUser);
                return true;
            }
        }
        return false;
    }

    // For demo purposes, allow login with correct username and any non-empty password
    const user = users.find(u => u.username === username && u.role === 'user');
    if (user && password) { // Check if password is not empty
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users, adminPassword]);


  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const findUserByEmail = useCallback((email: string) => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }, [users]);
  
  const updateLogo = useCallback((logoUrl: string) => {
    setLogo(logoUrl);
  }, []);
  
  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(user => (user.id === updatedUser.id ? updatedUser : user)));
  }, []);

  const deleteUser = useCallback((userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  }, []);

  const updateAd = useCallback((updatedAd: Ad) => {
    setAds(prev => prev.map(ad => (ad.id === updatedAd.id ? updatedAd : ad)));
  }, []);
  
  const addUser = useCallback((user: Omit<User, 'id' | 'role'>) => {
    const newUser: User = { ...user, id: Date.now(), role: 'user' };
    setUsers(prev => [...prev, newUser]);
  }, []);

  const updateAdminPassword = useCallback((newPassword: string) => {
    setAdminPassword(newPassword);
    return true; // In a real app, you'd confirm this with a backend.
  }, []);

  const value: AppContextType = {
    currentUser,
    users,
    ads,
    logo,
    language,
    login,
    logout,
    setLanguage,
    updateLogo,
    updateUser,
    deleteUser,
    updateAd,
    addUser,
    findUserByEmail,
    updateAdminPassword,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};