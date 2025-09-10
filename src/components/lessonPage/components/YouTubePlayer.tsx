import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, X, RotateCcw } from 'lucide-react';

interface YouTubePlayerProps {
  youtubeUrl: string;
  timeStart: number;
  timeEnd: number;
  onError?: (error: string) => void;
  className?: string;
}

export interface YouTubePlayerRef {
  playVideo: () => void;
  stopVideo: () => void;
  seekTo: (time: number) => void;
}

const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(({ 
  youtubeUrl, 
  timeStart, 
  timeEnd, 
  onError,
  className = ""
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const timeCheckIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scriptLoadedRef = useRef(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(youtubeUrl);

  // Helper function to wait for YouTube methods to be available
  const waitForYouTubeMethods = (callback: () => void, maxRetries = 10, delay = 200) => {
    let retries = 0;
    
    const checkMethods = () => {
      if (youtubePlayerRef.current && 
          typeof youtubePlayerRef.current.seekTo === 'function' &&
          typeof youtubePlayerRef.current.playVideo === 'function' &&
          typeof youtubePlayerRef.current.pauseVideo === 'function' &&
          typeof youtubePlayerRef.current.getCurrentTime === 'function') {
        console.log('[YouTube Player] All methods are now available');
        callback();
      } else if (retries < maxRetries) {
        retries++;
        console.log(`[YouTube Player] Methods not ready, retrying... (${retries}/${maxRetries})`);
        setTimeout(checkMethods, delay);
      } else {
        console.error('[YouTube Player] Methods never became available after', maxRetries, 'retries');
        setPlayerError(true);
        onError?.('YouTube player methods not available');
      }
    };
    
    checkMethods();
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    playVideo,
    stopVideo,
    seekTo: (time: number) => {
      if (youtubePlayerRef.current && isInitialized && typeof youtubePlayerRef.current.seekTo === 'function') {
        try {
          youtubePlayerRef.current.seekTo(time, true);
        } catch (error) {
          console.error('Error seeking video:', error);
          onError?.('Failed to seek video');
        }
      }
    }
  }));

  useEffect(() => {
    if (!videoId) {
      setPlayerError(true);
      onError?.('Invalid YouTube URL');
      return;
    }

    // Load YouTube API if not already loaded
    if (!(window as any).YT && !scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      document.head.appendChild(tag);
    }

    // Initialize player when API is ready
    const initializePlayer = () => {
      if (playerRef.current && (window as any).YT && (window as any).YT.Player) {
        try {
          // Clear any existing player
          if (youtubePlayerRef.current && typeof youtubePlayerRef.current.destroy === 'function') {
            youtubePlayerRef.current.destroy();
          }
          
          youtubePlayerRef.current = new (window as any).YT.Player(playerRef.current, {
            height: '315',
            width: '100%',
            videoId: videoId,
            playerVars: {
              'playsinline': 1,
              'controls': 1,
              'modestbranding': 1,
              'rel': 0,
              'showinfo': 0,
              'enablejsapi': 1,
              'origin': window.location.origin
            },
            events: {
              'onReady': () => {
                setPlayerReady(true);
                setIsInitialized(true);
                console.log('YouTube player ready');
              },
              'onError': (event: any) => {
                console.error('YouTube Player Error:', event.data);
                setPlayerError(true);
                setIsPlaying(false);
                setIsInitialized(false);
                onError?.('Failed to load YouTube video');
              },
              'onStateChange': (event: any) => {
                // Handle player state changes
                if (event.data === (window as any).YT.PlayerState.ENDED) {
                  setIsPlaying(false);
                }
              }
            }
          });
        } catch (error) {
          console.error('Error initializing YouTube player:', error);
          setPlayerError(true);
          setIsInitialized(false);
          onError?.('Failed to initialize YouTube player');
        }
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initializePlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      // Clear timeout
      if (timeCheckIntervalRef.current) {
        clearTimeout(timeCheckIntervalRef.current);
        timeCheckIntervalRef.current = null;
      }
      
      // Clear interval
      if ((timeCheckIntervalRef as any).intervalId) {
        clearInterval((timeCheckIntervalRef as any).intervalId);
        (timeCheckIntervalRef as any).intervalId = null;
      }
      
      // Destroy player
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.destroy === 'function') {
        try {
          youtubePlayerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying YouTube player:', error);
        }
        youtubePlayerRef.current = null;
      }
      
      setIsInitialized(false);
      setPlayerReady(false);
    };
  }, [videoId, onError]);

  // Auto seek to timeStart when challenge changes
  useEffect(() => {
    if (youtubePlayerRef.current && playerReady && isInitialized) {
      seekToTime();
    }
  }, [timeStart, playerReady, isInitialized]);

  const playVideo = () => {
    if (!youtubePlayerRef.current || !playerReady || !isInitialized) return;
    
    waitForYouTubeMethods(() => {
      try {
        setPlayerError(false);
        setIsPlaying(true);
        
        // Clear any existing timeout
        if (timeCheckIntervalRef.current) {
          clearTimeout(timeCheckIntervalRef.current);
          timeCheckIntervalRef.current = null;
        }
        
        // Seek to start time and play (like the original implementation)
        console.log(`[YouTube Player] Starting playback: ${timeStart.toFixed(2)}s - ${timeEnd.toFixed(2)}s`);
        youtubePlayerRef.current.seekTo(timeStart, true);
        youtubePlayerRef.current.playVideo();
        
        // Start checking for end time (like the original E() function)
        // Give video a moment to start playing before checking
        console.log('[YouTube Player] Starting auto-pause monitoring...');
        setTimeout(() => {
          console.log('[YouTube Player] Initial timeout check triggered');
          checkAndPauseAtEnd();
        }, 100); // 100ms delay to let video start
        
        // Also set up a backup interval check every 200ms
        console.log('[YouTube Player] Setting up backup interval check every 200ms');
        const intervalId = setInterval(() => {
          console.log(`[YouTube Player] Interval check - isPlaying: ${isPlaying}`);
          if (!isPlaying) {
            console.log('[YouTube Player] Clearing interval - not playing');
            clearInterval(intervalId);
            return;
          }
          checkAndPauseAtEnd();
        }, 200);
        
        // Store interval ID to clear it later
        (timeCheckIntervalRef as any).intervalId = intervalId;
        console.log('[YouTube Player] Backup interval set up with ID:', intervalId);
        
      } catch (error) {
        console.error('Error playing YouTube video:', error);
        setPlayerError(true);
        setIsPlaying(false);
        onError?.('Failed to play YouTube video');
      }
    });
  };

  const checkAndPauseAtEnd = () => {
    console.log(`[YouTube Player] checkAndPauseAtEnd called - isPlaying: ${isPlaying}, isInitialized: ${isInitialized}`);
    
    if (!youtubePlayerRef.current || !isPlaying || !isInitialized) {
      console.log('[YouTube Player] Early return from checkAndPauseAtEnd');
      return;
    }
    
    try {
      if (typeof youtubePlayerRef.current.getCurrentTime === 'function' && 
          typeof youtubePlayerRef.current.pauseVideo === 'function') {
        const currentTime = youtubePlayerRef.current.getCurrentTime();
        const timeDiff = timeEnd - currentTime;
        
        // Debug logging
        console.log(`[YouTube Player] Current: ${currentTime.toFixed(2)}s, End: ${timeEnd.toFixed(2)}s, Diff: ${timeDiff.toFixed(2)}s`);
        
        // Exactly like the original implementation: t > .08 ? E(t) : t > -2 && pause
        if (timeDiff > 0.08) {
          // Still more than 80ms to go, check again after (timeDiff - 0.08) seconds
          console.log(`[YouTube Player] Still ${timeDiff.toFixed(2)}s to go, checking again in ${(timeDiff - 0.08).toFixed(2)}s`);
          timeCheckIntervalRef.current = setTimeout(() => {
            checkAndPauseAtEnd();
          }, (timeDiff - 0.08) * 1000);
        } else if (timeDiff > -2) {
          // Within 2 seconds of end time, pause
          console.log(`[YouTube Player] Time to pause! Current: ${currentTime.toFixed(2)}s, End: ${timeEnd.toFixed(2)}s`);
          youtubePlayerRef.current.pauseVideo();
          setIsPlaying(false);
          if (timeCheckIntervalRef.current) {
            clearTimeout(timeCheckIntervalRef.current);
            timeCheckIntervalRef.current = null;
          }
        } else {
          console.log(`[YouTube Player] Video already past end time by ${Math.abs(timeDiff).toFixed(2)}s`);
        }
      } else {
        console.log('[YouTube Player] Methods not available in checkAndPauseAtEnd');
      }
    } catch (error) {
      console.error('Error checking video time:', error);
      setIsPlaying(false);
      if (timeCheckIntervalRef.current) {
        clearTimeout(timeCheckIntervalRef.current);
        timeCheckIntervalRef.current = null;
      }
    }
  };

  const seekToTime = () => {
    if (!youtubePlayerRef.current || !playerReady || !isInitialized) return;
    
    waitForYouTubeMethods(() => {
      try {
        setPlayerError(false);
        console.log(`[YouTube Player] Seeking to ${timeStart.toFixed(2)}s`);
        youtubePlayerRef.current.seekTo(timeStart, true);
      } catch (error) {
        console.error('Error seeking video:', error);
        setPlayerError(true);
        onError?.('Failed to seek video');
      }
    });
  };

  const stopVideo = () => {
    if (youtubePlayerRef.current && isInitialized) {
      waitForYouTubeMethods(() => {
        try {
          console.log('[YouTube Player] Stopping video');
          youtubePlayerRef.current.pauseVideo();
        } catch (error) {
          console.error('Error stopping video:', error);
        }
      });
    }
    setIsPlaying(false);
    
    // Clear timeout when stopping
    if (timeCheckIntervalRef.current) {
      clearTimeout(timeCheckIntervalRef.current);
      timeCheckIntervalRef.current = null;
    }
    
    // Clear interval when stopping
    if ((timeCheckIntervalRef as any).intervalId) {
      clearInterval((timeCheckIntervalRef as any).intervalId);
      (timeCheckIntervalRef as any).intervalId = null;
    }
  };

  if (!videoId) {
    return (
      <div className={`text-center ${className}`}>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <X className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Invalid YouTube URL</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="relative w-full max-w-4xl mx-auto">
        <div
          ref={playerRef}
          className="rounded-lg shadow-lg bg-gray-900"
          style={{ width: '100%', height: '315px' }}
        />
        
        {/* Overlay controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={seekToTime}
            disabled={!playerReady || !isInitialized || playerError}
            className="p-3 rounded-full shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 text-white"
            title="Go to start time"
          >
            <Play className="w-5 h-5" />
          </button>
          
          <button
            onClick={isPlaying ? stopVideo : playVideo}
            disabled={!playerReady || !isInitialized || playerError}
            className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              playerError 
                ? 'bg-red-500 hover:bg-red-600' 
                : isPlaying 
                  ? 'bg-orange-500 hover:bg-orange-600' 
                  : 'bg-green-500 hover:bg-green-600'
            } text-white`}
            title={isPlaying ? 'Pause' : 'Play in time range (auto-pause at end)'}
          >
            {playerError ? (
              <X className="w-5 h-5" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <RotateCcw className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Start Dictation Button - like the original */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={playVideo}
            disabled={!playerReady || !isInitialized || playerError || isPlaying}
            className={`px-6 py-3 rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold ${
              playerError 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
            title="Start dictation - video will auto-play and pause at the right time"
          >
            {playerError ? 'Video Error' : isPlaying ? 'Playing...' : 'Start Dictation'}
          </button>
        </div>
      </div>
      
      {/* Status and time info */}
      <div className="mt-4">
        <p className="text-gray-600 text-sm">
          {playerError ? 'Video error - please try again' : 
           !playerReady ? 'Loading video...' : 
           !isInitialized ? 'Initializing player...' :
           isPlaying ? 'Playing dictation - video will auto-pause at the end' :
           'Click "Start Dictation" to begin - video will auto-play and pause at the right time'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Time range: {timeStart.toFixed(1)}s - {timeEnd.toFixed(1)}s
        </p>
      </div>
    </div>
  );
});

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
