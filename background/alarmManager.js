// Time calculations and alarm scheduling for tab snoozing

class AlarmManager {
  static calculateScheduledTime(preset) {
    const now = new Date();
    let scheduled = new Date();

    switch (preset) {
      case 'evening':
        scheduled.setHours(21, 0, 0, 0);
        if (scheduled <= now) {
          scheduled.setDate(scheduled.getDate() + 1);
        }
        break;

      case 'tomorrow':
        scheduled.setDate(scheduled.getDate() + 1);
        scheduled.setHours(9, 0, 0, 0);
        break;

      case 'nextweek':
        const currentDay = scheduled.getDay();
        const daysUntilMonday = (1 + 7 - currentDay) % 7 || 7;
        scheduled.setDate(scheduled.getDate() + daysUntilMonday);
        scheduled.setHours(9, 0, 0, 0);
        break;

      // Relative presets (used by Auto Snooze duration and matching popup labels)
      case '1h':
        scheduled.setTime(now.getTime() + 60 * 60 * 1000);
        break;

      case '3h':
        scheduled.setTime(now.getTime() + 3 * 60 * 60 * 1000);
        break;

      case '6h':
        scheduled.setTime(now.getTime() + 6 * 60 * 60 * 1000);
        break;

      case '12h':
        scheduled.setTime(now.getTime() + 12 * 60 * 60 * 1000);
        break;

      default:
        throw new Error(`Unknown preset: ${preset}`);
    }

    return scheduled.getTime();
  }

  static createAlarm(tabId, tabData) {
    const alarmName = `snooze_${tabData.id}`;
    const scheduledTime = tabData.scheduledTime;

    chrome.alarms.create(alarmName, {
      when: scheduledTime
    });

    return alarmName;
  }

  static cancelAlarm(tabId) {
    const alarmName = `snooze_${tabId}`;
    chrome.alarms.clear(alarmName);
  }

  // Due-tab selection for the restore queue (background drains these one by one)
  static selectNextDueTab(snoozedTabs, now) {
    const due = (snoozedTabs || [])
      .filter(t => t.status === 'active' && t.scheduledTime <= now)
      .sort((a, b) => a.scheduledTime - b.scheduledTime);
    return due[0] || null;
  }

  // Auto Snooze: pick tabs to snooze automatically. Pure function (no chrome.*) —
  // tested by tests/check-automode.js. Rules:
  //   1) eligible tabs exceed opts.maxTabs → snooze oldest-accessed beyond the cap
  //   2) tab inactive (lastAccessed) for >= opts.idleHours → snooze it
  // Never eligible: active, pinned, audible, service pages. Order: oldest first.
  static selectTabsForAutoSnooze(tabs, opts, now) {
    const maxTabs = Math.max(1, Math.floor(opts.maxTabs) || 1);
    const idleMs = Math.max(0, Number(opts.idleHours) || 0) * 3600000;
    const isServiceUrl = (url) =>
      /^(chrome|edge|about|devtools|view-source|chrome-extension|moz-extension):/i.test(url || '');

    const eligible = (tabs || []).filter(t =>
      !t.pinned && !t.active && !t.audible && !isServiceUrl(t.url)
    );

    // Oldest accessed first; unknown lastAccessed counts as "just used"
    // (sorted last → never idle-snoozed, picked only by the cap rule)
    const byAge = eligible.slice().sort((a, b) =>
      (typeof a.lastAccessed === 'number' ? a.lastAccessed : now) -
      (typeof b.lastAccessed === 'number' ? b.lastAccessed : now)
    );

    const picked = new Set();

    // Rule 2: inactivity threshold
    if (idleMs > 0) {
      for (const t of byAge) {
        if (typeof t.lastAccessed === 'number' && now - t.lastAccessed >= idleMs) {
          picked.add(t.id);
        }
      }
    }

    // Rule 1: tab cap — snooze the overflow, oldest first
    const overflow = byAge.length - maxTabs;
    if (overflow > 0) {
      for (const t of byAge.slice(0, overflow)) {
        picked.add(t.id);
      }
    }

    return byAge.filter(t => picked.has(t.id)).map(t => t.id);
  }

  static countDueTabs(snoozedTabs, now, excludeId = null) {
    return (snoozedTabs || []).filter(t =>
      t.status === 'active' && t.scheduledTime <= now && t.id !== excludeId
    ).length;
  }

  static formatCountdown(scheduledTime) {
    const now = Date.now();
    const diff = scheduledTime - now;

    if (diff <= 0) {
      return 'now';
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

  static getPresetLabel(preset) {
    const labels = {
      evening: 'Evening (21:00)',
      tomorrow: 'Tomorrow (09:00)',
      nextweek: 'Next Week (Mon 09:00)'
    };
    return labels[preset] || preset;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AlarmManager;
}
