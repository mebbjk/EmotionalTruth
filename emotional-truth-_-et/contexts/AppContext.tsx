import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, User, Ad, LanguageCode } from '../types';

// Mock Data
const MOCK_USERS: User[] = [
  { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: 'admin', videoUrl: '' },
  { id: 2, username: 'user', password: 'user', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'user', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
];

const MOCK_ADS: Ad[] = [
    { id: 1, title: 'Ad 1: Discover Our New Product', imageUrl: 'https://via.placeholder.com/800x200/FF0000/FFFFFF?text=Ad+1', link: '#' },
    { id: 2, title: 'Ad 2: Special Summer Sale', imageUrl: 'https://via.placeholder.com/800x200/00FF00/FFFFFF?text=Ad+2', link: '#' },
    { id: 3, title: 'Ad 3: Join Our Community', imageUrl: 'https://via.placeholder.com/800x200/0000FF/FFFFFF?text=Ad+3', link: '#' },
];

const MOCK_LOGO = 'https://via.placeholder.com/150x50/CCCCCC/FFFFFF?text=ET+Logo';


export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [ads, setAds] = useState<Ad[]>(MOCK_ADS);
  const [logo, setLogo] = useState<string>(MOCK_LOGO);
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang as LanguageCode) || 'en';
  });

  // Load current user from session storage
  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const userToStore = { ...user };
      delete userToStore.password;
      setCurrentUser(userToStore);
      sessionStorage.setItem('currentUser', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const addUser = async (user: Omit<User, 'id' | 'password'> & { password?: string }) => {
    const newUser: User = { ...user, id: Date.now(), role: 'user', videoUrl: user.videoUrl || '' };
    if(user.password) newUser.password = user.password;
    setUsers([...users, newUser]);
  };

  const updateUser = async (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    if (currentUser?.id === updatedUser.id) {
        const userToStore = { ...currentUser, ...updatedUser };
        delete userToStore.password;
        setCurrentUser(userToStore);
        sessionStorage.setItem('currentUser', JSON.stringify(userToStore));
    }
  };

  const deleteUser = async (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
  };
  
  const updateSiteLogo = async (logoUrl: string) => {
    setLogo(logoUrl);
  };

  const addAd = async (ad: Omit<Ad, 'id'>) => {
    const newAd: Ad = { ...ad, id: Date.now() };
    setAds([...ads, newAd]);
  };

  const updateAd = async (updatedAd: Ad) => {
    setAds(ads.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
  };

  const deleteAd = async (adId: number) => {
    setAds(ads.filter(ad => ad.id !== adId));
  };

  const value: AppContextType = {
    currentUser,
    users,
    ads,
    logo,
    language,
    login,
    logout,
    setLanguage,
    addUser,
    updateUser,
    deleteUser,
    updateSiteLogo,
    addAd,
    updateAd,
    deleteAd,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
