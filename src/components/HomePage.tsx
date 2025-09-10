import React from 'react';
import { BookOpen, Users, Trophy, Globe, Youtube, Calendar, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Language, Category, User as UserType } from '../types/types';
import { useCategories } from '../hooks/useApi';
import { useLanguages } from '../contexts/LanguagesContext';
import { getIconComponent } from '../utils/iconMapping';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

interface HomePageProps {
  selectedLanguage: Language | null;
  onLanguageChange: (language: Language) => void;
  currentUser: UserType;
  onCategorySelect: (category: Category) => void;
  onYoutubeSelect: () => void;
  onRankingSelect: () => void;
  onHistorySelect: () => void;
  onPlaySelect: () => void;
  onLogout: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
}

export default function HomePage({
  selectedLanguage,
  onLanguageChange,
  currentUser,
  onCategorySelect,
  onYoutubeSelect,
  onRankingSelect,
  onHistorySelect,
  onPlaySelect,
  onLogout,
  onLogin,
  onRegister
}: HomePageProps) {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
  
  const { languages, loading: languagesLoading } = useLanguages();
  const { categories, loading: categoriesLoading } = useCategories(selectedLanguage?.id || null);
  
  // Auto-select English (ID: 1) when languages are loaded
  React.useEffect(() => {
    if (languages.length > 0 && !selectedLanguage) {
      const englishLanguage = languages.find(lang => lang.id === 1) || languages[0];
      onLanguageChange(englishLanguage);
    }
  }, [languages, selectedLanguage, onLanguageChange]);

  // Show loading screen if no language is selected yet
  if (!selectedLanguage && languagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading languages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DictationMaster
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                {languagesLoading ? (
                  <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">Loading...</span>
                  </div>
                ) : (
                  <select
                    value={selectedLanguage?.code || ''}
                    onChange={(e) => {
                      const lang = languages.find(l => l.code === e.target.value);
                      if (lang) onLanguageChange(lang);
                    }}
                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 font-medium hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                )}
                <Globe className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 bg-white border border-gray-200 rounded-xl px-4 py-2 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                >
                  <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                  <div className="text-left hidden sm:block">
                    <div className="font-medium text-gray-800">{currentUser.name}</div>
                    <div className="text-xs text-gray-600">Level {currentUser.level}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-semibold text-gray-800">{currentUser.name}</div>
                          {currentUser.isGuest ? (
                            <div className="text-sm text-orange-600">Guest User</div>
                          ) : (
                            <div className="text-sm text-gray-600">{currentUser.email}</div>
                          )}
                          <div className="text-xs text-blue-600">Level {currentUser.level} • {currentUser.xp} XP</div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      {currentUser.isGuest ? (
                        <>
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              setShowLoginModal(true);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-blue-600"
                          >
                            <User className="w-4 h-4" />
                            <span>Sign In</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              setShowRegisterModal(true);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-green-600"
                          >
                            <User className="w-4 h-4" />
                            <span>Sign Up</span>
                          </button>
                          <hr className="my-2" />
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              onRankingSelect();
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                          >
                            <Trophy className="w-4 h-4 text-gray-600" />
                            <span>Ranking</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              onHistorySelect();
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                          >
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span>History</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3">
                            <Settings className="w-4 h-4 text-gray-600" />
                            <span>Settings</span>
                          </button>
                          <hr className="my-2" />
                        </>
                      )}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{currentUser.isGuest ? 'New Guest' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {currentUser.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-xl text-gray-600">
              Ready to master {selectedLanguage?.name || 'your language'} dictation?
            </p>
          </div>
          
          {/* User Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentUser.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentUser.totalLessons}</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{currentUser.totalWins}</div>
              <div className="text-sm text-gray-600">Wins</div>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from various categories, challenge yourself, or play with friends!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

          <button
            onClick={onPlaySelect}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <Users className="w-5 h-5" />
            <span>Play with Friends</span>
          </button>

          <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg">
            <Trophy className="w-5 h-5" />
            <span>Daily Challenge</span>
          </button>
          
          <button
            onClick={onYoutubeSelect}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <Youtube className="w-5 h-5" />
            <span>YouTube</span>
          </button>
          
          <button
            onClick={onRankingSelect}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <Trophy className="w-5 h-5" />
            <span>Ranking</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Category</h3>
          {categoriesLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading categories...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategorySelect(category)}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-gray-100 text-left group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-${category.color}-100 group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`w-6 h-6 text-${category.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                          {category.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          <BookOpen className="w-4 h-4 mr-1" />
                          <span>{category.lessonCount || 0} lessons</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={onLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={onRegister}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
}