import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Trophy, Flame, Star, Clock, Target, Award, Zap, Crown, Medal } from 'lucide-react';
import { DailyChallenge, DailyChallengeStats, ChallengeStreak } from '../types/dailyChallenge';
import { dailyChallengeService } from '../services/dailyChallengeService';
import DailyChallengeCard from './dailyChallenge/DailyChallengeCard';
import StreakDisplay from './dailyChallenge/StreakDisplay';
import LeaderboardSection from './dailyChallenge/LeaderboardSection';
import ChallengeHistoryModal from './dailyChallenge/ChallengeHistoryModal';
import RewardsModal from './dailyChallenge/RewardsModal';

interface DailyChallengePageProps {
  onBack: () => void;
  onChallengeStart: (challenge: DailyChallenge) => void;
}

export default function DailyChallengePage({ onBack, onChallengeStart }: DailyChallengePageProps) {
  const [todayChallenges, setTodayChallenges] = useState<DailyChallenge[]>([]);
  const [stats, setStats] = useState<DailyChallengeStats | null>(null);
  const [streak, setStreak] = useState<ChallengeStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'achievements'>('challenges');

  useEffect(() => {
    loadDailyChallengeData();
  }, []);

  const loadDailyChallengeData = async () => {
    setLoading(true);
    try {
      const [challengesData, statsData, streakData] = await Promise.all([
        dailyChallengeService.getTodayChallenges(),
        dailyChallengeService.getUserStats(),
        dailyChallengeService.getUserStreak()
      ]);
      
      setTodayChallenges(challengesData);
      setStats(statsData);
      setStreak(streakData);
    } catch (error) {
      console.error('Failed to load daily challenge data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeComplete = async (challengeId: string, score: number, timeSpent: number) => {
    try {
      await dailyChallengeService.completeChallenge(challengeId, score, timeSpent);
      await loadDailyChallengeData(); // Refresh data
    } catch (error) {
      console.error('Failed to complete challenge:', error);
    }
  };

  const getStreakColor = (days: number) => {
    if (days >= 30) return 'text-purple-600 bg-purple-100';
    if (days >= 14) return 'text-orange-600 bg-orange-100';
    if (days >= 7) return 'text-blue-600 bg-blue-100';
    if (days >= 3) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStreakIcon = (days: number) => {
    if (days >= 30) return <Crown className="w-6 h-6" />;
    if (days >= 14) return <Trophy className="w-6 h-6" />;
    if (days >= 7) return <Medal className="w-6 h-6" />;
    return <Flame className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading daily challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Daily Challenge</h1>
                  <p className="text-gray-600">Complete daily challenges to build your streak!</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium"
              >
                History
              </button>
              <button
                onClick={() => setShowRewards(true)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors font-medium"
              >
                Rewards
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Current Streak */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${getStreakColor(streak?.currentStreak || 0)}`}>
                {getStreakIcon(streak?.currentStreak || 0)}
              </div>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {streak?.currentStreak || 0}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
            <div className="text-xs text-orange-600 mt-1">
              Best: {streak?.longestStreak || 0} days
            </div>
          </div>

          {/* Today's Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-green-100">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {todayChallenges.filter(c => c.completed).length}/{todayChallenges.length}
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {Math.round((todayChallenges.filter(c => c.completed).length / todayChallenges.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Today's Progress</div>
          </div>

          {/* Total XP */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats?.totalXP || 0}
            </div>
            <div className="text-sm text-gray-600">Total XP Earned</div>
            <div className="text-xs text-blue-600 mt-1">
              +{stats?.todayXP || 0} today
            </div>
          </div>

          {/* Rank */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-purple-100">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              #{stats?.globalRank || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Global Rank</div>
            <div className="text-xs text-purple-600 mt-1">
              {stats?.rankChange && stats.rankChange > 0 ? '↑' : stats?.rankChange && stats.rankChange < 0 ? '↓' : '='} 
              {Math.abs(stats?.rankChange || 0)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b">
            {[
              { key: 'challenges', label: 'Today\'s Challenges', icon: Target },
              { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { key: 'achievements', label: 'Achievements', icon: Award }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-4 px-6 font-semibold transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === tab.key
                    ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {/* Streak Display */}
            {streak && <StreakDisplay streak={streak} />}

            {/* Today's Challenges */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Today's Challenges</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Resets in {dailyChallengeService.getTimeUntilReset()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {todayChallenges.map((challenge, index) => (
                  <DailyChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    index={index}
                    onStart={() => onChallengeStart(challenge)}
                    onComplete={handleChallengeComplete}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardSection />
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Achievement cards will be implemented */}
              <div className="text-center py-12 col-span-full">
                <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Achievements system coming soon!</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ChallengeHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      <RewardsModal
        isOpen={showRewards}
        onClose={() => setShowRewards(false)}
        streak={streak}
      />
    </div>
  );
}