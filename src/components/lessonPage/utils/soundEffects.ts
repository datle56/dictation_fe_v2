/**
 * Sound effects utility for lesson completion
 */

export class SoundEffects {
  private static audioContext: AudioContext | null = null;

  /**
   * Initialize audio context (required for Web Audio API)
   */
  private static initAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Play a simple beep sound
   */
  static playBeep(frequency: number = 800, duration: number = 200): void {
    try {
      const audioContext = this.initAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      // Smoother volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Could not play sound effect:', error);
    }
  }

  /**
   * Play success sound (ascending notes)
   */
  static playSuccessSound(): void {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const noteDuration = 150;

    notes.forEach((frequency, index) => {
      setTimeout(() => {
        this.playBeep(frequency, noteDuration);
      }, index * noteDuration);
    });
  }

  /**
   * Play celebration sound (multiple ascending notes)
   */
  static playCelebrationSound(): void {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const noteDuration = 300;

    notes.forEach((frequency, index) => {
      setTimeout(() => {
        this.playBeep(frequency, noteDuration);
      }, index * noteDuration);
    });
  }

  /**
   * Play error sound (descending notes)
   */
  static playErrorSound(): void {
    const notes = [400, 300, 200];
    const noteDuration = 150;

    notes.forEach((frequency, index) => {
      setTimeout(() => {
        this.playBeep(frequency, noteDuration);
      }, index * noteDuration);
    });
  }

  /**
   * Play confetti sound (random notes)
   */
  static playConfettiSound(): void {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const noteDuration = 100;

    // Play random notes for confetti effect
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        this.playBeep(randomNote, noteDuration);
      }, i * noteDuration);
    }
  }
}
