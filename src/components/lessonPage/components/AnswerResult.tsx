import { Check, X } from 'lucide-react';
import { WordMatchResult } from '../utils/answerChecker';

interface AnswerResultProps {
  result: WordMatchResult;
  correctAnswer: string;
  explanation?: string;
  hint?: string;
  className?: string;
  useProgressiveHint?: boolean;
  showFullAnswer?: boolean;
  userInput?: string;
  solution?: string[][];
  hintedWordsCount?: number;
}

export default function AnswerResult({
  result,
  correctAnswer,
  explanation,
  hint,
  className = "",
  useProgressiveHint = false,
  showFullAnswer = false,
  solution = [],
  hintedWordsCount = 0
}: AnswerResultProps) {
  const { isCorrect, wordResults, totalWords, correctWords } = result;
  console.log('AnswerResult result:', result);
  console.log('AnswerResult wordResults:', wordResults);

  return (
    <div className={`p-6 rounded-xl ${isCorrect
      ? 'bg-green-50 border border-green-200'
      : 'bg-red-50 border border-red-200'
      } ${className}`}>
      {/* Result Header */}
      <div className="flex items-center space-x-3 mb-4">
        {isCorrect ? (
          <Check className="w-6 h-6 text-green-600" />
        ) : (
          <X className="w-6 h-6 text-red-600" />
        )}
        <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </span>
        {!isCorrect && (
          <span className="text-sm text-gray-600">
            ({correctWords}/{totalWords} words correct)
          </span>
        )}
      </div>

      {/* Word-by-word Analysis */}
      {!isCorrect && (
        <div className="mb-4">
          {/* <p className="font-medium mb-2 text-gray-700">Your answer:</p> */}
          <div className="flex flex-wrap gap-2 mb-3">
            {(() => {
              if (useProgressiveHint) {
                // Progressive hint mode: hiển thị từng từ theo thứ tự hint
                return solution.map((wordVariants, idx) => {
                  const isHinted = idx < hintedWordsCount;
                  const isUserCorrect = wordResults[idx]?.isCorrect || false;

                  if (isHinted || isUserCorrect) {
                    // Hiển thị từ đã hint hoặc từ user đã nhập đúng
                    let colorClass = isUserCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800';
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${colorClass}`}
                      >
                        {wordVariants[0]}
                      </span>
                    );
                  } else {
                    // Hiển thị dấu gạch dưới cho từ chưa hint và chưa đúng
                    return (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-500"
                      >
                        {'_'.repeat(wordVariants[0].length)}
                      </span>
                    );
                  }
                });
              } else {
                // Show answer immediately mode: logic cũ
                return wordResults.map((wordResult, idx) => {
                  if (wordResult.word) {
                    let colorClass = wordResult.isCorrect
                      ? 'bg-green-100 text-green-800'
                      : wordResult.isAlmostCorrect
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800';
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${colorClass}`}
                      >
                        {wordResult.word}
                      </span>
                    );
                  } else {
                    // Hiện _ với số ký tự tương ứng
                    return (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-500"
                      >
                        {'_'.repeat((solution[idx]?.[0] || '').length)}
                      </span>
                    );
                  }
                });
              }
            })()}
          </div>
          {showFullAnswer && (
            <>
              {/* <p className="font-medium mb-2 text-gray-700">Correct answer:</p> */}
              <p className="text-lg font-semibold text-gray-800">{correctAnswer}</p>
            </>
          )}
        </div>
      )}

      {/* Hint */}
      {hint && !isCorrect && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Hint:</strong> {hint}
          </p>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Explanation:</strong> {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
