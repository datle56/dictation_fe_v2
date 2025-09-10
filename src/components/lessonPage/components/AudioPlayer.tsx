import { useRef, useState } from 'react';
import { Play, Pause, X } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string;
  timeStart: number;
  timeEnd: number;
  onError?: (error: string) => void;
  className?: string;
}

export default function AudioPlayer({ 
  audioSrc, 
  timeStart, 
  timeEnd, 
  onError,
  className = ""
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = async () => {
    if (!audioRef.current) return;
    
    try {
      setAudioError(false);
      setIsPlaying(true);
      
      audioRef.current.src = audioSrc;
      audioRef.current.currentTime = timeStart;
      
      await audioRef.current.play();
      
      // Stop audio at the specified end time
      const duration = (timeEnd - timeStart) * 1000;
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }, duration);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioError(true);
      setIsPlaying(false);
      onError?.('Failed to play audio');
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={isPlaying ? stopAudio : playAudio}
          className={`p-6 rounded-full shadow-lg transition-all transform hover:scale-105 ${
            audioError 
              ? 'bg-red-500 hover:bg-red-600' 
              : isPlaying 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {audioError ? (
            <X className="w-8 h-8" />
          ) : isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </button>
      </div>
      <p className="mt-4 text-gray-600">
        {audioError ? 'Audio error - please try again' : 'Click to play audio'}
      </p>
      
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setAudioError(true);
          setIsPlaying(false);
          onError?.('Audio playback failed');
        }}
      />
    </div>
  );
}
