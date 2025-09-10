import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import {
  MultiplayerState,
  MultiplayerContextType,
  Player,
  Room,
  ChatMessage,
  WebSocketMessage,
  ConnectedMessage,
  LobbyUpdateMessage,
  RoomStateUpdateMessage,
  ChatMessageFromServer,
  CreateRoomSuccessMessage,
  GameStateUpdateMessage,
  GameEndedMessage,
  ErrorMessage
} from '../types/types';
import { wsService } from '../services/websocketService';

// Initial state
const initialState: MultiplayerState = {
  isConnected: false,
  connectionError: null,
  currentUser: null,
  isInLobby: true,
  lobbyRooms: [],
  currentRoom: null,
  isInRoom: false,
  chatMessages: [],
  isGameActive: false,
  gameState: null
};

// Action types
type MultiplayerAction =
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_CONNECTION_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_USER'; payload: Player | null }
  | { type: 'SET_LOBBY_ROOMS'; payload: Room[] }
  | { type: 'SET_CURRENT_ROOM'; payload: Room | null }
  | { type: 'SET_IS_IN_ROOM'; payload: boolean }
  | { type: 'SET_IS_IN_LOBBY'; payload: boolean }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_CHAT_MESSAGES'; payload: ChatMessage[] }
  | { type: 'SET_GAME_ACTIVE'; payload: boolean }
  | { type: 'SET_GAME_STATE'; payload: any }
  | { type: 'RESET_STATE' };

