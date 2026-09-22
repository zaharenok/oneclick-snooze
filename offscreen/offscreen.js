// Plays sounds in an offscreen document — service workers have no AudioContext

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'play-sound') {
    try {
      const audio = new Audio(chrome.runtime.getURL('sounds/restore.wav'));
      audio.volume = 0.35;
      audio.play()
        .then(() => sendResponse({ ok: true }))
        .catch(e => {
          console.warn('Could not play sound:', e);
          sendResponse({ ok: false, error: e.message });
        });
    } catch (e) {
      console.warn('Could not play sound:', e);
      sendResponse({ ok: false, error: e.message });
    }
    // Return true to keep the message channel open for async sendResponse
    return true;
  }
});
