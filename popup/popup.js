// Popup event handlers and countdown updates

let countdownInterval = null;
let currentSettings = null;
let editingTabId = null;
let emojiPickerTarget = null;

// Time-related emojis for picker
const TIME_EMOJIS = [
  '🌙', '☀️', '📅', '⏰', '⏱️', '⏲️', '🕐', '🕑', '🕒', '🕓',
  '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🌅', '🌄',
  '🌆', '🌇', '🌃', '🌌', '⭐', '🌟', '✨', '💫', '☀️', '🌤',
  '⛅', '🌥', '☁️', '🌦', '🌧', '⛈️', '🌩', '🌨', '❄️', '☃️',
  '🔥', '💧', '🌊', '🍂', '🍁', '🪺', '🐓', '🦃', '🦉', '🦇',
  '🌻', '🌷', '🌹', '🪷', '🪴', '🎯', '🎲', '🎮', '🕹️', '🎰',
  '🚀', '✈️', '🛸', '🚁', '⛵', '🚂', '🚗', '🏠', '🏢', '🏰',
  '☕', '🍕', '🍔', '🍿', '🧁', '🍰', '🎂', '🥤', '🧊', '🍺'
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function validateUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get('settings', (result) => {
      const DEFAULT_SETTINGS = {
        presets: [
          { id: 'evening', label: 'Evening', icon: '🌙', hour: 21, minute: 0, enabled: true },
          { id: 'tomorrow', label: 'Tomorrow', icon: '☀️', hour: 9, minute: 0, enabled: true },
          { id: 'nextweek', label: 'Next Week', icon: '📅', hour: 9, minute: 0, enabled: true }
        ],
        showCompleted: true,
        completedDuration: 5,
        soundEnabled: true,
        autoMode: { enabled: false, maxTabs: 10, idleHours: 2, snoozePreset: '6h' }
      };
      currentSettings = { ...DEFAULT_SETTINGS, ...(result.settings || {}) };
      // Deep-merge autoMode: settings saved before v1.5.0 have no autoMode key
      currentSettings.autoMode = { ...DEFAULT_SETTINGS.autoMode, ...(currentSettings.autoMode || {}) };

      // Update sound manager
      if (typeof soundManager !== 'undefined') {
        soundManager.setEnabled(currentSettings.soundEnabled);
      }

      resolve(currentSettings);
    });
  });
}

async function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ settings: settings }, () => {
      currentSettings = settings;
      // Service worker re-arms (or clears) the auto-snooze alarm on settings change
      try {
        chrome.runtime.sendMessage({ type: 'settingsUpdated' }).catch(() => {});
      } catch (e) { /* worker unavailable */ }
      resolve(settings);
    });
  });
}

function calculateScheduledTime(preset) {
  const presetConfig = currentSettings.presets.find(p => p.id === preset);
  if (!presetConfig) return null;

  const now = new Date();
  let scheduled = new Date();

  switch (preset) {
    case 'evening':
      scheduled.setHours(presetConfig.hour, presetConfig.minute, 0, 0);
      if (scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 1);
      }
      break;

    case 'tomorrow':
      scheduled.setDate(scheduled.getDate() + 1);
      scheduled.setHours(presetConfig.hour, presetConfig.minute, 0, 0);
      break;

    case 'nextweek':
      const currentDay = scheduled.getDay();
      const daysUntilMonday = (1 + 7 - currentDay) % 7 || 7;
      scheduled.setDate(scheduled.getDate() + daysUntilMonday);
      scheduled.setHours(presetConfig.hour, presetConfig.minute, 0, 0);
      break;

    default:
      const customPreset = currentSettings.presets.find(p => p.id === preset);
      if (customPreset) {
        scheduled.setDate(scheduled.getDate() + 1);
        scheduled.setHours(customPreset.hour, customPreset.minute, 0, 0);
      } else {
        return null;
      }
  }

  return scheduled.getTime();
}

function calculateCustomTime(hour, minute, dateStr = null) {
  const scheduled = new Date();

  if (dateStr) {
    const selectedDate = new Date(dateStr);
    scheduled.setFullYear(selectedDate.getFullYear());
    scheduled.setMonth(selectedDate.getMonth());
    scheduled.setDate(selectedDate.getDate());
  }

  scheduled.setHours(hour, minute, 0, 0);

  // If time is in the past and no date specified, move to tomorrow
  if (!dateStr && scheduled <= new Date()) {
    scheduled.setDate(scheduled.getDate() + 1);
  }

  return scheduled.getTime();
}

// Smart Preset Functions
function calculateSmartPresetTime(presetType) {
  const now = new Date();
  let scheduled = new Date();

  switch (presetType) {
    case 'later-today':
      // 3 hours from now
      scheduled.setTime(now.getTime() + (3 * 60 * 60 * 1000));
      break;

    case 'this-evening':
      scheduled.setHours(20, 0, 0, 0);
      if (scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 1);
      }
      break;

    case 'tomorrow':
      scheduled.setDate(scheduled.getDate() + 1);
      scheduled.setHours(9, 0, 0, 0);
      break;

    case 'next-weekend':
      const currentDay = scheduled.getDay();
      const daysUntilSaturday = (6 - currentDay + 7) % 7 || 7;
      scheduled.setDate(scheduled.getDate() + daysUntilSaturday);
      scheduled.setHours(10, 0, 0, 0);
      break;

    case 'next-week':
      const currentDayOfWeek = scheduled.getDay();
      const daysUntilNextMonday = (1 + 7 - currentDayOfWeek) % 7 || 7;
      scheduled.setDate(scheduled.getDate() + daysUntilNextMonday);
      scheduled.setHours(9, 0, 0, 0);
      break;

    case 'in-a-month':
      scheduled.setMonth(scheduled.getMonth() + 1);
      scheduled.setHours(9, 0, 0, 0);
      break;

    case 'someday':
      scheduled.setMonth(scheduled.getMonth() + 3);
      scheduled.setHours(9, 0, 0, 0);
      break;

    case 'pick-date':
      // Open edit modal with current tab
      openEditModalForCurrentTab();
      return null;

    default:
      return null;
  }

  return scheduled.getTime();
}

function openEditModalForCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && validateUrl(tabs[0].url)) {
      const tab = tabs[0];
      const tempId = 'current_' + Date.now();

      const tabData = {
        id: tempId,
        url: tab.url,
        title: tab.title,
        favicon: tab.favIconUrl || '',
        scheduledTime: Date.now() + 3600000, // Default 1 hour
        createdTime: Date.now(),
        preset: 'custom',
        presetLabel: i18n.get('preset.custom'),
        status: 'active',
        isCurrentTab: true
      };

      editingTabId = tempId;

      document.getElementById('edit-favicon').innerHTML =
        tabData.favicon ? `<img src="${tabData.favicon}" alt="">` : '<span>📄</span>';
      document.getElementById('edit-title').textContent = tabData.title;
      document.getElementById('edit-url').textContent = getDomain(tabData.url);

      // Render quick reschedule buttons
      const quickReschedule = document.getElementById('quick-reschedule');
      quickReschedule.innerHTML = currentSettings.presets
        .filter(p => p.enabled)
        .map(preset => `
          <button class="quick-reschedule-btn" data-preset="${preset.id}">
            <span class="icon">${preset.icon}</span>
            <span class="label">${preset.label}</span>
            <span class="time">${formatTime(preset.hour, preset.minute)}</span>
          </button>
        `).join('');

      quickReschedule.querySelectorAll('.quick-reschedule-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          snoozeTab(btn.dataset.preset);
          closeEditModal();
        });
      });

      // Set current time values
      const scheduledDate = new Date(tabData.scheduledTime);
      document.getElementById('custom-hour').value = scheduledDate.getHours();
      document.getElementById('custom-minute').value = scheduledDate.getMinutes();

      // Update date display
      updateEditDateDisplay(tabData.scheduledTime);

      document.getElementById('edit-modal').classList.add('open');
    }
  });
}

function formatScheduledDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const scheduledDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const daysDiff = Math.round((scheduledDay - today) / (1000 * 60 * 60 * 24));

  let dayLabel;
  if (daysDiff === 0) {
    dayLabel = i18n.get('time.today');
  } else if (daysDiff === 1) {
    dayLabel = i18n.get('time.tomorrow');
  } else if (daysDiff < 7) {
    dayLabel = new Intl.DateTimeFormat(i18n.localeTag(), { weekday: 'long' }).format(date);
  } else {
    dayLabel = date.toLocaleDateString(i18n.localeTag(), { month: 'short', day: 'numeric' });
  }

  const timeStr = formatTime(date.getHours(), date.getMinutes());
  return `${dayLabel} ${i18n.get('time.at')} ${timeStr}`;
}

function updateEditDateDisplay(timestamp) {
  const displayEl = document.getElementById('edit-date-value');
  if (displayEl) {
    displayEl.textContent = formatScheduledDate(timestamp);
  }
}

function formatTime(hour, minute) {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function formatCountdown(scheduledTime) {
  const now = Date.now();
  const diff = scheduledTime - now;

  if (diff <= 0) {
    return i18n.get('time.now');
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  return `${seconds}s`;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

  return date.toLocaleDateString();
}

function renderPresetButtons() {
  const container = document.getElementById('presets-container');
  const enabledPresets = currentSettings.presets.filter(p => p.enabled);

  container.innerHTML = enabledPresets.map(preset => `
    <button class="preset-btn" data-preset="${preset.id}">
      <span class="icon">${preset.icon}</span>
      <span class="label">${resolvePresetLabel(preset)}</span>
      <span class="time">${formatTime(preset.hour, preset.minute)}</span>
    </button>
  `).join('');

  container.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      snoozeTab(btn.dataset.preset);
    });
  });
}

async function snoozeTab(preset) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !validateUrl(tab.url)) {
    alert(i18n.get('error.invalidUrl'));
    return;
  }

  const scheduledTime = calculateScheduledTime(preset);
  if (!scheduledTime) {
    alert(i18n.get('error.invalidPreset'));
    return;
  }

  const presetConfig = currentSettings.presets.find(p => p.id === preset);
  const tabData = {
    id: generateId(),
    tabId: tab.id,
    url: tab.url,
    title: tab.title,
    favicon: tab.favIconUrl || '',
    scheduledTime: scheduledTime,
    createdTime: Date.now(),
    preset: preset,
    presetLabel: presetConfig?.label || preset,
    status: 'active'
  };

  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    // Same-slot queue: fixed-time presets («Tomorrow», «Weekends»…) would otherwise all restore at once
    tabData.scheduledTime = staggerScheduledTime(tabData.scheduledTime, snoozedTabs);
    snoozedTabs.push(tabData);

    chrome.storage.local.set({ snoozedTabs: snoozedTabs }, () => {
      chrome.alarms.create(`snooze_${tabData.id}`, { when: tabData.scheduledTime });

      // Play sound then close tab after brief delay so audio starts
      if (typeof soundManager !== 'undefined') {
        soundManager.playSound('snooze');
      }

      setTimeout(() => {
        chrome.tabs.remove(tab.id);
        updateAllNavCounts();
        renderSnoozedTabs();
        renderHistory();
      }, 300);
    });
  });
}

function renderSnoozedTabs() {
  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    const container = document.getElementById('snoozed-tabs');
    const countEl = document.getElementById('tab-count');
    const navCountEl = document.getElementById('nav-count-snoozed');

    const activeTabs = snoozedTabs.filter(t => t.status === 'active');
    const completedTabs = snoozedTabs.filter(t => t.status === 'expired');

    const showCompleted = currentSettings?.showCompleted ?? true;
    const completedDuration = currentSettings?.completedDuration ?? 5;
    const now = Date.now();

    const displayTabs = [...activeTabs];
    if (showCompleted) {
      completedTabs.forEach(tab => {
        const elapsed = now - (tab.completedAt || tab.scheduledTime);
        if (elapsed < completedDuration * 1000) {
          displayTabs.push({ ...tab, isCompleted: true });
        }
      });
    }

    if (countEl) countEl.textContent = activeTabs.length;
    if (navCountEl) navCountEl.textContent = activeTabs.length;

    if (displayTabs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">💤</span>
          <p>No snoozed tabs</p>
          <small>Click a button above to snooze this tab</small>
        </div>
      `;
      return;
    }

    container.innerHTML = displayTabs.map(tab => `
      <div class="tab-item ${tab.isCompleted ? 'completed' : ''}" data-id="${tab.id}">
        <div class="tab-favicon">
          ${tab.favicon ? `<img src="${tab.favicon}" alt="">` : '<span>📄</span>'}
        </div>
        <div class="tab-info">
          <div class="tab-title" title="${tab.title}">${truncate(tab.title, 40)}</div>
          <div class="tab-domain">${getDomain(tab.url)}</div>
        </div>
        ${tab.isCompleted
          ? `<div class="tab-countdown completed">${i18n.get('status.opened')}</div>`
          : `<div class="tab-countdown" data-scheduled="${tab.scheduledTime}">${formatCountdown(tab.scheduledTime)}</div>`
        }
        <div class="tab-actions">
          ${!tab.isCompleted ? `
            <button class="edit-btn" data-id="${tab.id}" title="${i18n.get('edit.reschedule')}">✏️</button>
            <button class="open-now-btn-small" data-id="${tab.id}" data-url="${tab.url}" title="${i18n.get('tooltip.openNow')}">🚀</button>
            <button class="cancel-btn" data-id="${tab.id}" title="${i18n.get('tooltip.cancelSnooze')}">✕</button>
          ` : ''}
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.cancel-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        cancelSnooze(btn.dataset.id);
      });
    });

    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(btn.dataset.id);
      });
    });

    container.querySelectorAll('.open-now-btn-small').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTabNow(btn.dataset.id, btn.dataset.url);
      });
    });
  });
}

