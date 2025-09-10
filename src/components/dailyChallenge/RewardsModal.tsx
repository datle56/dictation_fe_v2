import React from 'react';
import { X, Gift, Star, Crown, Trophy, Zap, Award } from 'lucide-react';
import { ChallengeStreak } from '../../types/dailyChallenge';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: ChallengeStreak | null;
}

export default function RewardsModal({ isOpen, onClose, streak }: RewardsModalProps) {
  const rewards = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first daily challenge',
      requirement: 'Complete 1 challenge',
      icon: Star,
      color: 'green',
      unlocked: streak ? streak.totalChallengesCompleted >= 1 : false,
      reward: '50 XP + Beginner Badge'
    },
    {
      id: 2,
      title: 'Streak Starter',
      description: 'Maintain a 3-day challenge streak',
      requirement: '3-day streak',
      icon: Zap,
      color: 'blue',
      unlocked: streak ? streak.currentStreak >= 3 : false,
      reward: '100 XP + 10% XP Bonus'
    },
    {
      id: 3,
      title: 'Week Warrior',
      description: 'Complete challenges for 7 consecutive days',
      requirement: '7-day streak',
      icon: Trophy,
      color: 'purple',
      unlocked: streak ? streak.currentStreak >= 7 : false,
      reward: '250 XP + 25% XP Bonus'
    },
    {
      id: 4,
      title: 'Dedication Master',
      description: 'Achieve a 14-day challenge streak',
      requirement: '14-day streak',
      icon: Award,
      color: 'orange',
      unlocked: streak ? streak.currentStreak >= 14 : false,
      reward: '500 XP + 50% XP Bonus'
    },
    {
      id: 5,
      title: 'Monthly Champion',
      description: 'Complete challenges for 30 consecutive days',
      requirement: '30-day streak',
      icon: Crown,
      color: 'yellow',
      unlocked: streak ? streak.currentStreak >= 30 : false,
      reward: '1000 XP + 75% XP Bonus + Crown Badge'
    },
    {
      id: 6,
      title: 'Legend Status',
      description: 'Achieve the ultimate 100-day streak',
      requirement: '100-day streak',
      icon: Crown,
      color: 'purple',
      unlocked: streak ? streak.currentStreak >= 100 : false,
      reward: '2500 XP + 100% XP Bonus + Legend Badge'
    }
  ];

  const getColorClasses = (color: string, unlocked: boolean) => {
    if (!unlocked) return 'bg-gray-100 text-gray-400 border-gray-200';
    
    switch (color) {
      case 'green': return 'bg-green-100 text-green-600 border-green-200';
      case 'blue': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'purple': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'orange': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Streak Rewards</h2>
              <p className="text-purple-100">Unlock amazing rewards by maintaining your streak!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Streak Info */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                🔥 {streak?.currentStreak || 0} Day Streak
              </div>
              <div className="text-gray-600">
                Current XP Bonus: +{Math.min((streak?.currentStreak || 0) * 5, 100)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800">
                Total Rewards Unlocked
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {rewards.filter(r => r.unlocked).length}/{rewards.length}
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map((reward) => {
              const IconComponent = reward.icon;
              return (
                <div
                  key={reward.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    reward.unlocked
                      ? 'bg-white border-green-200 shadow-lg'
                      : 'bg-gray-50 border-gray-200 opacity-75'
                  }`}
                >
                  {/* Unlock Status */}
                  <div className="absolute -top-2 -right-2">
                    {reward.unlocked ? (
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{reward.id}</span>
                      </div>
                    )}
                  </div>

                  {/* Reward Icon */}
                  <div className={`inline-flex p-3 rounded-xl mb-4 border-2 ${getColorClasses(reward.color, reward.unlocked)}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>

                  {/* Reward Info */}
                  <div className="mb-4">
                    <h3 className={`text-xl font-bold mb-2 ${reward.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                      {reward.title}
                    </h3>
                    <p className={`text-sm mb-3 ${reward.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {reward.description}
                    </p>
                    <div className={`text-xs font-medium mb-2 ${reward.unlocked ? 'text-blue-600' : 'text-gray-400'}`}>
                      Requirement: {reward.requirement}
                    </div>
                  </div>

                  {/* Reward Details */}
                  <div className={`p-3 rounded-lg border ${
                    reward.unlocked 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-100 border-gray-200'
                  }`}>
                    <div className={`text-sm font-medium ${reward.unlocked ? 'text-green-800' : 'text-gray-500'}`}>
                      Reward: {reward.reward}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  {!reward.unlocked && streak && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>
                          {Math.min(streak.currentStreak, parseInt(reward.requirement.split('-')[0]))} / {parseInt(reward.requirement.split('-')[0])}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (streak.currentStreak / parseInt(reward.requirement.split('-')[0])) * 100,
                              100
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}