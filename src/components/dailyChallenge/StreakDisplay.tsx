import React from 'react';
import { Flame, Crown, Trophy, Medal, Star } from 'lucide-react';
import { ChallengeStreak } from '../../types/dailyChallenge';

interface StreakDisplayProps {
  streak: ChallengeStreak;
}

export default function StreakDisplay({ streak }: StreakDisplayProps) {
  const getStreakMilestones = () => {
    const milestones = [3, 7, 14, 30, 50, 100];
    return milestones.map(milestone => ({
      days: milestone,
      achieved: streak.currentStreak >= milestone,
      icon: milestone >= 100 ? Crown : milestone >= 50 ? Trophy : milestone >= 30 ? Medal : milestone >= 14 ? Star : Flame,
      color: milestone >= 100 ? 'purple' : milestone >= 50 ? 'yellow' : milestone >= 30 ? 'orange' : milestone >= 14 ? 'blue' : 'green'
    }));
  };

  const milestones = getStreakMilestones();
  const nextMilestone = milestones.find(m => !m.achieved);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">🔥 Streak Power</h2>
          <p className="text-orange-100">Keep your daily challenge streak alive!</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">{streak.currentStreak}</div>
          <div className="text-orange-200 text-sm">days</div>
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-orange-100 text-sm">Last 7 days</span>
          <span className="text-orange-100 text-sm">
            Best: {streak.longestStreak} days
          </span>
        </div>
        <div className="flex space-x-2">
          {streak.last7Days.map((completed, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                completed
                  ? 'bg-white text-orange-500'
                  : 'bg-orange-400 text-orange-200'
              }`}
            >
              {completed ? '✓' : '○'}
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-orange-100 text-sm">Milestones</span>
          {nextMilestone && (
            <span className="text-orange-100 text-sm">
              Next: {nextMilestone.days - streak.currentStreak} days to {nextMilestone.days}
            </span>
          )}
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {milestones.map((milestone, index) => {
            const IconComponent = milestone.icon;
            return (
              <div
                key={index}
                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  milestone.achieved
                    ? 'bg-white text-orange-500'
                    : 'bg-orange-400 text-orange-200'
                }`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Bonus */}
      <div className="bg-orange-400 bg-opacity-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Streak Bonus</div>
            <div className="text-orange-100 text-sm">
              +{Math.min(streak.currentStreak * 5, 100)}% XP multiplier
            </div>
          </div>
          <div className="text-2xl font-bold">
            {Math.min(streak.currentStreak * 5, 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}