import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Trophy, Target, TrendingUp } from 'lucide-react';
import { currentUser } from '../data/mockData';

interface HistoryPageProps {
  onBack: () => void;
}

interface HistoryItem {
  id: string;
  type: 'lesson' | 'multiplayer' | 'youtube';
  title: string;
  date: Date;
  score: number;
  accuracy: number;
  duration: number;
  result?: 'win' | 'lose';
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    type: 'lesson',
    title: 'Business Meetings',
    date: new Date('2024-01-15T10:30:00'),
    score: 95,
    accuracy: 92,
    duration: 18
  },
  {
    id: '2',
    type: 'multiplayer',
    title: 'TOEIC Practice Room',
    date: new Date('2024-01-15T09:15:00'),
    score: 88,
    accuracy: 85,
    duration: 25,
    result: 'win'
  },
  {
    id: '3',
    type: 'youtube',
    title: 'Tech Talk: AI Revolution',
    date: new Date('2024-01-14T16:45:00'),
    score: 78,
    accuracy: 82,
    duration: 12
  },
  {
    id: '4',
    type: 'lesson',
    title: 'Daily Conversations',
    date: new Date('2024-01-14T14:20:00'),
    score: 100,
    accuracy: 98,
    duration: 15
  },
  {
    id: '5',
    type: 'multiplayer',
    title: 'Business English Battle',
    date: new Date('2024-01-13T20:10:00'),
    score: 72,
    accuracy: 75,
    duration: 30,
    result: 'lose'
  }
];

export default function HistoryPage({ onBack }: HistoryPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'lessons' | 'multiplayer' | 'youtube'>('all');

  const filteredHistory = activeTab === 'all' 
    ? mockHistory 
    : mockHistory.filter(item => item.type === activeTab);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚';
      case 'multiplayer': return '🎮';
      case 'youtube': return '📺';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-100 text-blue-600';
      case 'multiplayer': return 'bg-green-100 text-green-600';
      case 'youtube': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const averageScore = Math.round(mockHistory.reduce((acc, item) => acc + item.score, 0) / mockHistory.length);
  const averageAccuracy = Math.round(mockHistory.reduce((acc, item) => acc + item.accuracy, 0) / mockHistory.length);
  const totalTime = mockHistory.reduce((acc, item) => acc + item.duration, 0);
  const wins = mockHistory.filter(item => item.result === 'win').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Learning History</h1>
                <p className="text-gray-600">Track your progress and achievements</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{averageScore}</div>
            <div className="text-gray-600 text-sm">Avg Score</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{averageAccuracy}%</div>
            <div className="text-gray-600 text-sm">Accuracy</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{totalTime}m</div>
            <div className="text-gray-600 text-sm">Total Time</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{wins}</div>
            <div className="text-gray-600 text-sm">Multiplayer Wins</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b">
            {[
              { key: 'all', label: 'All Activities' },
              { key: 'lessons', label: 'Lessons' },
              { key: 'multiplayer', label: 'Multiplayer' },
              { key: 'youtube', label: 'YouTube' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredHistory.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getTypeIcon(item.type)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                        <span>{item.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        {item.result && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.result === 'win' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {item.result}
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.duration}m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{item.score}</div>
                        <div className="text-xs text-gray-600">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{item.accuracy}%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}