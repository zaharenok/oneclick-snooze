// Settings management for Tab Snooze extension

const DEFAULT_SETTINGS = {
  presets: [
    {
      id: 'evening',
      label: 'Evening',
      icon: '🌙',
      hour: 21,
      minute: 0,
      enabled: true
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow',
      icon: '☀️',
      hour: 9,
      minute: 0,
      enabled: true
    },
    {
      id: 'nextweek',
      label: 'Next Week',
      icon: '📅',
      hour: 9,
      minute: 0,
      enabled: true
    }
  ],
  showCompleted: true,
  completedDuration: 5
};

class Settings {
  static async get() {
    return new Promise((resolve) => {
      chrome.storage.local.get('settings', (result) => {
        const settings = result.settings || DEFAULT_SETTINGS;
        resolve({ ...DEFAULT_SETTINGS, ...settings });
      });
    });
  }

  static async update(newSettings) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ settings: newSettings }, () => {
        resolve(newSettings);
      });
    });
  }

  static async reset() {
    return this.update(DEFAULT_SETTINGS);
  }

  static calculateScheduledTime(preset, settings) {
    const presetConfig = settings.presets.find(p => p.id === preset);
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
        return null;
    }

    return scheduled.getTime();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Settings;
}
