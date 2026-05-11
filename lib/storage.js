// Chrome storage abstraction layer for snoozed tabs

const STORAGE_KEY = 'snoozedTabs';

class Storage {
  static async getAll() {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        resolve(result[STORAGE_KEY] || []);
      });
    });
  }

  static async add(tabData) {
    const tabs = await this.getAll();
    tabs.push(tabData);
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: tabs }, () => resolve(tabData));
    });
  }

  static async update(id, updates) {
    const tabs = await this.getAll();
    const index = tabs.findIndex(t => t.id === id);
    if (index !== -1) {
      tabs[index] = { ...tabs[index], ...updates };
      return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEY]: tabs }, () => resolve(tabs[index]));
      });
    }
    return null;
  }

  static async delete(id) {
    const tabs = await this.getAll();
    const filtered = tabs.filter(t => t.id !== id);
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: filtered }, () => resolve());
    });
  }

  static async clearExpired() {
    const tabs = await this.getAll();
    const now = Date.now();
    const active = tabs.filter(t => t.status === 'active' && t.scheduledTime > now);
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: active }, () => resolve());
    });
  }

  static async getById(id) {
    const tabs = await this.getAll();
    return tabs.find(t => t.id === id) || null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
