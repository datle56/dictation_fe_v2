import { useState, useEffect } from 'react';
import { Send, Users, Crown, Play, Copy, Settings, LogOut } from 'lucide-react';
import { Room } from '../types/types';
import { useMultiplayer } from '../contexts/MultiplayerContext';
import { getUserId } from '../utils/tokenStorage';

interface RoomPageProps {
  room: Room;
  onBack: () => void;
  onStartGame: () => void;
}

export default function RoomPage({ room, onBack, onStartGame }: RoomPageProps) {
  const [chatMessage, setChatMessage] = useState('');

  // Use multiplayer context
  const {
    currentRoom,
    currentUser,
    isInRoom,
    chatMessages,
    sendMessage,
    toggleReady,
    leaveRoom,
    startGame
  } = useMultiplayer();

  // Get current user ID from localStorage or currentUser context
  const currentUserId = getUserId();

  // Also check currentUser.id if available (fallback)
  const effectiveUserId = currentUser?.id ? Number(currentUser.id) : currentUserId;

  // Use currentRoom from context if available, otherwise use prop
  const activeRoom = currentRoom || room;

  // If not in room and no current room, redirect back
  useEffect(() => {
    if (!isInRoom && !currentRoom) {
      onBack();
    }
  }, [isInRoom, currentRoom, onBack]);

  // Don't render if no room data
  if (!activeRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Joining room...</p>
        </div>
      </div>
    );
  }

  // Initialize chat with system message if empty
  useEffect(() => {
    if (chatMessages.length === 0) {
      // System message will be handled by context
    }
  }, [chatMessages.length]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      sendMessage(chatMessage.trim());
      setChatMessage('');
    }
  };

  const handleCopyCode = () => {
    if (activeRoom.code) {
      navigator.clipboard.writeText(activeRoom.code);
    }
  };

  const handleToggleReady = () => {
    toggleReady();
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    onBack();
  };

  const handleStartGame = () => {
    startGame();
    onStartGame();
  };

  const allPlayersReady = activeRoom.players.every(player =>
    player.isReady || (currentUser && String(player.id) === String(currentUser.id))
  );
  const isHost = activeRoom.players[0]?.id && currentUser?.id && String(activeRoom.players[0].id) === String(currentUser.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLeaveRoom}
                className="p-2 hover:bg-red-100 rounded-xl transition-colors"
                title="Leave Room"
              >
                <LogOut className="w-6 h-6 text-red-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{activeRoom.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{activeRoom.players.length}/{activeRoom.maxPlayers} players</span>
                  {activeRoom.code && (
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Code: {activeRoom.code}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isHost && (
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Settings className="w-6 h-6 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Players & Game Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Players */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Players</h2>
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeRoom.players.map((player, index) => (
                  <div
                    key={`player-${player.id}-${index}`}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      player.isReady || (currentUser && String(player.id) === String(currentUser.id) && player.isReady)
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{player.avatar || '😊'}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-800">
                            {player.name || player.full_name}
                          </span>
                          {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                          {currentUser && String(player.id) === String(currentUser.id) && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {player.isReady ? (
                            <span className="text-green-600 font-medium">Ready</span>
                          ) : (
                            <span className="text-gray-500">Not ready</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: activeRoom.maxPlayers - activeRoom.players.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center"
                  >
                    <span className="text-gray-500">Waiting for player...</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Game Settings</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!isHost}>
                    <option>Business</option>
                    <option>Daily Life</option>
                    <option>Travel</option>
                    <option>TOEIC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!isHost}>
                    <option>Mixed</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleToggleReady}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  currentUser?.isReady
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {currentUser?.isReady ? 'Not Ready' : 'Ready'}
              </button>

              {isHost && (
                <button
                  onClick={handleStartGame}
                  disabled={!allPlayersReady}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Game</span>
                </button>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">Chat</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map(message => {
                // Check if this message is from the current user
                // Handle both string and number comparisons
                const messageUserId = parseInt(message.playerId);
                const isCurrentUser = effectiveUserId !== null &&
                  (messageUserId === effectiveUserId || message.playerId === effectiveUserId.toString());

                return (
                  <div key={message.id} className={`${
                    message.playerId === 'system' ? 'text-center' :
                    isCurrentUser ? 'text-right' : 'text-left'
                  }`}>
                    {message.playerId === 'system' ? (
                      <div className="text-sm text-gray-500 bg-gray-100 rounded-full px-4 py-2 inline-block">
                        {message.message}
                      </div>
                    ) : (
                      <div className={`inline-block max-w-[80%] ${
                        isCurrentUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      } rounded-2xl px-4 py-2`}>
                        <div className="text-xs opacity-70 mb-1">
                          {isCurrentUser ? 'You' : message.playerName}
                        </div>
                        <div>{message.message}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}