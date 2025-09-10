import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ApiLesson } from '../../types/types';
import { useChallenges } from '../../hooks/useApi';
import { checkAnswer, formatCorrectAnswer, WordMatchResult } from './utils/answerChecker';
import { SoundEffects } from './utils/soundEffects';
import { calculateErrorPosition } from './utils/errorPositionCalculator';
import MediaPlayer from './components/MediaPlayer';
import AnswerInput from './components/AnswerInput';
import AnswerResult from './components/AnswerResult';
import ProgressBar from './components/ProgressBar';
import ConfettiEffect from './components/ConfettiEffect';
import LessonCompletionModal from './components/LessonCompletionModal';

interface LessonPageProps {
  lesson: ApiLesson;
  onBack: () => void;
}

export default function LessonPage({ lesson, onBack }: LessonPageProps) {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerResult, setAnswerResult] = useState<WordMatchResult | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [lessonStartTime] = useState(Date.now());
  // Toggle states for answer modes
  const [useProgressiveHint, setUseProgressiveHint] = useState(false);
  const [showFullAnswer, setShowFullAnswer] = useState(false);
  const [hintedWordsCount, setHintedWordsCount] = useState(0);
  // Error position for cursor placement
  const [errorPosition, setErrorPosition] = useState<number | undefined>(undefined);

  const { challenges, loading } = useChallenges(lesson.id);

  const currentChallenge = challenges[currentChallengeIndex];

  const handleSubmit = () => {
    if (!currentChallenge || !userAnswer.trim() || lessonCompleted) return;

    // Use word-by-word matching logic
    const result = checkAnswer(userAnswer, currentChallenge.solution);
    setAnswerResult(result);

    // Calculate error position for cursor placement if answer is incorrect
    if (!result.isCorrect) {
      const errorPosResult = calculateErrorPosition(currentChallenge.solution, userAnswer);
      // Use setTimeout to ensure answerResult is rendered first
      setTimeout(() => {
        setErrorPosition(errorPosResult.errorPosition);
      }, 0);
    } else {
      setErrorPosition(undefined);
    }

    // For progressive hint mode, only hint next word if current hinted words are correct
    if (useProgressiveHint && !result.isCorrect) {
      // Check if all currently hinted words are correct
      let allHintedWordsCorrect = true;
      for (let i = 0; i < hintedWordsCount; i++) {
        if (!result.wordResults[i]?.isCorrect) {
          allHintedWordsCorrect = false;
          break;
        }
      }

      // Only hint next word if all current hinted words are correct
      if (allHintedWordsCorrect && hintedWordsCount < currentChallenge.solution.length) {
        setHintedWordsCount(prev => prev + 1);
      }
    }

    // Check if this is the last challenge and answer is correct
    if (result.isCorrect && currentChallengeIndex === challenges.length - 1 && !lessonCompleted) {
      // Mark lesson as completed to prevent multiple triggers
      setLessonCompleted(true);

      // Play celebration sound only for the last challenge
      SoundEffects.playCelebrationSound();

      // Show completion modal immediately
      setShowCompletionModal(true);

      // Trigger celebration effect
      setShowConfetti(true);
    }
  };

  const handleAnswerChange = (newAnswer: string) => {
    setUserAnswer(newAnswer);
    // Clear previous result when user types
    if (answerResult) {
      setAnswerResult(null);
    }
    // Clear error position when user types
    if (errorPosition !== undefined) {
      setErrorPosition(undefined);
    }
  };

  const handleNext = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setUserAnswer('');
      setAnswerResult(null);
      setAudioError(null);
      setHintedWordsCount(0); // Reset hinted words for new challenge
      setErrorPosition(undefined); // Reset error position
    }
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    setShowConfetti(false);
    onBack(); // Go back to previous page
  };

  const handleConfettiComplete = () => {
    // Confetti animation finished
    setShowConfetti(false);
  };

  // Reset state when challenge changes
  useEffect(() => {
    setUserAnswer('');
    setAnswerResult(null);
    setAudioError(null);
    setHintedWordsCount(0); // Reset hinted words when challenge changes
    setErrorPosition(undefined); // Reset error position when challenge changes
  }, [currentChallengeIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!currentChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No challenges available for this lesson.</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{lesson.lesson_name}</h1>
                <p className="text-sm text-gray-600">
                  Challenge {currentChallengeIndex + 1} of {challenges.length}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <ProgressBar
              current={currentChallengeIndex + 1}
              total={challenges.length}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Dictation Challenge {currentChallengeIndex + 1}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
          </div>

          {/* Media Player */}
          <MediaPlayer
            audioSrc={currentChallenge.audio_src}
            youtubeUrl={lesson.youtube_url || undefined}
            timeStart={currentChallenge.time_start}
            timeEnd={currentChallenge.time_end}
            onError={setAudioError}
            className="mb-8"
          />

          {/* Hint */}
          {currentChallenge.hint && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Hint:</strong> {currentChallenge.hint}
              </p>
            </div>
          )}

          {/* Audio Error Display */}
          {audioError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <strong>Audio Error:</strong> {audioError}
              </p>
            </div>
          )}


          {/* Answer Mode Toggles */}
          <div className="mb-4 flex items-center gap-6">
            <label className="font-medium text-gray-700">Answer Mode:</label>

            {/* Progressive Hint Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useProgressiveHint}
                  onChange={(e) => setUseProgressiveHint(e.target.checked)}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${
                  useProgressiveHint ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  useProgressiveHint ? 'translate-x-4' : 'translate-x-0'
                }`}></div>
              </div>
              <span className="text-sm text-gray-700">
                {useProgressiveHint ? 'Progressive Hint' : 'Show Answer Immediately'}
              </span>
            </label>

            {/* Full Answer Display Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showFullAnswer}
                  onChange={(e) => setShowFullAnswer(e.target.checked)}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${
                  showFullAnswer ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  showFullAnswer ? 'translate-x-4' : 'translate-x-0'
                }`}></div>
              </div>
              <span className="text-sm text-gray-700">Show Full Answer</span>
            </label>
          </div>

          {/* Input Field */}
          <AnswerInput
            value={userAnswer}
            onChange={handleAnswerChange}
            onSubmit={handleSubmit}
            disabled={lessonCompleted} // Disable when lesson is completed
            placeholder={lessonCompleted ? "Lesson completed! 🎉" : "Type what you hear or use voice input..."}
            className="mb-8"
            errorPosition={errorPosition}
          />

          {/* Result Display */}
          {answerResult && (
            <AnswerResult
              result={answerResult}
              correctAnswer={formatCorrectAnswer(currentChallenge.solution)}
              explanation={currentChallenge.explanation || undefined}
              hint={currentChallenge.hint || undefined}
              className="mb-8"
              useProgressiveHint={useProgressiveHint}
              showFullAnswer={showFullAnswer}
              solution={currentChallenge.solution}
              hintedWordsCount={hintedWordsCount}
            />
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim() || lessonCompleted}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {lessonCompleted ? 'Lesson Completed!' : 'Check Answer'}
              </button>

              {answerResult && answerResult.isCorrect && currentChallengeIndex < challenges.length - 1 && (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  <span>Next Challenge</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Lesson Completion Modal */}
      <LessonCompletionModal
        isOpen={showCompletionModal}
        onClose={handleCloseCompletionModal}
        lessonName={lesson.lesson_name}
        totalChallenges={challenges.length}
        timeSpent={Math.floor((Date.now() - lessonStartTime) / 1000)}
        accuracy={100} // You can calculate this based on correct answers
      />

      {/* Confetti Effect - Behind modal */}
      <ConfettiEffect
        isActive={showConfetti}
        duration={5000}
        onComplete={handleConfettiComplete}
      />
    </div>
  );
}