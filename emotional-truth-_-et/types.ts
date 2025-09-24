export type LanguageCode = 'en' | 'tr' | 'de' | 'fr' | 'it' | 'es' | 'pt' | 'pl' | 'cs' | 'bs' | 'ar' | 'fa' | 'ku' | 'ru' | 'zh' | 'ja' | 'ko';

export interface Language {
  code: LanguageCode;
  name: string;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
}

export interface Ad {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
}

export interface AppContextType {
    currentUser: User | null;
    users: User[];
    ads: Ad[];
    logo: string;
    language: LanguageCode;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    setLanguage: (language: LanguageCode) => void;
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    deleteUser: (userId: number) => Promise<void>;
    updateSiteLogo: (logoUrl: string) => Promise<void>;
    updateAdminPassword: (newPassword: string) => Promise<void>;
    addAd: (ad: Omit<Ad, 'id'>) => Promise<void>;
    updateAd: (ad: Ad) => Promise<void>;
    deleteAd: (adId: number) => Promise<void>;
    uploadFile: (bucket: string, file: File) => Promise<string>;
}

export type TranslationKeys = {
  welcomeUser: string;
  logout: string;
  login: string;
  loginTitle: string;
  loginSubtitle: string;
  usernameLabel: string;
  passwordLabel: string;
  adminLogin: string;
  adminLoginTitle: string;
  invalidCredentials: string;
  invalidAdminPassword: string;
  userDashboardTitle: string;
  adminPanelTitle: string;
  userManagement: string;
  siteSettings: string;
  adSettings: string;
  userList: string;
  addUser: string;
  editUser: string;
  firstName: string;
  lastName: string;
  email: string;
  actions: string;
  cancel: string;
  save: string;
  delete: string;
  deleteUserConfirmation: string;
  forgotPassword: string;
  forgotPasswordPrompt: string;
  emailForReset: string;
  sendResetLink: string;
  resetLinkSent: string;
  userNotFound: string;
  siteLogoUrl: string;
  updateSettings: string;
  settingsUpdated: string;
  adList: string;
  addAd: string;
  editAd: string;
  title: string;
  imageUrl: string;
  link: string;
  deleteAdConfirmation: string;
  uploadImage: string;
  imagePreview: string;
  changePassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordUpdated: string;
  passwordsDoNotMatch: string;
  uploadLogo: string;
  logoUpdated: string;
  changeImage: string;
  uploadedImage: string;
  adUpdatedSuccess: string;
  loggingIn: string;
  saving: string;
  deleting: string;
  updating: string;
  loading: string;
  avatar: string;
  uploadAvatar: string;
};
