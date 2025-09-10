import React, { useState, useEffect } from 'react';
import { X, Calendar, Trophy, Clock, Star, TrendingUp } from 'lucide-react';
import { DailyChallengeHistory } from '../../types/dailyChallenge';
import { dailyChallengeService } from '../../services/dailyChallengeService';

interface ChallengeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChallengeHistoryModal({ isOpen, onClose }: ChallengeHistoryModalProps) {
  const [history, setHistory] = useState<DailyChallengeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, selectedMonth, selectedYear]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await dailyChallengeService.getChallengeHistory(selectedYear, selectedMonth);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load challenge history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Challenge History</h2>
              <p className="text-gray-600">Your daily challenge performance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Month/Year Selector */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No challenge history for this period</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((day) => (
                <div key={day.date} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-semibold text-gray-800">
                        {formatDate(day.date)}
                      </div>
                      {day.streakDay && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <span className="text-sm">🔥</span>
                          <span className="text-sm font-medium">Day {day.streakDay}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-800">{day.totalXP} XP</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {day.challenges.map((challenge, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-800">
                            Challenge {index + 1}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(challenge.score)}`}>
                            {challenge.score}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(challenge.timeSpent)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-3 h-3" />
                            <span>{challenge.xpEarned} XP</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}