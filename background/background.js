// Service worker for handling alarm events and tab restoration

importScripts('alarmManager.js', '../lib/messages.js', '../lib/queueStagger.js');

// Cached localized messages for the desktop notification (stored choice > browser locale).
let _bgMessages = null;
async function bgMessages() {
  if (_bgMessages) return _bgMessages;
  const stored = await new Promise((resolve) => {
    chrome.storage.local.get('locale', (res) => resolve(res.locale));
  });
  const ui = (chrome.i18n && chrome.i18n.getUILanguage) ? chrome.i18n.getUILanguage() : MESSAGES_DEFAULT;
  _bgMessages = await messagesLoad(messagesResolveLocale(ui, stored));
  return _bgMessages;
}

// ── Restore overdue tabs (used by onStartup, periodic catch-up, and alarms) ──
// Mutex prevents concurrent restores (onStartup + catchup alarm + individual alarms)
// RESTORE_GAP_MS must match RESTORE_QUEUE_GAP_MS in lib/queueStagger.js
const RESTORE_GAP_MS = 5000;
let _restoreLock = false;

async function restoreOverdueTabs(options = {}) {
  const notify = options.notify === true;
  if (_restoreLock) return;
  _restoreLock = true;
  try {
    for (;;) {
      const { snoozedTabs = [] } = await chrome.storage.local.get('snoozedTabs');
      const due = AlarmManager.selectNextDueTab(snoozedTabs, Date.now());
      if (!due) break;

      // Mark expired BEFORE opening — persisted, survives SW crash; next catch-up retries the rest
      const updated = snoozedTabs.map(t =>
        t.id === due.id ? { ...t, status: 'expired', completedAt: Date.now() } : t
      );
      await chrome.storage.local.set({ snoozedTabs: updated });

      try {
        await chrome.tabs.create({ url: due.url });

        if (notify) {
          chrome.runtime.sendMessage({
            type: 'tabRestored',
            tabId: due.id
          }).catch(() => {});

          const msgs = await bgMessages();
          chrome.notifications.create({
            type: 'basic',
            iconUrl: '../icons/icon48.png',
            title: msgs.extName || 'OneClick Snooze',
            message: messagesSub(msgs.notif_restored, due.title)
          }, () => void chrome.runtime.lastError);
        }
        playRestoreSound();
      } catch (e) {
        console.warn('Failed to restore tab:', due.id, e);
      }

      // Queue: simultaneous alarms (e.g. «Tomorrow 09:00») open tabs one by one
      if (AlarmManager.countDueTabs(snoozedTabs, Date.now(), due.id) > 0) {
        await new Promise(r => setTimeout(r, RESTORE_GAP_MS));
      }
    }
  } finally {
    _restoreLock = false;
  }
}

// ── Alarm handler ──
chrome.alarms.onAlarm.addListener(async (alarm) => {
  // Periodic catch-up + individual snooze alarms both drain due tabs as a spaced queue
  if (alarm.name === 'catchup' || alarm.name.startsWith('snooze_')) {
    await restoreOverdueTabs({ notify: alarm.name.startsWith('snooze_') });
    return;
  }
  // Auto Snooze periodic check (settings.autoMode.enabled)
  if (alarm.name === 'automode') {
    await runAutoModeCheck();
  }
});

// ── Auto Snooze (settings.autoMode) ──
const AUTO_MODE_ALARM = 'automode';
const AUTO_MODE_PERIOD_MIN = 15;

function getAutoModeSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get('settings', (result) => {
      const defaults = { enabled: false, maxTabs: 10, idleHours: 12, snoozePreset: '12h' };
      resolve({ ...defaults, ...((result.settings && result.settings.autoMode) || {}) });
    });
  });
}

// (Re-)arm or clear the periodic check; runs on install, startup and settings change
function ensureAutoModeAlarm() {
  getAutoModeSettings().then((cfg) => {
    if (cfg.enabled) {
      chrome.alarms.create(AUTO_MODE_ALARM, { periodInMinutes: AUTO_MODE_PERIOD_MIN });
    } else {
      chrome.alarms.clear(AUTO_MODE_ALARM);
    }
  });
}

async function runAutoModeCheck() {
  const cfg = await getAutoModeSettings();
  if (!cfg.enabled) return;

  const tabs = await new Promise((resolve) => chrome.tabs.query({}, resolve));
  const ids = AlarmManager.selectTabsForAutoSnooze(tabs, cfg, Date.now());
  if (ids.length === 0) return;

  const msgs = await bgMessages();
  const labelKeys = {
    '1h': 'preset_1hour',
    '3h': 'preset_3hours',
    '6h': 'preset_6hours',
    '12h': 'preset_12hours',
    'tomorrow': 'preset_tomorrow',
    'nextweek': 'preset_nextWeek'
  };
  const presetLabel = '🤖 ' + (msgs[labelKeys[cfg.snoozePreset]] || cfg.snoozePreset);
  const baseTime = AlarmManager.calculateScheduledTime(cfg.snoozePreset);

  const { snoozedTabs = [] } = await chrome.storage.local.get('snoozedTabs');
  const now = Date.now();
  const created = [];
  for (const tab of tabs.filter(t => ids.includes(t.id))) {
    const tabData = {
      id: now.toString(36) + Math.random().toString(36).substr(2),
      tabId: tab.id,
      url: tab.url,
      title: tab.title || tab.url,
      favicon: tab.favIconUrl || '',
      createdTime: now,
      preset: 'auto_' + cfg.snoozePreset,
      presetLabel,
      status: 'active'
    };
    // Same-slot queue as manual snoozes so restores stay spaced out
    tabData.scheduledTime = staggerScheduledTime(baseTime, [...snoozedTabs, ...created]);
    created.push(tabData);
  }

  // Persist BEFORE closing tabs — MV3 worker may die mid-run, catch-up retries the rest
  await chrome.storage.local.set({ snoozedTabs: [...snoozedTabs, ...created] });
  for (const t of created) {
    chrome.alarms.create(`snooze_${t.id}`, { when: t.scheduledTime });
  }
  for (const t of created) {
    try {
      await chrome.tabs.remove(t.tabId);
    } catch (e) {
      console.warn('auto-snooze: tab already gone', t.tabId, e);
    }
  }

  const { settings } = await chrome.storage.local.get('settings');
  if (settings && settings.desktopNotifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon48.png',
      title: msgs.extName || 'OneClick Snooze',
      message: created.length === 1
        ? messagesSub(msgs.notif_autoSnoozed1)
        : messagesSub(msgs.notif_autoSnoozedN, String(created.length))
    }, () => void chrome.runtime.lastError);
  }
}

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
  ensureAutoModeAlarm();
});

chrome.runtime.onStartup.addListener(() => {
  ensureCatchupAlarm();
  ensureAutoModeAlarm();
  restoreOverdueTabs();
});

// Popup saves settings → re-arm (or clear) the auto-snooze alarm immediately
chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === 'settingsUpdated') {
    ensureAutoModeAlarm();
  }
});
