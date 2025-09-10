import { useEffect, useState } from 'react';
import { CheckCircle, Star, Trophy, Clock, Target } from 'lucide-react';

interface LessonCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonName: string;
  totalChallenges: number;
  timeSpent?: number;
  accuracy?: number;
}

export default function LessonCompletionModal({
  isOpen,
  onClose,
  lessonName,
  totalChallenges,
  timeSpent = 0,
  accuracy = 100
}: LessonCompletionModalProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Show content immediately
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full transform transition-all duration-500 scale-100">
        {/* Header with celebration */}
        <div className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 p-6 rounded-t-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/40 via-teal-200/40 to-cyan-200/40 animate-pulse"></div>
          
          {showContent && (
            <div className="relative z-10">
              <div className="mb-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                🎉 Chúc mừng! 🎉
              </h2>
              <p className="text-gray-700 text-base">
                Bạn đã hoàn thành bài học!
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        {showContent && (
          <div className="p-5 space-y-4">
            {/* Lesson Info */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {lessonName}
              </h3>
              <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm">
                <Target className="w-4 h-4" />
                <span>{totalChallenges} thử thách hoàn thành</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 p-3 rounded-xl text-center">
                <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Thời gian</p>
                <p className="font-semibold text-emerald-800 text-sm">{formatTime(timeSpent)}</p>
              </div>
              
              <div className="bg-teal-50 p-3 rounded-xl text-center">
                <Star className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Độ chính xác</p>
                <p className="font-semibold text-teal-800 text-sm">{accuracy}%</p>
              </div>
            </div>

            {/* Achievement */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-xl border border-emerald-200">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Thành tích mới!</p>
                  <p className="text-xs text-gray-600">Hoàn thành bài học đầu tiên</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all font-semibold text-sm"
              >
                Tiếp tục học
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
