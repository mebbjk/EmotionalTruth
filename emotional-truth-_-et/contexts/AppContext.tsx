import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, User, Ad, LanguageCode } from '../types';
import { supabase } from '../services/supabase';

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [logo, setLogo] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang as LanguageCode) || 'en';
  });

  // Fetch all data from Supabase on initial load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          { data: usersData, error: usersError },
          { data: adsData, error: adsError },
          { data: settingsData, error: settingsError }
        ] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('ads').select('*'),
          supabase.from('settings').select('key, value')
        ]);

        if (usersError) throw usersError;
        if (adsError) throw adsError;
        if (settingsError) throw settingsError;

        setUsers(usersData || []);
        setAds(adsData || []);
        
        const settingsMap = new Map(settingsData?.map(s => [s.key, s.value]));
        // FIX: Explicitly convert settings value to string to prevent type errors.
        setLogo(String(settingsMap.get('logo_url') || ''));
        // FIX: Explicitly convert settings value to string to prevent type errors.
        setAdminPassword(String(settingsMap.get('admin_password') || ''));

        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    let user: User | null = null;
    
    if (username.toLowerCase() === 'admin') {
      if (password === adminPassword) {
         const { data, error } = await supabase.from('users').select('*').eq('username', 'admin').single();
         if (error) console.error("Admin user not found:", error);
         user = data;
      }
    } else {
       const { data, error } = await supabase.from('users').select('*').eq('username', username).eq('password', password).single();
       if (error) console.error("Error fetching user:", error);
       user = data;
    }
    
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

  const addUser = async (userData: Omit<User, 'id'>) => {
    const { data, error } = await supabase.from('users').insert([userData]).select();
    if (error) throw error;
    if (data) setUsers([...users, data[0]]);
  };

  const updateUser = async (updatedUser: User) => {
    const { id, ...updateData } = updatedUser;
    const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select();
    if (error) throw error;
    if (data) {
      setUsers(users.map(u => u.id === id ? data[0] : u));
      if (currentUser?.id === id) {
        const userToStore = data[0];
        delete userToStore.password;
        setCurrentUser(userToStore);
        sessionStorage.setItem('currentUser', JSON.stringify(userToStore));
      }
    }
  };

  const deleteUser = async (userId: number) => {
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) throw error;
    setUsers(users.filter(u => u.id !== userId));
  };
  
  const updateSiteLogo = async (logoUrl: string) => {
    const { error } = await supabase.from('settings').update({ value: logoUrl }).eq('key', 'logo_url');
    if (error) throw error;
    setLogo(logoUrl);
  };

  const updateAdminPassword = async (newPassword: string) => {
    const { error } = await supabase.from('settings').update({ value: newPassword }).eq('key', 'admin_password');
    if (error) throw error;
    setAdminPassword(newPassword);
  };

  const addAd = async (adData: Omit<Ad, 'id'>) => {
    const { data, error } = await supabase.from('ads').insert([adData]).select();
    if (error) throw error;
    if (data) setAds([...ads, data[0]]);
  };

  const updateAd = async (updatedAd: Ad) => {
    const { id, ...updateData } = updatedAd;
    const { data, error } = await supabase.from('ads').update(updateData).eq('id', id).select();
    if (error) throw error;
    if (data) setAds(ads.map(ad => ad.id === id ? data[0] : ad));
  };

  const deleteAd = async (adId: number) => {
    const { error } = await supabase.from('ads').delete().eq('id', adId);
    if (error) throw error;
    setAds(ads.filter(ad => ad.id !== adId));
  };

  const value: AppContextType = {
    currentUser,
    users,
    ads,
    logo,
    language,
    isLoading,
    login,
    logout,
    setLanguage,
    addUser,
    updateUser,
    deleteUser,
    updateSiteLogo,
    updateAdminPassword,
    addAd,
    updateAd,
    deleteAd,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
