import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types/types';
import { apiService } from '../services/api';

interface LanguagesContextType {
  languages: Language[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const LanguagesContext = createContext<LanguagesContextType | undefined>(undefined);

interface LanguagesProviderProps {
  children: ReactNode;
}

export function LanguagesProvider({ children }: LanguagesProviderProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchLanguages = async () => {
    if (hasFetched) return; // Chỉ fetch một lần duy nhất
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getLanguages();
      const transformedLanguages: Language[] = response.languages.map(lang => ({
        id: lang.id,
        code: lang.code,
        name: lang.name,
        native_name: lang.native_name,
        is_active: lang.is_active,
        flag: getFlagForLanguage(lang.code)
      }));
      setLanguages(transformedLanguages);
      setHasFetched(true);
    } catch (err) {
      console.error('Failed to fetch languages:', err);
      setError('Failed to load languages');
      // Fallback data
      setLanguages([
        { id: 1, code: 'en', name: 'English', native_name: 'English', is_active: true, flag: '🇺🇸' },
        { id: 2, code: 'vi', name: 'Vietnamese', native_name: 'Tiếng Việt', is_active: true, flag: '🇻🇳' },
        { id: 3, code: 'cn', name: 'Chinese', native_name: '中文', is_active: true, flag: '🇨🇳' },
        { id: 4, code: 'jp', name: 'Japanese', native_name: '日本語', is_active: true, flag: '🇯🇵' },
        { id: 5, code: 'kr', name: 'Korean', native_name: '한국어', is_active: true, flag: '🇰🇷' },
      ]);
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    setHasFetched(false);
    await fetchLanguages();
  };

  // Fetch languages khi component mount
  useEffect(() => {
    fetchLanguages();
  }, []);

  const value: LanguagesContextType = {
    languages,
    loading,
    error,
    refetch,
  };

  return (
    <LanguagesContext.Provider value={value}>
      {children}
    </LanguagesContext.Provider>
  );
}

export function useLanguages() {
  const context = useContext(LanguagesContext);
  if (context === undefined) {
    throw new Error('useLanguages must be used within a LanguagesProvider');
  }
  return context;
}

// Helper function to get flag emoji based on language code
const getFlagForLanguage = (code: string): string => {
  const flagMap: Record<string, string> = {
    'en': '🇺🇸',
    'vi': '🇻🇳',
    'cn': '🇨🇳',
    'jp': '🇯🇵',
    'kr': '🇰🇷',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'es': '🇪🇸',
  };
  return flagMap[code] || '🌍';
};
