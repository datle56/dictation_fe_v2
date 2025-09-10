import React, { useState } from 'react';
import { ArrowLeft, Play, Volume2, Check, X, RotateCcw } from 'lucide-react';

interface YoutubePageProps {
  onBack: () => void;
}

export default function YoutubePage({ onBack }: YoutubePageProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Sample challenges for demo
  const challenges = [
    {
      id: 1,
      text: "Welcome to our channel where we explore the fascinating world of technology.",
      timestamp: "0:05"
    },
    {
      id: 2,
      text: "Today we're going to discuss artificial intelligence and its impact on society.",
      timestamp: "0:15"
    },
    {
      id: 3,
      text: "Machine learning algorithms are becoming increasingly sophisticated.",
      timestamp: "0:30"
    }
  ];

  const handleProcessVideo = () => {
    if (!youtubeUrl.trim()) return;
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowLesson(true);
    }, 2000);
  };

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === challenges[currentChallenge].text.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setUserAnswer('');
      setShowResult(false);
    }
  };

  const handleRetry = () => {
    setUserAnswer('');
    setShowResult(false);
  };

  const playAudio = () => {
    console.log('Playing audio for challenge:', currentChallenge);
  };

  if (showLesson) {
    const progress = ((currentChallenge + 1) / challenges.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowLesson(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">YouTube Dictation</h1>
                  <p className="text-sm text-gray-600">
                    Challenge {currentChallenge + 1} of {challenges.length}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* Video Player */}
            <div className="mb-8">
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Timestamp: {challenges[currentChallenge].timestamp}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Listen and Type
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
            </div>

            {/* Audio Control */}
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={playAudio}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-full shadow-lg transition-all transform hover:scale-105"
                >
                  <Volume2 className="w-8 h-8" />
                </button>
                <p className="mt-4 text-gray-600">Click to replay audio segment</p>
              </div>
              
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type what you hear..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                disabled={showResult}
              />
            </div>

            {/* Result Display */}
            {showResult && (
              <div className={`mt-8 p-6 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  {isCorrect ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-red-600" />
                  )}
                  <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                {!isCorrect && (
                  <p className="text-gray-700">
                    <span className="font-medium">Correct answer:</span> {challenges[currentChallenge].text}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              {showResult ? (
                <div className="flex space-x-4 ml-auto">
                  {!isCorrect && (
                    <button
                      onClick={handleRetry}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Try Again</span>
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={currentChallenge === challenges.length - 1}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      {currentChallenge === challenges.length - 1 ? 'Complete' : 'Next'}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim()}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Submit Answer
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            <div>
              <h1 className="text-2xl font-bold text-gray-800">YouTube Dictation</h1>
              <p className="text-gray-600">Learn from any YouTube video</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="bg-red-100 p-4 rounded-2xl inline-block mb-4">
              <Play className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Turn YouTube Videos into Dictation Lessons
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Paste any YouTube URL and we'll automatically create dictation exercises 
              from the video's audio content.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                />
              </div>

              <button
                onClick={handleProcessVideo}
                disabled={!youtubeUrl.trim() || isProcessing}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing Video...</span>
                  </div>
                ) : (
                  'Create Dictation Lesson'
                )}
              </button>
            </div>

            {/* Sample Video Preview */}
            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sample Video</h3>
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Sample YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Try with this sample video or paste your own YouTube URL above
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}