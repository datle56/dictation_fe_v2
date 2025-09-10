import React, { useState } from 'react';
import { Play, Check, Lock, Star, Clock, Trophy, Zap } from 'lucide-react';
import { DailyChallenge } from '../../types/dailyChallenge';

interface DailyChallengeCardProps {
  challenge: DailyChallenge;
  index: number;
  onStart: () => void;
  onComplete: (challengeId: string, score: number, timeSpent: number) => void;
}

export default function DailyChallengeCard({ 
  challenge, 
  index, 
  onStart, 
  onComplete 
}: DailyChallengeCardProps) {
  const [isStarting, setIsStarting] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'speed': return <Zap className="w-5 h-5" />;
      case 'accuracy': return <Star className="w-5 h-5" />;
      case 'endurance': return <Trophy className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  const getCardStyle = () => {
    if (challenge.completed) {
      return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
    }
    if (challenge.locked) {
      return 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 opacity-60';
    }
    return 'bg-gradient-to-br from-white to-orange-50 border-orange-200 hover:shadow-lg hover:scale-105';
  };

  const handleStart = () => {
    if (challenge.locked || challenge.completed) return;
    
    setIsStarting(true);
    setTimeout(() => {
      onStart();
      setIsStarting(false);
    }, 500);
  };

  return (
    <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${getCardStyle()}`}>
      {/* Challenge Number Badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
        {index + 1}
      </div>

      {/* Status Badge */}
      <div className="absolute -top-2 -right-2">
        {challenge.completed ? (
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
        ) : challenge.locked ? (
          <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
        ) : null}
      </div>

      {/* Challenge Icon */}
      <div className={`inline-flex p-3 rounded-xl mb-4 ${
        challenge.completed ? 'bg-green-100 text-green-600' :
        challenge.locked ? 'bg-gray-100 text-gray-400' :
        'bg-orange-100 text-orange-600'
      }`}>
        {getChallengeIcon(challenge.type)}
      </div>

      {/* Challenge Info */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{challenge.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
        
        {/* Difficulty & Rewards */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>
          <div className="flex items-center space-x-1 text-orange-600">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">{challenge.xpReward} XP</span>
          </div>
        </div>

        {/* Time Limit */}
        <div className="flex items-center space-x-2 text-gray-500 text-sm">
          <Clock className="w-4 h-4" />
          <span>{challenge.timeLimit} minutes</span>
        </div>
      </div>

      {/* Progress or Score */}
      {challenge.completed && challenge.score !== undefined && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700">Your Score:</span>
            <span className="font-bold text-green-800">{challenge.score}%</span>
          </div>
          {challenge.completedAt && (
            <div className="text-xs text-green-600 mt-1">
              Completed at {new Date(challenge.completedAt).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleStart}
        disabled={challenge.locked || challenge.completed || isStarting}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
          challenge.completed
            ? 'bg-green-100 text-green-700 cursor-default'
            : challenge.locked
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105'
        }`}
      >
        {isStarting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Starting...</span>
          </>
        ) : challenge.completed ? (
          <>
            <Check className="w-4 h-4" />
            <span>Completed</span>
          </>
        ) : challenge.locked ? (
          <>
            <Lock className="w-4 h-4" />
            <span>Locked</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Start Challenge</span>
          </>
        )}
      </button>

      {/* Unlock Condition */}
      {challenge.locked && challenge.unlockCondition && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          {challenge.unlockCondition}
        </div>
      )}
    </div>
  );
}