// Reducer
function multiplayerReducer(state: MultiplayerState, action: MultiplayerAction): MultiplayerState {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_CONNECTION_ERROR':
      return { ...state, connectionError: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_LOBBY_ROOMS':
      return { ...state, lobbyRooms: action.payload };
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'SET_IS_IN_ROOM':
      return { ...state, isInRoom: action.payload, isInLobby: !action.payload };
    case 'SET_IS_IN_LOBBY':
      return { ...state, isInLobby: action.payload, isInRoom: !action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'SET_CHAT_MESSAGES':
      return { ...state, chatMessages: action.payload };
    case 'SET_GAME_ACTIVE':
      return { ...state, isGameActive: action.payload };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'RESET_STATE':
      return { ...initialState, isConnected: state.isConnected };
    default:
      return state;
  }
}

// Context
const MultiplayerContext = createContext<MultiplayerContextType | null>(null);

// Provider component
export function MultiplayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(multiplayerReducer, initialState);
  const heartbeatIntervalRef = useRef<number>();

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    console.log('Handling WebSocket message:', message.type);

    switch (message.type) {
      case 'CONNECTED':
        const connectedMsg = message as ConnectedMessage;
        dispatch({ type: 'SET_CURRENT_USER', payload: {
          id: connectedMsg.data.user.id,
          name: connectedMsg.data.user.full_name,
          avatar: '😊',
          isReady: connectedMsg.data.user.is_ready,
          full_name: connectedMsg.data.user.full_name,
          user_type: connectedMsg.data.user.user_type,
          is_host: connectedMsg.data.user.is_host,
          score: connectedMsg.data.user.score
        }});

        // Map backend rooms to frontend format
        const mappedRooms = connectedMsg.data.lobby.rooms.map(room => ({
          id: room.id,
          name: room.name,
          players: room.participants?.map(p => ({
            id: p.id,
            name: p.full_name || 'Unknown',
            avatar: '😊',
            isReady: (p as any).is_ready || false,
            full_name: p.full_name || 'Unknown',
            user_type: p.user_type,
            is_host: p.is_host || false,
            score: p.score || 0
          })) || [],
          maxPlayers: room.max_players || 6,
          isPublic: true,
          status: room.is_game_active ? 'playing' as const : 'waiting' as const,
          participants: room.participants,
          max_players: room.max_players,
          is_active: room.is_active,
          is_game_active: room.is_game_active,
          created_at: room.created_at,
          created_by: room.created_by
        }));

        dispatch({ type: 'SET_LOBBY_ROOMS', payload: mappedRooms });
        dispatch({ type: 'SET_IS_IN_LOBBY', payload: true });
        dispatch({ type: 'SET_IS_IN_ROOM', payload: false });
        break;

      case 'LOBBY_UPDATE':
        const lobbyMsg = message as LobbyUpdateMessage;

        // Map backend rooms to frontend format
        const mappedLobbyRooms = lobbyMsg.data.rooms.map(room => ({
          id: room.id,
          name: room.name,
          players: room.participants?.map(p => ({
            id: p.id,
            name: p.full_name || 'Unknown',
            avatar: '😊',
            isReady: (p as any).is_ready || false,
            full_name: p.full_name || 'Unknown',
            user_type: p.user_type,
            is_host: p.is_host || false,
            score: p.score || 0
          })) || [],
          maxPlayers: room.max_players || 6,
          isPublic: true,
          status: room.is_game_active ? 'playing' as const : 'waiting' as const,
          participants: room.participants,
          max_players: room.max_players,
          is_active: room.is_active,
          is_game_active: room.is_game_active,
          created_at: room.created_at,
          created_by: room.created_by
        }));

        dispatch({ type: 'SET_LOBBY_ROOMS', payload: mappedLobbyRooms });
        break;

      case 'ROOM_STATE_UPDATE':
        const roomMsg = message as RoomStateUpdateMessage;

        // Map backend room to frontend format
        const mappedRoom = {
          id: roomMsg.data.room.id,
          name: roomMsg.data.room.name,
          players: roomMsg.data.room.participants?.map(p => ({
            id: p.id,
            name: p.full_name || 'Unknown',
            avatar: '😊',
            isReady: (p as any).is_ready || false,
            full_name: p.full_name || 'Unknown',
            user_type: p.user_type,
            is_host: p.is_host || false,
            score: p.score || 0
          })) || [],
          maxPlayers: roomMsg.data.room.max_players || 6,
          isPublic: true,
          status: roomMsg.data.room.is_game_active ? 'playing' as const : 'waiting' as const,
          participants: roomMsg.data.room.participants,
          max_players: roomMsg.data.room.max_players,
          is_active: roomMsg.data.room.is_active,
          is_game_active: roomMsg.data.room.is_game_active,
          created_at: roomMsg.data.room.created_at,
          created_by: roomMsg.data.room.created_by
        };

        // Check if current user is still in the room participants
        // Handle both string and number ID types
        const isCurrentUserInRoom = mappedRoom.players.some(player =>
          state.currentUser && (player.id === state.currentUser.id || player.id === Number(state.currentUser.id))
        );

        console.log('ROOM_STATE_UPDATE Debug:', {
          currentUser: state.currentUser,
          players: mappedRoom.players,
          isCurrentUserInRoom,
          participantIds: mappedRoom.players.map(p => p.id),
          currentUserId: state.currentUser?.id,
          currentUserIdType: typeof state.currentUser?.id
        });

        // Always update room state for ROOM_STATE_UPDATE messages
        // This handles both room creation and room updates
        dispatch({ type: 'SET_CURRENT_ROOM', payload: mappedRoom });
        dispatch({ type: 'SET_IS_IN_ROOM', payload: true });
        dispatch({ type: 'SET_IS_IN_LOBBY', payload: false });

        // If user is not in the room, something went wrong - log it
        if (!isCurrentUserInRoom && state.currentUser) {
          console.warn('Current user not found in room participants after ROOM_STATE_UPDATE');
        }
        break;

      case 'CREATE_ROOM_SUCCESS':
        const createRoomSuccessMsg = message as CreateRoomSuccessMessage;
        console.log('Room created successfully:', createRoomSuccessMsg.data.room);

        // Map backend room to frontend format
        const createdRoom = {
          id: createRoomSuccessMsg.data.room.id,
          name: createRoomSuccessMsg.data.room.name,
          players: createRoomSuccessMsg.data.room.participants?.map(p => ({
            id: p.id,
            name: p.full_name || 'Unknown',
            avatar: '😊',
            isReady: (p as any).is_ready || false,
            full_name: p.full_name || 'Unknown',
            user_type: p.user_type,
            is_host: p.is_host || false,
            score: p.score || 0
          })) || [],
          maxPlayers: createRoomSuccessMsg.data.room.max_players || 6,
          isPublic: true,
          status: createRoomSuccessMsg.data.room.is_game_active ? 'playing' as const : 'waiting' as const,
          participants: createRoomSuccessMsg.data.room.participants,
          max_players: createRoomSuccessMsg.data.room.max_players,
          is_active: createRoomSuccessMsg.data.room.is_active,
          is_game_active: createRoomSuccessMsg.data.room.is_game_active,
          created_at: createRoomSuccessMsg.data.room.created_at,
          created_by: createRoomSuccessMsg.data.room.created_by
        };

        dispatch({ type: 'SET_CURRENT_ROOM', payload: createdRoom });
        dispatch({ type: 'SET_IS_IN_ROOM', payload: true });
        dispatch({ type: 'SET_IS_IN_LOBBY', payload: false });
        break;

      case 'CHAT_MESSAGE':
        const chatMsg = message as ChatMessageFromServer;
        const newChatMessage: ChatMessage = {
          id: chatMsg.data.id,
          playerId: chatMsg.data.user_id.toString(),
          playerName: chatMsg.data.user_name,
          message: chatMsg.data.message,
          timestamp: new Date(chatMsg.data.timestamp)
        };
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: newChatMessage });
        break;

      case 'GAME_STARTED':
        dispatch({ type: 'SET_GAME_ACTIVE', payload: true });
        break;

      case 'GAME_STATE_UPDATE':
        const gameStateMsg = message as GameStateUpdateMessage;
        dispatch({ type: 'SET_GAME_STATE', payload: gameStateMsg.data });
        break;

      case 'GAME_ENDED':
        const gameEndedMsg = message as GameEndedMessage;
        dispatch({ type: 'SET_GAME_ACTIVE', payload: false });
        dispatch({ type: 'SET_GAME_STATE', payload: gameEndedMsg.data.results });
        break;

      case 'ERROR':
        const errorMsg = message as ErrorMessage;
        console.error('WebSocket error:', errorMsg.data);
        dispatch({ type: 'SET_CONNECTION_ERROR', payload: errorMsg.data.message });

        // Handle specific errors
        if (errorMsg.data.code === 'KICKED') {
          dispatch({ type: 'SET_IS_IN_ROOM', payload: false });
          dispatch({ type: 'SET_IS_IN_LOBBY', payload: true });
          dispatch({ type: 'SET_CURRENT_ROOM', payload: null });
        }
        break;

      default:
        console.log('Unhandled message type:', message.type);
    }
  }, []);

  // Setup WebSocket message handler and sync connection state
  useEffect(() => {
    wsService.setMessageHandler(handleWebSocketMessage);

    // Sync connection state from WebSocket service
    const syncConnectionState = () => {
      if (wsService.isConnected !== state.isConnected) {
        dispatch({ type: 'SET_CONNECTED', payload: wsService.isConnected });
      }
      if (wsService.connectionError !== state.connectionError) {
        dispatch({ type: 'SET_CONNECTION_ERROR', payload: wsService.connectionError });
      }
    };

    // Initial sync
    syncConnectionState();

    // Set up periodic sync
    const syncInterval = setInterval(syncConnectionState, 1000);

    return () => {
      wsService.setMessageHandler(() => {});
      clearInterval(syncInterval);
    };
  }, [handleWebSocketMessage, state.isConnected, state.connectionError]);

  // Heartbeat
  useEffect(() => {
    if (state.isConnected) {
      heartbeatIntervalRef.current = setInterval(() => {
        // Send ping every 30 seconds only if WebSocket is open
        if (wsService.isConnected) {
          wsService.send({
            type: 'PING',
            data: { timestamp: new Date().toISOString() },
            timestamp: new Date().toISOString()
          });
        }
      }, 30000);
    } else {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = undefined;
      }
    }

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = undefined;
      }
    };
  }, [state.isConnected]);

  // Connection methods
  const connect = useCallback(async () => {
    // Don't connect if already connected or connecting
    if (state.isConnected || (wsService.ws && wsService.ws.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    try {
      await wsService.connect();
      dispatch({ type: 'SET_CONNECTED', payload: true });
      dispatch({ type: 'SET_CONNECTION_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_CONNECTED', payload: false });
      dispatch({ type: 'SET_CONNECTION_ERROR', payload: error instanceof Error ? error.message : 'Connection failed' });
    }
  }, [state.isConnected]);

  const disconnect = useCallback(() => {
    wsService.disconnect();
    dispatch({ type: 'SET_CONNECTED', payload: false });
    dispatch({ type: 'RESET_STATE' });
  }, []);

  // Lobby methods
  const createRoom = useCallback((roomName: string) => {
    wsService.createRoom(roomName);
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    wsService.joinRoom(roomId);
  }, []);

  // Room methods
  const leaveRoom = useCallback(() => {
    // Send leave room message to server
    wsService.leaveRoom();

    // Clear chat messages when leaving room
    dispatch({ type: 'SET_CHAT_MESSAGES', payload: [] });

    // Optimistically update UI immediately
    dispatch({ type: 'SET_IS_IN_ROOM', payload: false });
    dispatch({ type: 'SET_IS_IN_LOBBY', payload: true });
    dispatch({ type: 'SET_CURRENT_ROOM', payload: null });
  }, []);

  const toggleReady = useCallback(() => {
    wsService.toggleReady();
  }, []);

  const kickPlayer = useCallback((playerId: number) => {
    wsService.kickPlayer(playerId);
  }, []);

  const startGame = useCallback(() => {
    wsService.startGame();
  }, []);

  // Chat methods
  const sendMessage = useCallback((message: string) => {
    wsService.sendChatMessage(message);
  }, []);

  // Game methods
  const submitAnswer = useCallback((gameId: string, answer: string) => {
    wsService.submitAnswer(gameId, answer);
  }, []);

  const contextValue: MultiplayerContextType = {
    ...state,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleReady,
    kickPlayer,
    startGame,
    sendMessage,
    submitAnswer
  };

  return (
    <MultiplayerContext.Provider value={contextValue}>
      {children}
    </MultiplayerContext.Provider>
  );
}

// Hook to use the context
export function useMultiplayer(): MultiplayerContextType {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
}

export default MultiplayerContext;
