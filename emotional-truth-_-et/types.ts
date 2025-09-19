export type LanguageCode = 'en' | 'tr' | 'de' | 'fr' | 'it' | 'es' | 'pt' | 'pl' | 'cs' | 'bs' | 'ar' | 'fa' | 'ku' | 'ru' | 'zh' | 'ja' | 'ko';

export interface Language {
  code: LanguageCode;
  name: string;
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  videoUrl?: string;
}

export interface Ad {
    id: number;
    title: string;
    imageUrl: string;
    link: string;
}

export interface TranslationKeys {
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
  yourVideo: string;
  noVideoUrl: string;
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
  videoUrl: string;
  actions: string;
  cancel: string;
  save: string;
  delete: string;
  deleteUserConfirmation: string;
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
  forgotPassword: string;
  forgotPasswordPrompt: string;
  emailForReset: string;
  sendResetLink: string;
  resetLinkSent: string;
  userNotFound: string;
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
}

export type AppContextType = {
    currentUser: User | null;
    users: User[];
    ads: Ad[];
    logo: string;
    language: LanguageCode;
    login: (username: string, password: string, isAdmin: boolean) => boolean;
    logout: () => void;
    setLanguage: (language: LanguageCode) => void;
    updateLogo: (logoUrl: string) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: number) => void;
    updateAd: (ad: Ad) => void;
    addUser: (user: Omit<User, 'id' | 'role'>) => void;
    findUserByEmail: (email: string) => User | undefined;
    updateAdminPassword: (newPassword: string) => boolean;
};