// Edit Tab Modal Functions
function openEditModal(tabId) {
  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    const tab = snoozedTabs.find(t => t.id === tabId);

    if (!tab) return;

    editingTabId = tabId;

    document.getElementById('edit-favicon').innerHTML =
      tab.favicon ? `<img src="${tab.favicon}" alt="">` : '<span>📄</span>';
    document.getElementById('edit-title').textContent = tab.title;
    document.getElementById('edit-url').textContent = getDomain(tab.url);

    // Render quick reschedule buttons
    const quickReschedule = document.getElementById('quick-reschedule');
    quickReschedule.innerHTML = currentSettings.presets
      .filter(p => p.enabled)
      .map(preset => `
        <button class="quick-reschedule-btn" data-preset="${preset.id}">
          <span class="icon">${preset.icon}</span>
          <span class="label">${preset.label}</span>
          <span class="time">${formatTime(preset.hour, preset.minute)}</span>
        </button>
      `).join('');

    quickReschedule.querySelectorAll('.quick-reschedule-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const newTime = calculateScheduledTime(btn.dataset.preset);
        if (newTime) {
          updateTabSchedule(tabId, newTime, btn.dataset.preset);
          closeEditModal();
        }
      });
    });

    // Set current time values
    const scheduledDate = new Date(tab.scheduledTime);
    document.getElementById('custom-hour').value = scheduledDate.getHours();
    document.getElementById('custom-minute').value = scheduledDate.getMinutes();

    // Update date display
    updateEditDateDisplay(tab.scheduledTime);

    // Set date if it's not today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduleDay = new Date(scheduledDate);
    scheduleDay.setHours(0, 0, 0, 0);

    if (scheduleDay.getTime() > today.getTime()) {
      document.getElementById('custom-date').value = scheduleDay.toISOString().split('T')[0];
    } else {
      document.getElementById('custom-date').value = '';
    }

    document.getElementById('edit-modal').classList.add('open');
  });
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('open');
  editingTabId = null;
}

function saveTabEdit() {
  if (!editingTabId) return;

  const hour = parseInt(document.getElementById('custom-hour').value) || 0;
  const minute = parseInt(document.getElementById('custom-minute').value) || 0;
  const dateStr = document.getElementById('custom-date').value || null;

  const newTime = calculateCustomTime(hour, minute, dateStr);

  // Update date display before saving
  updateEditDateDisplay(newTime);

  updateTabSchedule(editingTabId, newTime, null);
  closeEditModal();
}

function updateTabSchedule(tabId, newTime, preset) {
  // Check if this is the current tab being edited
  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    const tabIndex = snoozedTabs.findIndex(t => t.id === tabId);
    const tab = snoozedTabs[tabIndex];

    // If this is the current tab (not yet snoozed), create new snooze
    if (tab && tab.isCurrentTab) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && validateUrl(tabs[0].url)) {
          const currentTab = tabs[0];
          const tabData = {
            id: generateId(),
            tabId: currentTab.id,
            url: currentTab.url,
            title: currentTab.title,
            favicon: currentTab.favIconUrl || '',
            scheduledTime: newTime,
            createdTime: Date.now(),
            preset: preset || 'custom',
            presetLabel: preset ? formatPresetLabel(preset) : i18n.get('preset.custom'),
            status: 'active'
          };

          // Same-slot queue for custom/pick-date times landing on an occupied slot
          tabData.scheduledTime = staggerScheduledTime(newTime, snoozedTabs, tabData.id);
          snoozedTabs.push(tabData);

          chrome.storage.local.set({ snoozedTabs: snoozedTabs }, () => {
            chrome.alarms.create(`snooze_${tabData.id}`, { when: tabData.scheduledTime });
            chrome.tabs.remove(currentTab.id);
            renderSnoozedTabs();
            renderHistory();
          });
        }
      });
      return;
    }

    // Update existing snoozed tab
    if (tabIndex !== -1) {
      chrome.alarms.clear(`snooze_${tabId}`);

      snoozedTabs[tabIndex].scheduledTime = staggerScheduledTime(newTime, snoozedTabs, tabId);
      if (preset) {
        snoozedTabs[tabIndex].preset = preset;
        const presetConfig = currentSettings.presets.find(p => p.id === preset);
        snoozedTabs[tabIndex].presetLabel = presetConfig?.label || formatPresetLabel(preset);
      }

      chrome.storage.local.set({ snoozedTabs: snoozedTabs }, () => {
        chrome.alarms.create(`snooze_${tabId}`, { when: snoozedTabs[tabIndex].scheduledTime });
        renderSnoozedTabs();
      });
    }
  });
}

function openTabNow(tabId, url) {
  chrome.tabs.create({ url: url });

  // Play restore sound
  if (typeof soundManager !== 'undefined') {
    soundManager.playSound('restore');
  }

  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    chrome.alarms.clear(`snooze_${tabId}`);

    const updated = snoozedTabs.filter(t => t.id !== tabId);
    chrome.storage.local.set({ snoozedTabs: updated }, () => {
      updateAllNavCounts();
      renderSnoozedTabs();
    });
  });
}

function updateAllNavCounts() {
  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];

    const activeTabs = snoozedTabs.filter(t => t.status === 'active');
    const historyTabs = snoozedTabs.filter(t => t.status === 'expired');

    const snoozedCountEl = document.getElementById('nav-count-snoozed');
    const historyCountEl = document.getElementById('nav-count-history');

    if (snoozedCountEl) snoozedCountEl.textContent = activeTabs.length;
    if (historyCountEl) historyCountEl.textContent = historyTabs.length;
  });
}

