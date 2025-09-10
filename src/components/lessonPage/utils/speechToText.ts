/**
 * Speech-to-Text utility using Web Speech API
 */

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export class SpeechToTextService {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.isSupported = true;
        this.setupRecognition();
      }
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;
  }

  /**
   * Check if speech recognition is supported
   */
  public isSpeechRecognitionSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Start speech recognition
   */
  public startRecognition(
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void,
    options: SpeechRecognitionOptions = {}
  ): void {
    if (!this.isSupported || !this.recognition) {
      onError('Speech recognition is not supported in this browser');
      return;
    }

    // Apply options
    if (options.language) this.recognition.lang = options.language;
    if (options.continuous !== undefined) this.recognition.continuous = options.continuous;
    if (options.interimResults !== undefined) this.recognition.interimResults = options.interimResults;
    if (options.maxAlternatives !== undefined) this.recognition.maxAlternatives = options.maxAlternatives;

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;
      const isFinal = result.isFinal;

      onResult({
        text: transcript,
        confidence,
        isFinal
      });
    };

    this.recognition.onerror = (event: any) => {
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      onError(errorMessage);
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (error) {
      onError('Failed to start speech recognition');
    }
  }

  /**
   * Stop speech recognition
   */
  public stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Abort speech recognition
   */
  public abortRecognition(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
  }
}

// Export a singleton instance
export const speechToTextService = new SpeechToTextService();
