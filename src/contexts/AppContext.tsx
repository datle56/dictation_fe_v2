import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Language, Category, Lesson, Page } from '../types/types';

interface AppContextType {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Navigation state
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  
  // Selection state
  selectedLanguage: Language | null;
  setSelectedLanguage: (language: Language) => void;
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
  selectedLesson: Lesson | null;
  setSelectedLesson: (lesson: Lesson | null) => void;
  
  // Actions
  handleLogin: (email: string, password: string) => void;
  handleRegister: (name: string, email: string, password: string) => void;
  handleLogout: () => void;
  handleBack: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Implementation will be provided by parent component
    console.log('Login:', email, password);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Implementation will be provided by parent component
    console.log('Register:', name, email, password);
  };

  const handleLogout = () => {
    // Implementation will be provided by parent component
    console.log('Logout');
  };

  const handleBack = () => {
    // Implementation will be provided by parent component
    console.log('Back');
  };

  const value: AppContextType = {
    user,
    setUser,
    currentPage,
    setCurrentPage,
    selectedLanguage,
    setSelectedLanguage,
    selectedCategory,
    setSelectedCategory,
    selectedLesson,
    setSelectedLesson,
    handleLogin,
    handleRegister,
    handleLogout,
    handleBack,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
