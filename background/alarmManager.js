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