function renderHistory() {
  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    const container = document.getElementById('history-tabs');
    const navCountEl = document.getElementById('nav-count-history');

    const historyTabs = snoozedTabs
      .filter(t => t.status === 'expired')
      .sort((a, b) => (b.completedAt || b.scheduledTime) - (a.completedAt || a.scheduledTime))
      .slice(0, 50);

    // Update nav count
    if (navCountEl) {
      navCountEl.textContent = historyTabs.length;
    }

    if (historyTabs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📜</span>
          <p data-i18n="empty.noHistory">${i18n.get('empty.noHistory')}</p>
          <small data-i18n="empty.noHistoryDesc">${i18n.get('empty.noHistoryDesc')}</small>
        </div>
      `;
      i18n.updateUI();
      return;
    }

    container.innerHTML = historyTabs.map(tab => `
      <div class="tab-item history-item" data-url="${tab.url}">
        <div class="tab-favicon">
          ${tab.favicon ? `<img src="${tab.favicon}" alt="">` : '<span>📄</span>'}
        </div>
        <div class="tab-info">
          <div class="tab-title" title="${tab.title}">${truncate(tab.title, 40)}</div>
          <div class="tab-meta">
            <span class="tab-domain">${getDomain(tab.url)}</span>
            <span class="tab-time">✓ ${formatTimestamp(tab.completedAt || tab.scheduledTime)}</span>
          </div>
        </div>
        <button class="reopen-btn" data-url="${tab.url}" title="Reopen this tab">↻</button>
      </div>
    `).join('');

    container.querySelectorAll('.reopen-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        chrome.tabs.create({ url: btn.dataset.url });
      });
    });

    container.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        chrome.tabs.create({ url: item.dataset.url });
      });
    });
  });
}

function clearHistory() {
  if (!confirm(i18n.get('history.clearConfirm'))) {
    return;
  }

  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    const activeTabs = snoozedTabs.filter(t => t.status === 'active');

    chrome.storage.local.set({ snoozedTabs: activeTabs }, () => {
      renderHistory();
      renderSnoozedTabs();
    });
  });
}

// ── Locale-aware preset label resolution ──
// Maps preset id → locale key under 'preset.*'
const PRESET_LOCALE_KEYS = {
  evening: 'thisEvening',
  tomorrow: 'tomorrow',
  nextweek: 'nextWeek',
  custom: 'custom',
  // Smart presets (used by formatPresetLabel)
  'this-evening': 'thisEvening',
  'next-weekend': 'nextWeekend',
  'next-week': 'nextWeek',
  'later-today': 'laterToday',
  'in-a-month': 'inMonth',
  'someday': 'someday'
};

// Default English labels — only use locale if preset label still matches these
const DEFAULT_PRESET_LABELS = {
  evening: 'Evening',
  tomorrow: 'Tomorrow',
  nextweek: 'Next Week'
};

function getPresetLocaleLabel(presetId) {
  const key = PRESET_LOCALE_KEYS[presetId];
  return key ? i18n.get('preset.' + key) : null;
}

/** Returns locale label only if user hasn't customized it. */
function resolvePresetLabel(preset) {
  const defaultLabel = DEFAULT_PRESET_LABELS[preset.id];
  if (defaultLabel && preset.label === defaultLabel) {
    return getPresetLocaleLabel(preset.id) || preset.label;
  }
  return preset.label;
}

function truncate(str, length) {
  return str.length > length ? str.substr(0, length) + '...' : str;
}

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function cancelSnooze(id) {
  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    const tab = snoozedTabs.find(t => t.id === id);

    if (tab) {
      chrome.alarms.clear(`snooze_${id}`);

      const updated = snoozedTabs.filter(t => t.id !== id);
      chrome.storage.local.set({ snoozedTabs: updated }, () => {
        updateAllNavCounts();
        renderSnoozedTabs();
        renderHistory();
      });
    }
  });
}

function updateCountdowns() {
  document.querySelectorAll('.tab-countdown:not(.completed)').forEach(el => {
    const scheduledTime = parseInt(el.dataset.scheduled);
    el.textContent = formatCountdown(scheduledTime);
  });
}

function startCountdown() {
  updateCountdowns();
  countdownInterval = setInterval(updateCountdowns, 1000);
}

// Emoji Picker Functions
function openEmojiPicker(targetButton) {
  emojiPickerTarget = targetButton;
  const picker = document.getElementById('emoji-picker');

  const grid = document.getElementById('emoji-grid');
  grid.innerHTML = TIME_EMOJIS.map(emoji =>
    `<button class="emoji-btn" data-emoji="${emoji}">${emoji}</button>`
  ).join('');

  grid.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (emojiPickerTarget) {
        emojiPickerTarget.textContent = btn.dataset.emoji;
        emojiPickerTarget.dataset.emoji = btn.dataset.emoji;
      }
      closeEmojiPicker();
    });
  });

  picker.style.display = 'block';
  picker.classList.add('open');
}

function closeEmojiPicker() {
  const picker = document.getElementById('emoji-picker');
  picker.style.display = 'none';
  picker.classList.remove('open');
  emojiPickerTarget = null;
}

// Settings Modal Functions
function openSettings() {
  const modal = document.getElementById('settings-modal');
  modal.classList.add('open');

  renderPresetSettings();

  document.getElementById('show-completed').checked = currentSettings.showCompleted;
  document.getElementById('completed-duration').value = currentSettings.completedDuration;
  document.getElementById('completed-duration-row').style.display =
    currentSettings.showCompleted ? 'flex' : 'none';
}

function closeSettings() {
  const modal = document.getElementById('settings-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

function initModalHandlers() {
  // Close button
  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) {
    closeBtn.removeEventListener('click', closeSettings);
    closeBtn.addEventListener('click', closeSettings);
  }

  // Click outside to close
  const modal = document.getElementById('settings-modal');
  if (modal) {
    modal.removeEventListener('click', handleModalOutsideClick);
    modal.addEventListener('click', handleModalOutsideClick);
  }
}

function handleModalOutsideClick(e) {
  if (e.target.id === 'settings-modal') {
    closeSettings();
  }
}

function renderPresetSettings() {
  const container = document.getElementById('preset-settings');

  container.innerHTML = currentSettings.presets.map((preset, index) => `
    <div class="preset-setting-item" data-index="${index}">
      <div class="preset-row">
        <button class="emoji-picker-btn" data-index="${index}" data-emoji="${preset.icon}" title="${i18n.get('tooltip.chooseEmoji')}">
          ${preset.icon}
        </button>
        <input type="text" class="preset-label" value="${resolvePresetLabel(preset)}" placeholder="${resolvePresetLabel(preset)}">
        <input type="number" class="preset-hour" value="${preset.hour}" min="0" max="23">
        <span>:</span>
        <input type="number" class="preset-minute" value="${preset.minute}" min="0" max="59">
        <label class="enabled-label">
          <input type="checkbox" class="preset-enabled" ${preset.enabled ? 'checked' : ''}>
          ${i18n.get('presetSetting.enabled')}
        </label>
        <button class="remove-preset" data-index="${index}" title="${i18n.get('tooltip.remove')}">🗑️</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.emoji-picker-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEmojiPicker(btn);
    });
  });

  container.querySelectorAll('.remove-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      if (currentSettings.presets.length <= 1) {
        alert(i18n.get('error.minPresets'));
        return;
      }
      currentSettings.presets.splice(index, 1);
      renderPresetSettings();
    });
  });
}

