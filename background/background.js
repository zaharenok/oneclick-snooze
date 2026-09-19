// Service worker for handling alarm events and tab restoration

importScripts('alarmManager.js');

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!alarm.name.startsWith('snooze_')) {
    return;
  }

  const tabId = alarm.name.replace('snooze_', '');

  chrome.storage.local.get('snoozedTabs', async (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    const tabData = snoozedTabs.find(t => t.id === tabId);

    if (!tabData || tabData.status !== 'active') {
      return;
    }

    try {
      await chrome.tabs.create({ url: tabData.url });

      const updatedTabs = snoozedTabs.map(t =>
        t.id === tabId ? { ...t, status: 'expired', completedAt: Date.now() } : t
      );

      chrome.storage.local.set({ snoozedTabs: updatedTabs }, () => {
        chrome.runtime.sendMessage({
          type: 'tabRestored',
          tabId: tabId
        }).catch(() => {});

        chrome.notifications.create({
          type: 'basic',
          iconUrl: '../icons/icon48.png',
          title: 'Tab Snooze',
          message: `"${tabData.title}" has been restored.`
        }, () => void chrome.runtime.lastError);
        playRestoreSound();
      });

    } catch (error) {
      console.error('Failed to restore tab:', error);
    }
  });
});

// Play the "pu-boop" through an offscreen document (service workers have no AudioContext)
let creatingOffscreen;
async function playRestoreSound() {
  try {
    const { settings } = await chrome.storage.local.get('settings');
    if (settings && settings.soundEnabled === false) {
      return;
    }

    const contexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT']
    });

    if (contexts.length === 0) {
      // Shared in-flight promise: concurrent restores must not create the document twice
      creatingOffscreen = creatingOffscreen || chrome.offscreen.createDocument({
        url: 'offscreen/offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Play a sound when a snoozed tab is restored'
      });
      await creatingOffscreen.catch(() => {});
      creatingOffscreen = null;
    }


    chrome.runtime.sendMessage({ type: 'play-sound' }).catch(() => {});

    // Free the document after the sound finishes
    setTimeout(() => {
      chrome.offscreen.closeDocument().catch(() => {});
    }, 1500);
  } catch (e) {
    console.warn('Could not play restore sound:', e);
  }
}


chrome.runtime.onInstalled.addListener(() => {
  console.log('OneClick Snooze installed');
  // Keep service worker alive: periodic alarm ensures Chrome doesn't forget pending snooze alarms
  chrome.alarms.create('keepalive', { periodInMinutes: 0.5 });
});

chrome.runtime.onStartup.addListener(() => {
  // Ensure keepalive alarm persists across service worker restarts
  chrome.alarms.create('keepalive', { periodInMinutes: 0.5 });

  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    const now = Date.now();
    const expired = snoozedTabs.filter(t => t.status === 'active' && t.scheduledTime <= now);

    if (expired.length > 0) {
      expired.forEach(tab => {
        chrome.tabs.create({ url: tab.url }).catch(() => {});
      });

      const updatedTabs = snoozedTabs.map(t =>
        t.status === 'active' && t.scheduledTime <= now
          ? { ...t, status: 'expired', completedAt: now }
          : t
      );

      chrome.storage.local.set({ snoozedTabs: updatedTabs });
    }
  });
});
