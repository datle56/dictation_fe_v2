import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DailyChallengeLeaderboard } from '../../types/dailyChallenge';
import { dailyChallengeService } from '../../services/dailyChallengeService';

export default function LeaderboardSection() {
  const [leaderboard, setLeaderboard] = useState<DailyChallengeLeaderboard[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await dailyChallengeService.getLeaderboard(timeframe);
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-2 text-gray-600">Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Challenge Leaderboard</h2>
          <div className="flex bg-gray-100 rounded-xl p-1">
            {[
              { key: 'daily', label: 'Today' },
              { key: 'weekly', label: 'This Week' },
              { key: 'monthly', label: 'This Month' },
              { key: 'alltime', label: 'All Time' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setTimeframe(option.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeframe === option.key
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-8">
            <div className="flex items-end justify-center space-x-8">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="bg-gray-100 rounded-2xl p-6 mb-4 relative">
                  <div className="text-4xl mb-2">{leaderboard[1].avatar}</div>
                  <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full p-2">
                    <Medal className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-800">{leaderboard[1].name}</h3>
                <p className="text-gray-600">{leaderboard[1].score} pts</p>
                <div className="bg-gray-100 h-16 w-20 mx-auto mt-4 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-2xl font-bold text-gray-600">2</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="bg-yellow-100 rounded-2xl p-6 mb-4 relative transform scale-110">
                  <div className="text-4xl mb-2">{leaderboard[0].avatar}</div>
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-2">
                    <Crown className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-800">{leaderboard[0].name}</h3>
                <p className="text-gray-600">{leaderboard[0].score} pts</p>
                <div className="bg-yellow-400 h-24 w-20 mx-auto mt-4 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="bg-amber-100 rounded-2xl p-6 mb-4 relative">
                  <div className="text-4xl mb-2">{leaderboard[2].avatar}</div>
                  <div className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full p-2">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-800">{leaderboard[2].name}</h3>
                <p className="text-gray-600">{leaderboard[2].score} pts</p>
                <div className="bg-amber-500 h-12 w-20 mx-auto mt-4 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings */}
        <div className="divide-y divide-gray-100">
          {leaderboard.map((user, index) => (
            <div
              key={user.id}
              className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                user.isCurrentUser ? 'bg-orange-50 border-l-4 border-orange-500' : ''
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
                    {user.isCurrentUser && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{user.score} points</span>
                    <span>🔥 {user.streak} day streak</span>
                    <span>{user.challengesCompleted} challenges</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getChangeIcon(user.rankChange)}
                <span className={`text-sm font-medium ${getChangeColor(user.rankChange)}`}>
                  {user.rankChange > 0 ? `+${user.rankChange}` : user.rankChange === 0 ? '0' : user.rankChange}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}