function addPreset() {
  const newPreset = {
    id: 'custom_' + Date.now(),
    label: i18n.get('preset.custom'),
    icon: '⏰',
    hour: 12,
    minute: 0,
    enabled: true
  };
  currentSettings.presets.push(newPreset);
  renderPresetSettings();
}

function saveSettingsFromModal() {
  const presetItems = document.querySelectorAll('.preset-setting-item');

  const newPresets = Array.from(presetItems).map((item, index) => {
    const existingPreset = currentSettings.presets[index];
    const emojiBtn = item.querySelector('.emoji-picker-btn');
    return {
      ...existingPreset,
      icon: emojiBtn?.dataset.emoji || '⏰',
      label: item.querySelector('.preset-label').value || i18n.get('preset.custom'),
      hour: parseInt(item.querySelector('.preset-hour').value) || 0,
      minute: parseInt(item.querySelector('.preset-minute').value) || 0,
      enabled: item.querySelector('.preset-enabled').checked
    };
  });

  const newSettings = {
    presets: newPresets,
    showCompleted: document.getElementById('show-completed').checked,
    completedDuration: parseInt(document.getElementById('completed-duration').value) || 5
  };

  saveSettings(newSettings).then(() => {
    renderPresetButtons();
    closeSettings();
  });
}

function resetSettings() {
  if (confirm(i18n.get('settings.resetConfirm'))) {
    const DEFAULT_SETTINGS = {
      presets: [
        { id: 'evening', label: 'Evening', icon: '🌙', hour: 21, minute: 0, enabled: true },
        { id: 'tomorrow', label: 'Tomorrow', icon: '☀️', hour: 9, minute: 0, enabled: true },
        { id: 'nextweek', label: 'Next Week', icon: '📅', hour: 9, minute: 0, enabled: true }
      ],
      showCompleted: true,
      completedDuration: 5,
      autoMode: { enabled: false, maxTabs: 10, idleHours: 2, snoozePreset: '6h' }
    };
    saveSettings(DEFAULT_SETTINGS).then(() => {
      renderPresetButtons();
      closeSettings();
    });
  }
}

// Navigation Functions
function switchTab(tabName) {
  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    }
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  const targetContent = document.getElementById(`${tabName}-content`);
  if (targetContent) {
    targetContent.classList.add('active');
  }

  // Render content based on tab
  if (tabName === 'settings') {
    renderSettingsNav();
  } else if (tabName === 'snoozed') {
    renderSnoozedTabs();
  } else if (tabName === 'history') {
    renderHistory();
  }
}

function renderSettingsNav() {
  const container = document.querySelector('.settings-list');
  if (!container) return;

  const soundStatus = currentSettings.soundEnabled ? '🔊' : '🔇';

  container.innerHTML = `
    <div class="settings-nav">
      <button class="settings-nav-btn" data-settings-page="presets">
        <span class="icon">⚙️</span>
        <span class="label" data-i18n="settings.presets">Preset Buttons</span>
        <span class="description" data-i18n="settingsPage.presetsDesc">Customize your quick snooze buttons</span>
      </button>
      <button class="settings-nav-btn" data-settings-page="auto">
        <span class="icon">🤖</span>
        <span class="label" data-i18n="settings.auto">Auto Snooze</span>
        <span class="description" data-i18n="settingsPage.autoDesc">Auto-snooze inactive tabs by your rules</span>
      </button>
      <button class="settings-nav-btn" data-settings-page="language">
        <span class="icon">🌐</span>
        <span class="label" data-i18n="settings.language">Language</span>
        <span class="description" data-i18n="settingsPage.languageDesc">Choose your preferred language</span>
      </button>
      <button class="settings-nav-btn" data-settings-page="sound">
        <span class="icon">${soundStatus}</span>
        <span class="label" data-i18n="settings.sound">Sound Effects</span>
        <span class="description">${currentSettings.soundEnabled ? i18n.get('settings.soundsOn') : i18n.get('settings.soundsOff')}</span>
      </button>

      <button class="settings-nav-btn" data-settings-page="notifications">
        <span class="icon">🔔</span>
        <span class="label" data-i18n="settings.notifications">Notifications</span>
        <span class="description" data-i18n="settingsPage.notificationsDesc">Manage how you receive alerts</span>
      </button>
      <button class="settings-nav-btn" data-settings-page="completed">
        <span class="icon">✅</span>
        <span class="label" data-i18n="settings.completed">Completed Tabs</span>
        <span class="description" data-i18n="settings.showCompleted">Show completed tabs briefly</span>
      </button>
      <button class="settings-nav-btn" data-settings-page="about">
        <span class="icon">ℹ️</span>
        <span class="label" data-i18n="settings.about">About</span>
        <span class="description" data-i18n="settingsPage.aboutDesc">Version and information</span>
      </button>
      <button class="settings-nav-btn" data-settings-page="community">
        <span class="icon">❤️</span>
        <span class="label" data-i18n="settings.community">Community</span>
        <span class="description" data-i18n="settingsPage.communityDesc">Get help and join our community</span>
      </button>
    </div>
  `;

  // Update i18n
  i18n.updateUI();

  // Attach event listeners
  container.querySelectorAll('.settings-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openSettingsPage(btn.dataset.settingsPage);
    });
  });
}

