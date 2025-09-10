import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { speechToTextService } from '../utils/speechToText';
import { setCursorPosition } from '../utils/errorPositionCalculator';

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  errorPosition?: number;
}

export default function AnswerInput({ 
  value, 
  onChange, 
  onSubmit, 
  disabled = false,
  placeholder = "Type what you hear...",
  className = "",
  errorPosition
}: AnswerInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim() && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  };

  const startSpeechRecognition = () => {
    if (!speechToTextService.isSpeechRecognitionSupported()) {
      setSpeechError('Speech recognition is not supported in this browser');
      return;
    }

    setIsListening(true);
    setSpeechError(null);

    speechToTextService.startRecognition(
      (result) => {
        if (result.isFinal) {
          onChange(result.text);
          setIsListening(false);
        } else {
          // Update input with interim results
          onChange(result.text);
        }
      },
      (error) => {
        setSpeechError(error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      {
        language: 'en-US',
        continuous: false,
        interimResults: true
      }
    );
  };

  const stopSpeechRecognition = () => {
    speechToTextService.stopRecognition();
    setIsListening(false);
  };

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Handle error position cursor placement
  useEffect(() => {
    if (errorPosition !== undefined && inputRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        // Additional small delay to ensure input is focused and rendered
        setTimeout(() => {
          if (inputRef.current) {
            setCursorPosition(inputRef, errorPosition);
          }
        }, 50);
      });
    }
  }, [errorPosition]);

  return (
    <div className={className}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 pr-16 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          disabled={disabled}
          onKeyDown={handleKeyDown}
        />
        
        {/* Speech Recognition Button */}
        <button
          type="button"
          onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
          disabled={disabled}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Speech Error Message */}
      {speechError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{speechError}</p>
        </div>
      )}
      
      {/* Listening Indicator */}
      {isListening && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm flex items-center">
            <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Listening... Speak now
          </p>
        </div>
      )}
    </div>
  );
}
