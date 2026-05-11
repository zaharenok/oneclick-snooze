// Sound effects system for Tab Snooze Extension

class SoundManager {
  constructor() {
    this.enabled = true;
    this.audioContext = null;
  }

  init() {
    // Initialize Web Audio API
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playSound(type) {
    if (!this.enabled) return;

    this.init();

    // Create different sounds for different actions
    switch (type) {
      case 'snooze':
        this.playSnoozeSound();
        break;
      case 'cancel':
        this.playCancelSound();
        break;
      case 'open':
        this.playOpenSound();
        break;
      case 'success':
        this.playSuccessSound();
        break;
      default:
        this.playDefaultSound();
    }
  }

  playSnoozeSound() {
    // Gentle "whoosh" sound for snoozing
    this.createOscillatorSound(440, 0.1, 'sine', [
      { time: 0, frequency: 523.25, gain: 0.3 },  // C5
      { time: 0.05, frequency: 659.25, gain: 0.2 },  // E5
      { time: 0.1, frequency: 783.99, gain: 0.1 }    // G5
    ]);
  }

  playCancelSound() {
    // Short "pop" sound for cancel
    this.createOscillatorSound(0.08, 0.05, 'triangle', [
      { time: 0, frequency: 800, gain: 0.2 },
      { time: 0.04, frequency: 600, gain: 0.1 }
    ]);
  }

  playOpenSound() {
    // Pleasant "ding" sound for opening
    this.createOscillatorSound(0.15, 0.1, 'sine', [
      { time: 0, frequency: 880, gain: 0.3 },     // A5
      { time: 0.05, frequency: 1108.73, gain: 0.2 } // C#6
    ]);
  }

  playSuccessSound() {
    // Happy chord for success
    this.playChord([523.25, 659.25, 783.99], 0.2);  // C major
  }

  playDefaultSound() {
    // Simple beep
    this.createOscillatorSound(0.1, 0.05, 'sine', [
      { time: 0, frequency: 600, gain: 0.2 }
    ]);
  }

  createOscillatorSound(duration, volume, type, frequencyChanges = []) {
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = type;

      // Apply frequency changes if provided
      if (frequencyChanges.length > 0) {
        const now = this.audioContext.currentTime;
        frequencyChanges.forEach(change => {
          oscillator.frequency.setValueAtTime(change.frequency, now + change.time);
          if (change.gain !== undefined) {
            gainNode.gain.setValueAtTime(change.gain, now + change.time);
          }
        });
      } else {
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      }

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Could not play sound:', e);
    }
  }

  playChord(frequencies, duration) {
    try {
      const now = this.audioContext.currentTime;
      const gainNode = this.audioContext.createGain();

      gainNode.connect(this.audioContext.destination);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

      frequencies.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        osc.connect(gainNode);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn('Could not play chord:', e);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

// Create global sound manager instance
const soundManager = new SoundManager();