function openSettingsPage(page) {
  // This would open a modal or navigate to a detailed settings page
  // For now, let's handle the most common ones
  if (page === 'presets') {
    openPresetsSettings();
  } else if (page === 'auto') {
    openAutoModeSettings();
  } else if (page === 'language') {
    openLanguageSettings();
  } else if (page === 'sound') {
    toggleSoundSettings();
  } else if (page === 'notifications') {
    openNotificationSettings();
  } else if (page === 'completed') {
    openCompletedSettings();
  } else if (page === 'about') {
    openAboutSettings();
  } else if (page === 'community') {
    chrome.tabs.create({ url: 'https://www.skool.com/ai-pays-my-bills-7018/about' });
  } else {
    // Show coming soon for other pages
    alert(i18n.get('status.comingSoon'));
  }
}

function toggleSoundSettings() {
  const newState = !currentSettings.soundEnabled;

  if (typeof soundManager !== 'undefined') {
    soundManager.setEnabled(newState);

    // Play a test sound if enabling
    if (newState) {
      soundManager.playSound('snooze');
    }
  }

  currentSettings.soundEnabled = newState;
  chrome.storage.local.set({ settings: currentSettings }, () => {
    // Re-render settings nav to show updated icon
    renderSettingsNav();
  });
}

function openNotificationSettings() {
  const modal = document.getElementById('settings-modal');
  modal.classList.add('open');

  // Initialize modal handlers
  initModalHandlers();

  // Show notification settings
  const modalBody = modal.querySelector('.modal-body');
  const notificationsEnabled = currentSettings.desktopNotifications || false;

  modalBody.innerHTML = `
    <div class="settings-section">
      <h3>🔔 ${i18n.get('settings.desktopNotifications')}</h3>
      <label class="setting-label" style="margin-bottom: 16px;">
        <input type="checkbox" id="desktop-notifications" ${notificationsEnabled ? 'checked' : ''}>
        <span>${i18n.get('settings.desktopNotificationsDesc')}</span>
      </label>

      ${notificationsEnabled ? `
        <div style="padding: 12px; background: #e7f5ff; border-radius: 8px; font-size: 12px; color: #495057;">
          <p style="margin: 0 0 8px 0;">${i18n.get('notif.tip')}</p>
          <button id="test-notification" class="test-btn" style="padding: 6px 12px; background: #228be6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
            ${i18n.get('notif.testButton')}
          </button>
        </div>
      ` : ''}
    </div>
  `;

  // Attach event listeners
  const checkbox = document.getElementById('desktop-notifications');
  if (checkbox) {
    checkbox.addEventListener('change', (e) => {
      const enabled = e.target.checked;

      if (enabled) {
        // Request permission
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            currentSettings.desktopNotifications = true;
            chrome.storage.local.set({ settings: currentSettings });
            // Re-render to show test button
            openNotificationSettings();
          } else {
            e.target.checked = false;
            alert(i18n.get('error.allowNotifications'));
          }
        });
      } else {
        currentSettings.desktopNotifications = false;
        chrome.storage.local.set({ settings: currentSettings });
        openNotificationSettings();
      }
    });
  }

  const testBtn = document.getElementById('test-notification');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      if (Notification.permission === 'granted') {
        new Notification('🦉 ' + i18n.get('extName'), {
          body: i18n.get('notif.testBody'),
          icon: 'icons/icon128.png'
        });
      }
    });
  }
}

function openAutoModeSettings() {
  const modal = document.getElementById('settings-modal');
  modal.classList.add('open');

  // Initialize modal handlers
  initModalHandlers();

  const auto = currentSettings.autoMode || { enabled: false, maxTabs: 10, idleHours: 2, snoozePreset: '6h' };
  const durationOptions = [
    ['1h', i18n.get('preset.1hour')],
    ['3h', i18n.get('preset.3hours')],
    ['6h', i18n.get('preset.6hours')],
    ['tomorrow', i18n.get('preset.tomorrow')],
    ['nextweek', i18n.get('preset.nextWeek')]
  ];

  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = `
    <div class="settings-section">
      <h3>🤖 ${i18n.get('settings.auto')}</h3>
      <label class="setting-label" style="margin-bottom: 8px;">
        <input type="checkbox" id="auto-enabled" ${auto.enabled ? 'checked' : ''}>
        <span style="font-weight: 600;">${i18n.get('auto.enable')}</span>
      </label>
      <p style="margin: 0 0 16px 0; font-size: 11px; color: #868e96;">${i18n.get('auto.enableDesc')}</p>

      ${auto.enabled ? `
        <div style="margin-bottom: 14px;">
          <label class="setting-label" for="auto-max-tabs" style="display: block; margin-bottom: 4px;">${i18n.get('auto.maxTabs')}</label>
          <input type="number" id="auto-max-tabs" min="3" max="100" value="${auto.maxTabs}" style="width: 80px;">
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #868e96;">${i18n.get('auto.maxTabsHint')}</p>
        </div>
        <div style="margin-bottom: 14px;">
          <label class="setting-label" for="auto-idle-hours" style="display: block; margin-bottom: 4px;">${i18n.get('auto.idleHours')}</label>
          <input type="number" id="auto-idle-hours" min="1" max="48" value="${auto.idleHours}" style="width: 80px;">
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #868e96;">${i18n.get('auto.idleHoursHint')}</p>
        </div>
        <div style="margin-bottom: 16px;">
          <label class="setting-label" for="auto-duration" style="display: block; margin-bottom: 4px;">${i18n.get('auto.duration')}</label>
          <select id="auto-duration" style="padding: 6px; border-radius: 6px; border: 1px solid #dee2e6;">
            ${durationOptions.map(([value, label]) =>
              `<option value="${value}" ${value === auto.snoozePreset ? 'selected' : ''}>${label}</option>`
            ).join('')}
          </select>
        </div>
      ` : ''}

      <div style="padding: 12px; background: #f8f9fa; border-radius: 8px; font-size: 11px; color: #495057; line-height: 1.6;">
        <p style="margin: 0 0 8px 0;">💡 ${i18n.get('auto.help')}</p>
        <p style="margin: 0;">${i18n.get('auto.helpExcluded')}</p>
      </div>
    </div>
  `;

  const clampInt = (raw, min, max, fallback) => {
    const n = parseInt(raw, 10);
    if (isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  };

  const saveAutoMode = () => {
    currentSettings.autoMode = {
      enabled: !!document.getElementById('auto-enabled')?.checked,
      maxTabs: clampInt(document.getElementById('auto-max-tabs')?.value, 3, 100, 10),
      idleHours: clampInt(document.getElementById('auto-idle-hours')?.value, 1, 48, 2),
      snoozePreset: document.getElementById('auto-duration')?.value || '6h'
    };
    // saveSettings notifies the service worker to re-arm the periodic alarm
    saveSettings(currentSettings).then(() => {
      // Re-render: reveals the rule fields after enabling, hides them after disabling
      openAutoModeSettings();
    });
  };

  ['auto-enabled', 'auto-max-tabs', 'auto-idle-hours', 'auto-duration'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', saveAutoMode);
  });
}

