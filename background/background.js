// Service worker for handling alarm events and tab restoration

importScripts('alarmManager.js');

// ── Restore overdue tabs (used by onStartup, periodic catch-up, and alarms) ──
// Mutex prevents concurrent restores (onStartup + catchup alarm + individual alarms)
let _restoreLock = false;

async function restoreOverdueTabs() {
  if (_restoreLock) return;
  _restoreLock = true;
  try {
    const { snoozedTabs = [] } = await chrome.storage.local.get('snoozedTabs');
    const now = Date.now();
    const overdue = snoozedTabs.filter(t => t.status === 'active' && t.scheduledTime <= now);

    if (overdue.length === 0) return;

    // Mark expired BEFORE opening — prevents duplicate opens from concurrent alarms
    const overdueIds = new Set(overdue.map(t => t.id));
    const updated = snoozedTabs.map(t =>
      overdueIds.has(t.id) ? { ...t, status: 'expired', completedAt: now } : t
    );
    await chrome.storage.local.set({ snoozedTabs: updated });

    for (const tab of overdue) {
      try {
        await chrome.tabs.create({ url: tab.url });
      } catch (e) {
        console.warn('Failed to restore tab:', tab.id, e);
      }
    }

    playRestoreSound();
  } finally {
    _restoreLock = false;
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

  // Acquire mutex for read→mark→write (atomic status flip)
  while (_restoreLock) await new Promise(r => setTimeout(r, 50));
  _restoreLock = true;

  let tabData;
  try {
    const { snoozedTabs = [] } = await chrome.storage.local.get('snoozedTabs');
    tabData = snoozedTabs.find(t => t.id === tabId);

    if (!tabData || tabData.status !== 'active') {
      _restoreLock = false;
      return;
    }

    // Mark expired BEFORE any async gap — persisted, survives SW crash
    const updatedTabs = snoozedTabs.map(t =>
      t.id === tabId ? { ...t, status: 'expired', completedAt: Date.now() } : t
    );
    await chrome.storage.local.set({ snoozedTabs: updatedTabs });
  } catch (error) {
    console.error('Failed to mark tab expired:', error);
    _restoreLock = false;
    return;
  }
  _restoreLock = false;

  // Tab is already 'expired' in storage — safe to do async work without lock
  try {
    await chrome.tabs.create({ url: tabData.url });

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
  } catch (error) {
    console.error('Failed to restore tab:', error);
  }
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

    // sendMessage now waits for sendResponse from offscreen listener
    await chrome.runtime.sendMessage({ type: 'play-sound' }).catch(e => {
      console.warn('play-sound message failed:', e);
    });

    setTimeout(() => {
      chrome.offscreen.closeDocument().catch(() => {});
    }, 3000);
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
