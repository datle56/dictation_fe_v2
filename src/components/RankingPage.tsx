import React, { useState } from 'react';
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from 'lucide-react';
import { rankingUsers, currentUser } from '../data/mockData';

interface RankingPageProps {
  onBack: () => void;
}

export default function RankingPage({ onBack }: RankingPageProps) {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

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
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
                <p className="text-gray-600">See how you rank against other learners</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Your Rank Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{currentUser.avatar}</div>
              <div>
                <h3 className="text-xl font-bold">{currentUser.name}</h3>
                <p className="opacity-90">Your current rank</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">#{rankingUsers.find(u => String(u.id) === String(currentUser.id))?.rank || 6}</div>
              <div className="text-sm opacity-90">{currentUser.xp} XP</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b">
            {[
              { key: 'weekly', label: 'This Week' },
              { key: 'monthly', label: 'This Month' },
              { key: 'alltime', label: 'All Time' }
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

        {/* Top 3 Podium */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Top Performers</h2>
          <div className="flex items-end justify-center space-x-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-2xl p-6 mb-4 relative">
                <div className="text-4xl mb-2">{rankingUsers[1].avatar}</div>
                <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full p-2">
                  <Medal className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800">{rankingUsers[1].name}</h3>
              <p className="text-gray-600">{rankingUsers[1].score} XP</p>
              <div className="bg-gray-100 h-16 w-20 mx-auto mt-4 rounded-t-lg flex items-end justify-center pb-2">
                <span className="text-2xl font-bold text-gray-600">2</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="bg-yellow-100 rounded-2xl p-6 mb-4 relative transform scale-110">
                <div className="text-4xl mb-2">{rankingUsers[0].avatar}</div>
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-2">
                  <Crown className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800">{rankingUsers[0].name}</h3>
              <p className="text-gray-600">{rankingUsers[0].score} XP</p>
              <div className="bg-yellow-400 h-24 w-20 mx-auto mt-4 rounded-t-lg flex items-end justify-center pb-2">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="bg-amber-100 rounded-2xl p-6 mb-4 relative">
                <div className="text-4xl mb-2">{rankingUsers[2].avatar}</div>
                <div className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full p-2">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800">{rankingUsers[2].name}</h3>
              <p className="text-gray-600">{rankingUsers[2].score} XP</p>
              <div className="bg-amber-500 h-12 w-20 mx-auto mt-4 rounded-t-lg flex items-end justify-center pb-2">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Ranking List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Full Rankings</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {rankingUsers.map((user, index) => (
              <div
                key={user.id}
                className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  String(user.id) === String(currentUser.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="text-3xl">{user.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                      <span>{user.name}</span>
                      {String(user.id) === String(currentUser.id) && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm">{user.score} XP</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getChangeIcon(user.change)}
                  <span className={`text-sm font-medium ${getChangeColor(user.change)}`}>
                    {user.change > 0 ? `+${user.change}` : user.change === 0 ? '0' : user.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}