function openAboutSettings() {
  const modal = document.getElementById('settings-modal');
  modal.classList.add('open');

  // Initialize modal handlers
  initModalHandlers();

  // Show about info
  const modalBody = modal.querySelector('.modal-body');

  modalBody.innerHTML = `
    <div class="settings-section" style="text-align: center; padding: 20px;">
      <div style="font-size: 48px; margin-bottom: 16px;">🦉</div>
      <h2 style="margin: 0 0 8px 0; color: #212529;">OneClick Snooze</h2>
      <p style="margin: 0 0 16px 0; color: #868e96; font-size: 13px;">
        ${i18n.get('settings.version')}: ${chrome.runtime.getManifest().version}
      </p>
      <div style="padding: 16px; background: #f8f9fa; border-radius: 8px; margin-bottom: 16px;">
        <p style="margin: 0; font-size: 12px; color: #495057; line-height: 1.6;">
          ${i18n.get('settings.author')} ❤️<br>
          ${i18n.get('about.tagline')}
        </p>
      </div>
      <div style="display: flex; gap: 8px; justify-content: center;">
        <button id="rate-extension" class="community-link" style="padding: 8px 16px; font-size: 12px;">
          ${i18n.get('about.rate')}
        </button>
        <button id="share-extension" class="community-link" style="padding: 8px 16px; font-size: 12px;">
          ${i18n.get('about.share')}
        </button>
      </div>
    </div>
  `;

  // Attach event listeners
  document.getElementById('rate-extension')?.addEventListener('click', () => {
    chrome.tabs.create({ url: `https://chrome.google.com/webstore/detail/oneclick-snooze/${chrome.runtime.id}` });
  });

  document.getElementById('share-extension')?.addEventListener('click', () => {
    const shareUrl = `https://chrome.google.com/webstore/detail/oneclick-snooze/${chrome.runtime.id}`;

    if (navigator.share) {
      navigator.share({
        title: i18n.get('extName'),
        text: i18n.get('about.shareText'),
        url: shareUrl
      });
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert(i18n.get('about.linkCopied'));
      });
    }
  });
}

function openPresetsSettings() {
  const modal = document.getElementById('settings-modal');
  modal.classList.add('open');

  // Initialize modal handlers
  initModalHandlers();

  // Reset modal content
  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = `
    <div class="settings-section">
      <h3>${i18n.get('settings.presets')}</h3>
      <div id="preset-settings" class="preset-settings">
        <!-- Preset settings will be rendered dynamically -->
      </div>
      <button id="add-preset" class="add-btn">${i18n.get('settings.addPreset')}</button>
    </div>

    <div class="settings-section">
      <h3>${i18n.get('settings.completed')}</h3>
      <label class="setting-label">
        <input type="checkbox" id="show-completed">
        <span>${i18n.get('settings.showCompleted')}</span>
      </label>
      <div class="setting-row" id="completed-duration-row">
        <label>${i18n.get('settings.duration')}</label>
        <input type="number" id="completed-duration" min="1" max="60" value="5">
      </div>
    </div>

    <div class="settings-actions">
      <button id="reset-settings" class="reset-btn">${i18n.get('settings.reset')}</button>
      <button id="save-settings" class="save-btn">${i18n.get('settings.save')}</button>
    </div>
  `;

  renderPresetSettings();

  document.getElementById('show-completed').checked = currentSettings.showCompleted;
  document.getElementById('completed-duration').value = currentSettings.completedDuration;
  document.getElementById('completed-duration-row').style.display =
    currentSettings.showCompleted ? 'flex' : 'none';

  // Attach event listeners
  document.getElementById('add-preset').addEventListener('click', addPreset);
  document.getElementById('save-settings').addEventListener('click', saveSettingsFromModal);
  document.getElementById('reset-settings').addEventListener('click', resetSettings);
  document.getElementById('show-completed').addEventListener('change', (e) => {
    document.getElementById('completed-duration-row').style.display =
      e.target.checked ? 'flex' : 'none';
  });
}

function openLanguageSettings() {
  const availableLocales = i18n.getAvailableLocales();
  const currentLocale = i18n.currentLocale;

  const modal = document.getElementById('settings-modal');
  modal.classList.add('open');

  // Initialize modal handlers
  initModalHandlers();

  // Show language selection
  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = `
    <div class="settings-section">
      <h3>${i18n.get('settingsPage.languageTitle')}</h3>
      <div class="language-options">
        ${availableLocales.map(locale => `
          <button class="language-option ${locale.code === currentLocale ? 'active' : ''}" data-locale="${locale.code}">
            <span class="locale-code">${locale.code.toUpperCase()}</span>
            <span class="locale-name">${locale.nativeName}</span>
            ${locale.code === currentLocale ? '<span class="check">✓</span>' : ''}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Attach event listeners
  modalBody.querySelectorAll('.language-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const newLocale = btn.dataset.locale;
      if (newLocale !== currentLocale) {
        i18n.setLocale(newLocale);
        // Reload the page to apply changes
        setTimeout(() => location.reload(), 100);
      } else {
        closeSettings();
      }
    });
  });
}

function openCompletedSettings() {
  const modal = document.getElementById('settings-modal');
  modal.classList.add('open');

  // Initialize modal handlers
  initModalHandlers();

  // Show only completed settings
  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = `
    <div class="settings-section">
      <h3>${i18n.get('settings.completed')}</h3>
      <label class="setting-label">
        <input type="checkbox" id="show-completed" ${currentSettings.showCompleted ? 'checked' : ''}>
        <span>${i18n.get('settings.showCompleted')}</span>
      </label>
      <div class="setting-row" id="completed-duration-row">
        <label>${i18n.get('settings.duration')}</label>
        <input type="number" id="completed-duration" min="1" max="60" value="${currentSettings.completedDuration}">
      </div>
    </div>

    <div class="settings-actions">
      <button id="save-completed-settings" class="save-btn">${i18n.get('settings.save')}</button>
    </div>
  `;

  // Attach event listeners
  const showCompletedCheckbox = document.getElementById('show-completed');
  if (showCompletedCheckbox) {
    showCompletedCheckbox.addEventListener('change', (e) => {
      document.getElementById('completed-duration-row').style.display =
        e.target.checked ? 'flex' : 'none';
    });
  }

  const saveButton = document.getElementById('save-completed-settings');
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      const newSettings = {
        ...currentSettings,
        showCompleted: document.getElementById('show-completed').checked,
        completedDuration: parseInt(document.getElementById('completed-duration').value) || 5
      };

      saveSettings(newSettings).then(() => {
        closeSettings();
        renderSnoozedTabs();
      });
    });
  }
}

