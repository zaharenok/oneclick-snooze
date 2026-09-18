// Sound effects: file-based audio via fetch + AudioContext
// (new Audio() is unreliable in MV3 extension popups)

class SoundManager {
  constructor() {
    this.enabled = true;
    this.cache = {};
    this.ctx = null;
  }

  _getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  _load(src) {
    if (this.cache[src]) return Promise.resolve(this.cache[src]);
    return fetch(chrome.runtime.getURL(src))
      .then(r => r.arrayBuffer())
      .then(buf => {
        const ctx = this._getContext();
        return ctx.decodeAudioData(buf).then(data => {
          this.cache[src] = data;
          return data;
        });
      });
  }

  playSound(type, volume = 0.2) {
    if (!this.enabled) return;

    const sounds = {
      snooze: 'sounds/snooze.wav',
      restore: 'sounds/restore.wav'
    };

    const src = sounds[type];
    if (!src) return;

    this._load(src).then(data => {
      const ctx = this._getContext();
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);

      const source = ctx.createBufferSource();
      source.buffer = data;
      source.connect(gain);
      source.start();
    }).catch(e => console.warn('Could not play sound:', e));
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

const soundManager = new SoundManager();
