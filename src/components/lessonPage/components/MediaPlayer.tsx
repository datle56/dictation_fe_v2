import AudioPlayer from './AudioPlayer';
import YouTubePlayer from './YouTubePlayer';

interface MediaPlayerProps {
  audioSrc: string;
  youtubeUrl?: string;
  timeStart: number;
  timeEnd: number;
  onError?: (error: string) => void;
  className?: string;
}

export default function MediaPlayer({ 
  audioSrc, 
  youtubeUrl,
  timeStart, 
  timeEnd, 
  onError,
  className = ""
}: MediaPlayerProps) {
  // Check if audio_src is null or empty, and youtubeUrl exists
  const isYouTubeChallenge = (!audioSrc || audioSrc === 'null' || audioSrc.trim() === '') && youtubeUrl;

  if (isYouTubeChallenge) {
    return (
      <YouTubePlayer
        youtubeUrl={youtubeUrl}
        timeStart={timeStart}
        timeEnd={timeEnd}
        onError={onError}
        className={className}
      />
    );
  }

  // Default to audio player for regular audio challenges
  return (
    <AudioPlayer
      audioSrc={audioSrc}
      timeStart={timeStart}
      timeEnd={timeEnd}
      onError={onError}
      className={className}
    />
  );
}
