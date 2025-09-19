import { useAppContext } from './useAppContext';
import { getTranslator } from '../services/translations';

export const useTranslator = () => {
  const { language } = useAppContext();
  return getTranslator(language);
};
