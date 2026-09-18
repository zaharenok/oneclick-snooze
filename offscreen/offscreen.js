// Plays sounds in an offscreen document — service workers have no AudioContext

chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === 'play-sound') {
    try {
      const audio = new Audio(chrome.runtime.getURL('sounds/restore.wav'));
      audio.volume = 0.35;
      audio.play().catch(e => console.warn('Could not play sound:', e));
    } catch (e) {
      console.warn('Could not play sound:', e);
    }
  }
});
