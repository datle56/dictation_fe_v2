export interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string;
  is_active: boolean;
  flag?: string; // Keep for backward compatibility
}

export interface Category {
  id: number;
  language_id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  lessonCount?: number; // Keep for backward compatibility
}

export interface Lesson {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  categoryId: number;
  challenges: Challenge[];
}

export interface ApiLesson {
  id: number;
  category_id: number;
  lesson_name: string;
  vocab_level: string;
  speech_to_text_lang_code: string;
  lesson_type: string;
  audio_src: string;
  youtube_url: string | null;
  youtube_embed_url: string | null;
  video_id: string | null;
  video_title: string | null;
  is_active: boolean;
}

export interface Challenge {
  id: number;
  lesson_id: number;
  position: number;
  content: string;
  default_input: string;
  json_content: (string | string[])[];
  solution: string[][];
  audio_src: string;
  time_start: number;
  time_end: number;
  hint: string | null;
  hints: string[];
  explanation: string | null;
  always_show_explanation: boolean;
  nb_comments: number;
}

export interface LessonGroup {
  id: string;
  name: string;
  lessons: Lesson[];
  isExpanded?: boolean;
}


export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  totalLessons: number;
  totalWins: number;
  isGuest?: boolean;
  // Thêm các trường từ API
  full_name?: string;
  learning_language_id?: number;
  user_type?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  token?: string;
}

export interface RankingUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  change: number; // +1, -1, 0 for rank change
}

export interface Player {
  id: string | number;
  name: string;
  avatar?: string;
  isReady: boolean;
  full_name?: string;
  user_type?: string;
  is_host?: boolean;
  score?: number;
}

export interface Room {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  isPublic: boolean;
  status: 'waiting' | 'playing' | 'finished';
  code?: string;
  // Backend fields
  participants?: Player[];
  max_players?: number;
  is_active?: boolean;
  is_game_active?: boolean;
  created_at?: string;
  created_by?: number;
}

// WebSocket Message Types - Frontend to Backend
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

// Lobby Events (Frontend → Backend)
export interface CreateRoomMessage extends WebSocketMessage {
  type: 'CREATE_ROOM';
  data: {
    room_name: string;
  };
}

export interface CreateRoomSuccessMessage extends WebSocketMessage {
  type: 'CREATE_ROOM_SUCCESS';
  data: {
    room: Room;
  };
}

export interface JoinRoomMessage extends WebSocketMessage {
  type: 'JOIN_ROOM';
  data: {
    room_id: string;
  };
}

// Room Events (Frontend → Backend)
export interface LeaveRoomMessage extends WebSocketMessage {
  type: 'LEAVE_ROOM';
  data: {};
}

export interface ToggleReadyMessage extends WebSocketMessage {
  type: 'TOGGLE_READY';
  data: {};
}

export interface KickPlayerMessage extends WebSocketMessage {
  type: 'KICK_PLAYER';
  data: {
    playerID: number;
  };
}

export interface StartGameMessage extends WebSocketMessage {
  type: 'START_GAME';
  data: {};
}

// Chat Events (Frontend → Backend)
export interface SendMessage extends WebSocketMessage {
  type: 'SEND_MESSAGE';
  data: {
    message: string;
  };
}

// Game Events (Frontend → Backend)
export interface SubmitAnswerMessage extends WebSocketMessage {
  type: 'SUBMIT_ANSWER';
  data: {
    gameID: string;
    answer: string;
  };
}

// Heartbeat Events (Frontend → Backend)
export interface PingMessage extends WebSocketMessage {
  type: 'PING';
  data: {
    timestamp: string;
  };
}

export interface PongMessage extends WebSocketMessage {
  type: 'PONG';
  data: {
    timestamp: string;
  };
}

// Backend to Frontend Message Types
export interface ConnectedMessage extends WebSocketMessage {
  type: 'CONNECTED';
  data: {
    user: {
      id: number;
      full_name: string;
      user_type: string;
      is_host: boolean;
      score: number;
      is_ready: boolean;
    };
    lobby: {
      rooms: Room[];
    };
  };
}

export interface LobbyUpdateMessage extends WebSocketMessage {
  type: 'LOBBY_UPDATE';
  data: {
    rooms: Room[];
  };
}

export interface RoomStateUpdateMessage extends WebSocketMessage {
  type: 'ROOM_STATE_UPDATE';
  data: {
    room: Room;
  };
}

export interface ChatMessageFromServer extends WebSocketMessage {
  type: 'CHAT_MESSAGE';
  data: {
    id: string;
    user_id: number;
    user_name: string;
    message: string;
    timestamp: string;
  };
}

export interface GameStartedMessage extends WebSocketMessage {
  type: 'GAME_STARTED';
  data: {
    gameId: string;
    roomId: string;
  };
}

export interface GameStateUpdateMessage extends WebSocketMessage {
  type: 'GAME_STATE_UPDATE';
  data: {
    gameId: string;
  };
}

export interface GameEndedMessage extends WebSocketMessage {
  type: 'GAME_ENDED';
  data: {
    gameId: string;
    results: any;
  };
}

export interface ErrorMessage extends WebSocketMessage {
  type: 'ERROR';
  data: {
    code: string;
    message: string;
  };
}

// Error Codes
export type ErrorCode =
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'USER_NOT_FOUND'
  | 'ROOM_NOT_FOUND'
  | 'ROOM_FULL'
  | 'ALREADY_IN_ROOM'
  | 'NOT_IN_ROOM'
  | 'GAME_ACTIVE'
  | 'UNAUTHORIZED'
  | 'NOT_HOST'
  | 'PLAYER_NOT_FOUND'
  | 'NOT_READY'
  | 'GAME_NOT_FOUND'
  | 'INVALID_ANSWER'
  | 'INVALID_MESSAGE'
  | 'MESSAGE_TOO_LONG'
  | 'KICKED';

// Multiplayer Context Types
export interface MultiplayerState {
  // Connection
  isConnected: boolean;
  connectionError: string | null;

  // User
  currentUser: Player | null;

  // Lobby
  isInLobby: boolean;
  lobbyRooms: Room[];

  // Room
  currentRoom: Room | null;
  isInRoom: boolean;

  // Chat
  chatMessages: ChatMessage[];

  // Game
  isGameActive: boolean;
  gameState: any;
}

export interface MultiplayerContextType extends MultiplayerState {
  // Connection methods
  connect: () => void;
  disconnect: () => void;

  // Lobby methods
  createRoom: (roomName: string) => void;
  joinRoom: (roomId: string) => void;

  // Room methods
  leaveRoom: () => void;
  toggleReady: () => void;
  kickPlayer: (playerId: number) => void;
  startGame: () => void;

  // Chat methods
  sendMessage: (message: string) => void;

  // Game methods
  submitAnswer: (gameId: string, answer: string) => void;
}

// Legacy interfaces for backward compatibility
export interface ConnectedData {
  user: {
    id: number;
    full_name: string;
    user_type: string;
    is_host: boolean;
    score: number;
    is_ready: boolean;
  };
  lobby: {
    rooms: Room[];
  };
}

export interface LobbyUpdateData {
  rooms: Room[];
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: Date;
}


export type Page = 'home' | 'category' | 'lesson' | 'login' | 'register' | 'youtube' | 'ranking' | 'history' | 'play' | 'room';