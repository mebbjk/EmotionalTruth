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
        
        // FIX: Handle case where settingsData might be null to prevent crash.
        const safeSettingsData = settingsData || [];
        const settingsMap = new Map(safeSettingsData.map(s => [s.key, s.value]));
        setLogo(String(settingsMap.get('logo_url') || ''));
        // Admin password is no longer stored in the 'settings' table.

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
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
    
    if (error || !user) {
        console.log(`Login failed for user: ${username}`);
        return false;
    }
    
    // Ensure that login via admin form is only for the actual admin role
    if (username.toLowerCase() === 'admin' && user.role !== 'admin') {
        console.error("Login attempt for admin username without admin role.");
        return false;
    }
    
    const userToStore = { ...user };
    delete userToStore.password;
    setCurrentUser(userToStore);
    sessionStorage.setItem('currentUser', JSON.stringify(userToStore));
    return true;
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
    const { error } = await supabase.from('users').update({ password: newPassword }).eq('username', 'admin');
    if (error) throw error;
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

  const uploadFile = async (bucket: string, file: File): Promise<string> => {
    // Create a URL-safe and unique file name
    const lastDot = file.name.lastIndexOf('.');
    const fileExt = lastDot > -1 ? file.name.substring(lastDot + 1) : '';
    const baseName = lastDot > -1 ? file.name.substring(0, lastDot) : file.name;
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    const fileName = `${cleanBaseName}_${Date.now()}${fileExt ? '.' + fileExt : ''}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
    });

    if (uploadError) {
        console.error('Supabase Upload Error:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    
    if (!data.publicUrl) {
        throw new Error('File was uploaded, but could not retrieve its public URL.');
    }
    
    return data.publicUrl;
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
    uploadFile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};