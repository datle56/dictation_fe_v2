import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Plus, Users, Lock, Globe, AlertTriangle } from 'lucide-react';
import { Room } from '../types/types';
import { useMultiplayer } from '../contexts/MultiplayerContext';

interface PlayPageProps {
  onBack: () => void;
  rooms: Room[];
  onRoomJoin: (room: Room) => void;
}

export default function PlayPage({ onBack, rooms: initialRooms, onRoomJoin }: PlayPageProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'rooms'>('quick');
  const [roomCode, setRoomCode] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);

  // Use multiplayer context
  const {
    isConnected,
    connectionError,
    currentUser,
    lobbyRooms,
    isInLobby,
    connect,
    disconnect,
    createRoom,
    joinRoom
  } = useMultiplayer();

  // Handle back button with confirmation
  const handleBackClick = () => {
    setShowLeaveConfirmation(true);
  };

  const handleConfirmLeave = () => {
    disconnect();
    setShowLeaveConfirmation(false);
    onBack();
  };

  // Connect on component mount
  useEffect(() => {
    if (!isConnected) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      // Don't disconnect here as WebSocket should persist
    };
  }, []); // Remove dependencies to prevent reconnection loop

  // Use lobby rooms if available, otherwise fall back to initial rooms
  const displayRooms = lobbyRooms !== null ? lobbyRooms : initialRooms;

  const handleQuickMatch = () => {
    // Find an available room or create one
    const availableRoom = displayRooms.find(room =>
      room.isPublic && room.players.length < room.maxPlayers && room.status === 'waiting'
    );

    if (availableRoom) {
      joinRoom(availableRoom.id);
      onRoomJoin(availableRoom);
    } else {
      // Create a new room for quick match
      const roomName = `Quick Match ${Date.now()}`;
      createRoom(roomName);
      setNewRoomName('');
    }
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      createRoom(newRoomName.trim());
      setNewRoomName('');
    }
  };

  const handleJoinWithCode = () => {
    if (roomCode.trim()) {
      joinRoom(roomCode.trim().toUpperCase());
      setRoomCode('');
    }
  };

  const handleRoomClick = (room: Room) => {
    joinRoom(room.id);
    // Don't navigate immediately - wait for ROOM_STATE_UPDATE
    // Navigation will be handled by context state changes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackClick}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Multiplayer</h1>
                  <p className="text-gray-600">Play with friends around the world</p>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-3">
              {currentUser && (
                <div className="text-sm text-gray-600">
                  Welcome, {currentUser.full_name || currentUser.name}
                </div>
              )}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isConnected
                  ? 'bg-green-100 text-green-700'
                  : connectionError
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : connectionError ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span>
                  {isConnected ? 'Connected' : connectionError ? 'Error' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={handleQuickMatch}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 rounded-2xl shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8" />
              <div className="text-right text-3xl font-bold opacity-20">⚡</div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Quick Match</h3>
            <p className="opacity-90">Get matched with players instantly</p>
          </button>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
              <div className="text-right text-3xl opacity-20">🔒</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Join with Code</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center font-mono text-lg"
                maxLength={6}
              />
              <button
                onClick={handleJoinWithCode}
                disabled={roomCode.length < 4}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'quick'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Globe className="w-5 h-5 inline mr-2" />
              Public Rooms
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'rooms'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create Room
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'quick' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Available Rooms</h3>
                  <div className="text-sm text-gray-600">{displayRooms.length} rooms online</div>
                </div>

                {displayRooms.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No rooms available</p>
                    <p>Create a new room to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayRooms.map(room => (
                      <button
                        key={room.id}
                        onClick={() => handleRoomClick(room)}
                        className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800">{room.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{room.players.length}/{room.maxPlayers} players</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                room.status === 'waiting' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {room.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex -space-x-2">
                            {room.players.slice(0, 3).map((player, index) => (
                              <div key={index} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white text-sm">
                                {player.avatar || '😊'}
                              </div>
                            ))}
                            {room.players.length > 3 && (
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white text-xs text-gray-600">
                                +{room.players.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Create New Room</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter room name"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={handleCreateRoom}
                    disabled={!newRoomName.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Create Room
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Leave Lobby Confirmation Modal */}
      {showLeaveConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-orange-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Leave Lobby</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to leave the multiplayer lobby? You will be disconnected from the server.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLeaveConfirmation(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeave}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-colors font-semibold"
              >
                Leave Lobby
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}