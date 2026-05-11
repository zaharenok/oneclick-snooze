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
        }).catch(() => {});
      });

    } catch (error) {
      console.error('Failed to restore tab:', error);
    }
  });
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Snooze extension installed');
});

chrome.runtime.onStartup.addListener(() => {
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
