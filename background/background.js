// Service worker for handling alarm events and tab restoration

importScripts('alarmManager.js');

// ── Restore overdue tabs (used by onStartup, periodic catch-up, and alarms) ──
async function restoreOverdueTabs() {
  const { snoozedTabs = [] } = await chrome.storage.local.get('snoozedTabs');
  const now = Date.now();
  const overdue = snoozedTabs.filter(t => t.status === 'active' && t.scheduledTime <= now);

  for (const tab of overdue) {
    try {
      await chrome.tabs.create({ url: tab.url });
    } catch (e) {
      console.warn('Failed to restore tab:', tab.id, e);
    }
  }

  if (overdue.length > 0) {
    const updated = snoozedTabs.map(t =>
      t.status === 'active' && t.scheduledTime <= now
        ? { ...t, status: 'expired', completedAt: now }
        : t
    );
    await chrome.storage.local.set({ snoozedTabs: updated });
  }
}

// ── Alarm handler ──
chrome.alarms.onAlarm.addListener(async (alarm) => {
  // Periodic catch-up: restore any tabs that slipped through
  if (alarm.name === 'catchup') {
    await restoreOverdueTabs();
    return;
  }

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

// ── Offscreen audio ──
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
      creatingOffscreen = creatingOffscreen || chrome.offscreen.createDocument({
        url: 'offscreen/offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Play a sound when a snoozed tab is restored'
      });
      await creatingOffscreen.catch(() => {});
      creatingOffscreen = null;
    }

    chrome.runtime.sendMessage({ type: 'play-sound' }).catch(() => {});

    setTimeout(() => {
      chrome.offscreen.closeDocument().catch(() => {});
    }, 1500);
  } catch (e) {
    console.warn('Could not play restore sound:', e);
  }
}

// ── Lifecycle ──
function ensureCatchupAlarm() {
  chrome.alarms.create('catchup', { periodInMinutes: 5 });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('OneClick Snooze installed');
  ensureCatchupAlarm();
});

chrome.runtime.onStartup.addListener(() => {
  ensureCatchupAlarm();
  restoreOverdueTabs();
});
