import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import LessonPage from './components/lessonPage/LessonPage';
import YoutubePage from './components/YoutubePage';
import RankingPage from './components/RankingPage';
import HistoryPage from './components/HistoryPage';
import PlayPage from './components/PlayPage';
import RoomPage from './components/RoomPage';
import { currentUser } from './data/mockData';
import { Language, Category, Page, User, ApiLesson, Room } from './types/types';
import { createGuestUser } from './utils/guestNameGenerator';
import { hasToken, getStoredUser, saveAuthData, clearAuthData, getToken } from './utils/tokenStorage';
import { apiService } from './services/api';
import { MultiplayerProvider, useMultiplayer } from './contexts/MultiplayerContext';
import { LanguagesProvider } from './contexts/LanguagesContext';

// Inner component that uses MultiplayerContext
function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<ApiLesson | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Use multiplayer context for auto-navigation
  const { isInRoom, currentRoom } = useMultiplayer();

  // Auto navigate based on room state
  useEffect(() => {
    if (isInRoom && currentRoom && currentPage !== 'room') {
      setSelectedRoom(currentRoom);
      setCurrentPage('room');
    } else if (!isInRoom && currentPage === 'room') {
      setCurrentPage('play');
      setSelectedRoom(null);
    }
  }, [isInRoom, currentRoom, currentPage]);

  // Initialize mock rooms
  useEffect(() => {
    const mockRooms: Room[] = [
      {
        id: 'room-1',
        name: 'English Practice',
        players: [
          { id: '1', name: 'Alice', avatar: '👩', isReady: true },
          { id: '2', name: 'Bob', avatar: '👨', isReady: false },
          { id: '3', name: 'Charlie', avatar: '👦', isReady: true }
        ],
        maxPlayers: 4,
        isPublic: true,
        status: 'waiting'
      },
      {
        id: 'room-2',
        name: 'TOEIC Prep',
        players: [
          { id: '4', name: 'Diana', avatar: '👩‍💼', isReady: true },
          { id: '5', name: 'Eve', avatar: '👩‍🎓', isReady: true }
        ],
        maxPlayers: 6,
        isPublic: true,
        status: 'waiting'
      },
      {
        id: 'room-3',
        name: 'Business English',
        players: [
          { id: '6', name: 'Frank', avatar: '👔', isReady: false }
        ],
        maxPlayers: 4,
        isPublic: true,
        status: 'waiting'
      }
    ];
    setRooms(mockRooms);
  }, []);

  // Kiểm tra token và tự động đăng ký guest nếu cần
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Kiểm tra xem có token trong localStorage không
        if (hasToken()) {
          // Nếu có token, lấy thông tin user từ localStorage
          const storedUser = getStoredUser();
          if (storedUser) {
            // Tách tên gốc từ full_name (bỏ suffix)
            const originalName = storedUser.full_name.split('_')[0];
            
            const userFromStorage: User = {
              id: storedUser.id,
              name: originalName, // Hiển thị tên gốc
              email: storedUser.email || '',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${storedUser.id}`,
              level: 1,
              xp: 0,
              streak: 0,
              totalLessons: 0,
              totalWins: 0,
              isGuest: storedUser.user_type === 'guest',
              full_name: storedUser.full_name, // Giữ full_name gốc từ API
              learning_language_id: storedUser.learning_language_id,
              user_type: storedUser.user_type,
              is_active: storedUser.is_active,
              created_at: storedUser.created_at,
              updated_at: storedUser.updated_at,
              token: getToken() || '', // Thêm token từ localStorage
            };
            setUser(userFromStorage);
            setIsInitialized(true);
            return;
          }
        }

        // Nếu không có token, tạo guest user và đăng ký với API
        const guestUser = createGuestUser();
        setUser(guestUser);

        // Gửi request đăng ký guest user ngầm
        try {
          const response = await apiService.registerGuest({
            full_name: guestUser.name,
            learning_language_id: 1
          });

          // Lưu token và thông tin user vào localStorage
          saveAuthData(response);

          // Cập nhật user với thông tin từ API
          const updatedUser: User = {
            ...guestUser,
            id: response.user.id,
            name: guestUser.name, // Giữ tên gốc để hiển thị
            full_name: response.user.full_name, // Lưu full_name từ API (có suffix)
            learning_language_id: response.user.learning_language_id,
            user_type: response.user.user_type,
            is_active: response.user.is_active,
            created_at: response.user.created_at,
            updated_at: response.user.updated_at,
            token: response.token,
          };
          setUser(updatedUser);
        } catch (error) {
          console.error('Failed to register guest user:', error);
          // Nếu đăng ký thất bại, vẫn giữ guest user local
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        // Fallback: tạo guest user local
        const guestUser = createGuestUser();
        setUser(guestUser);
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeUser();
    }
  }, [isInitialized]);


  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCurrentPage('category');
  };

  const handleLessonSelect = (lesson: ApiLesson) => {
    setSelectedLesson(lesson);
    setCurrentPage('lesson');
  };


  const handleYoutubeSelect = () => {
    setCurrentPage('youtube');
  };

  const handleRankingSelect = () => {
    setCurrentPage('ranking');
  };

  const handleHistorySelect = () => {
    setCurrentPage('history');
  };

  const handlePlaySelect = () => {
    setCurrentPage('play');
  };

  const handleRoomJoin = (room: Room) => {
    setSelectedRoom(room);
    setCurrentPage('room');
  };

  const handleStartGame = () => {
    // Navigate to lesson/game - for now just go back to home
    setCurrentPage('home');
    setSelectedRoom(null);
  };


  const handleBack = () => {
    switch (currentPage) {
      case 'category':
        setCurrentPage('home');
        setSelectedCategory(null);
        break;
      case 'lesson':
        setCurrentPage('category');
        setSelectedLesson(null);
        break;
      case 'play':
        setCurrentPage('home');
        break;
      case 'room':
        setCurrentPage('play');
        setSelectedRoom(null);
        break;
      case 'youtube':
      case 'ranking':
      case 'history':
        setCurrentPage('home');
        break;
      default:
        setCurrentPage('home');
    }
  };



  const handleLogin = (_email: string, _password: string) => {
    // Simulate login
    setUser({ ...currentUser, token: 'mock-login-token' });
    setCurrentPage('home');
  };

  const handleRegister = (name: string, email: string, _password: string) => {
    // Simulate registration
    const newUser: User = {
      ...currentUser,
      name,
      email,
      token: 'mock-register-token'
    };
    setUser(newUser);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    // Xóa token và thông tin user khỏi localStorage
    clearAuthData();

    // Tạo guest user mới và đăng ký lại
    const guestUser = createGuestUser();
    setUser(guestUser);
    setCurrentPage('home');

    // Đăng ký guest user mới ngầm
    apiService.registerGuest({
      full_name: guestUser.name,
      learning_language_id: 1
    }).then(response => {
      saveAuthData(response);
      const updatedUser: User = {
        ...guestUser,
        id: response.user.id,
        name: guestUser.name, // Giữ tên gốc để hiển thị
        full_name: response.user.full_name, // Lưu full_name từ API (có suffix)
        learning_language_id: response.user.learning_language_id,
        user_type: response.user.user_type,
        is_active: response.user.is_active,
        created_at: response.user.created_at,
        updated_at: response.user.updated_at,
        token: response.token,
      };
      setUser(updatedUser);
    }).catch(error => {
      console.error('Failed to register new guest user after logout:', error);
    });
  };


  return (
    <div className="app">
      {currentPage === 'home' && user && (
        <HomePage
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          currentUser={user}
          onCategorySelect={handleCategorySelect}
          onYoutubeSelect={handleYoutubeSelect}
          onRankingSelect={handleRankingSelect}
          onHistorySelect={handleHistorySelect}
          onPlaySelect={handlePlaySelect}
          onLogout={handleLogout}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {currentPage === 'category' && selectedCategory && (
        <CategoryPage
          category={selectedCategory}
          onBack={handleBack}
          onLessonSelect={handleLessonSelect}
        />
      )}

      {currentPage === 'lesson' && selectedLesson && (
        <LessonPage
          lesson={selectedLesson}
          onBack={handleBack}
        />
      )}

      {currentPage === 'youtube' && (
        <YoutubePage
          onBack={handleBack}
        />
      )}

      {currentPage === 'ranking' && (
        <RankingPage
          onBack={handleBack}
        />
      )}

      {currentPage === 'history' && (
        <HistoryPage
          onBack={handleBack}
        />
      )}

      {currentPage === 'play' && (
        <PlayPage
          onBack={handleBack}
          rooms={rooms}
          onRoomJoin={handleRoomJoin}
        />
      )}

      {currentPage === 'room' && selectedRoom && (
        <RoomPage
          room={selectedRoom}
          onBack={handleBack}
          onStartGame={handleStartGame}
        />
      )}
    </div>
  );
}

// Main App component with providers
function App() {
  return (
    <LanguagesProvider>
      <MultiplayerProvider>
        <AppContent />
      </MultiplayerProvider>
    </LanguagesProvider>
  );
}

export default App;