// Quick Preset Functions
async function snoozeForMinutes(minutes) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !validateUrl(tab.url)) {
    alert(i18n.get('error.invalidUrl'));
    return;
  }

  const scheduledTime = Date.now() + (minutes * 60 * 1000);
  const tabData = {
    id: generateId(),
    tabId: tab.id,
    url: tab.url,
    title: tab.title,
    favicon: tab.favIconUrl || '',
    scheduledTime: scheduledTime,
    createdTime: Date.now(),
    preset: `minutes_${minutes}`,
    presetLabel: i18n.get('preset.minutes', [String(minutes)]),
    status: 'active'
  };

  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    // Same-slot queue: fixed-time presets («Tomorrow», «Weekends»…) would otherwise all restore at once
    tabData.scheduledTime = staggerScheduledTime(tabData.scheduledTime, snoozedTabs);
    snoozedTabs.push(tabData);

    chrome.storage.local.set({ snoozedTabs: snoozedTabs }, () => {
      chrome.alarms.create(`snooze_${tabData.id}`, { when: tabData.scheduledTime });

      // Play sound then close tab after brief delay so audio starts
      if (typeof soundManager !== 'undefined') {
        soundManager.playSound('snooze');
      }

      setTimeout(() => {
        chrome.tabs.remove(tab.id);
        updateAllNavCounts();
        renderSnoozedTabs();
        renderHistory();
      }, 300);
    });
  });
}

async function snoozeWithSmartPreset(presetType) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !validateUrl(tab.url)) {
    alert(i18n.get('error.invalidUrl'));
    return;
  }

  const scheduledTime = calculateSmartPresetTime(presetType);
  if (!scheduledTime) return; // pick-date opens modal

  const tabData = {
    id: generateId(),
    tabId: tab.id,
    url: tab.url,
    title: tab.title,
    favicon: tab.favIconUrl || '',
    scheduledTime: scheduledTime,
    createdTime: Date.now(),
    preset: presetType,
    presetLabel: formatPresetLabel(presetType),
    status: 'active'
  };

  chrome.storage.local.get('snoozedTabs', (result) => {
    const snoozedTabs = result.snoozedTabs || [];
    // Same-slot queue: fixed-time presets («Tomorrow», «Weekends»…) would otherwise all restore at once
    tabData.scheduledTime = staggerScheduledTime(tabData.scheduledTime, snoozedTabs);
    snoozedTabs.push(tabData);

    chrome.storage.local.set({ snoozedTabs: snoozedTabs }, () => {
      chrome.alarms.create(`snooze_${tabData.id}`, { when: tabData.scheduledTime });

      // Play sound then close tab after brief delay so audio starts
      if (typeof soundManager !== 'undefined') {
        soundManager.playSound('snooze');
      }

      setTimeout(() => {
        chrome.tabs.remove(tab.id);
        updateAllNavCounts();
        renderSnoozedTabs();
        renderHistory();
      }, 300);
    });
  });
}

function formatPresetLabel(presetType) {
  return getPresetLocaleLabel(presetType) || presetType;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadSettings();
    // Wait for locale to load before rendering — buttons use i18n.get()
    if (typeof i18n !== 'undefined') {
      await i18n.ready;
    }
    renderPresetButtons();
    updateAllNavCounts();
    renderSnoozedTabs();
    renderHistory();
    startCountdown();

    // Initialize modal handlers
    initModalHandlers();

    // Initialize i18n
    if (typeof i18n !== 'undefined') {
      i18n.updateUI();
    }

    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
      });
    });

    // Quick presets (hour buttons)
    document.querySelectorAll('.quick-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.minutes);
        snoozeForMinutes(minutes);
      });
    });

    // Smart presets
    document.querySelectorAll('.smart-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        snoozeWithSmartPreset(btn.dataset.preset);
      });
    });

    // History controls
    document.getElementById('clear-history')?.addEventListener('click', (e) => {
      e.stopPropagation();
      clearHistory();
    });

    // Edit modal controls
    document.getElementById('close-edit-modal')?.addEventListener('click', closeEditModal);
    document.getElementById('edit-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'edit-modal') {
        closeEditModal();
      }
    });
    document.getElementById('save-edit')?.addEventListener('click', saveTabEdit);
    document.getElementById('open-now')?.addEventListener('click', () => {
      if (editingTabId) {
        chrome.storage.local.get('snoozedTabs', (result) => {
          const tab = result.snoozedTabs?.find(t => t.id === editingTabId);
          if (tab) {
            if (tab.isCurrentTab) {
              chrome.tabs.create({ url: tab.url });
            } else {
              openTabNow(editingTabId, tab.url);
            }
          }
          closeEditModal();
        });
      }
    });

    // Time/Date input change handlers for live preview
    const updateDatePreview = () => {
      const hour = parseInt(document.getElementById('custom-hour')?.value) || 0;
      const minute = parseInt(document.getElementById('custom-minute')?.value) || 0;
      const dateStr = document.getElementById('custom-date')?.value || null;
      const newTime = calculateCustomTime(hour, minute, dateStr);
      updateEditDateDisplay(newTime);
    };

    document.getElementById('custom-hour')?.addEventListener('change', updateDatePreview);
    document.getElementById('custom-minute')?.addEventListener('change', updateDatePreview);
    document.getElementById('custom-date')?.addEventListener('change', updateDatePreview);

    // Emoji picker controls
    document.getElementById('close-emoji-picker')?.addEventListener('click', closeEmojiPicker);
    document.addEventListener('click', (e) => {
      const picker = document.getElementById('emoji-picker');
      if (picker && picker.style.display === 'block' &&
          !picker.contains(e.target) &&
          !e.target.classList.contains('emoji-picker-btn')) {
        closeEmojiPicker();
      }
    });
  } catch (e) {
    console.error('OneClick Snooze popup init error:', e);
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(countdownInterval);
  } else {
    renderSnoozedTabs();
    renderHistory();
    startCountdown();
  }
});
