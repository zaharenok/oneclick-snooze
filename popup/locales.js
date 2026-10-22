// i18n wrapper (hybrid): loads _locales/<code>/messages.json directly.
// The in-app language switcher stores the choice in chrome.storage.local 'locale';
// default follows the browser UI locale. manifest still uses __MSG_*__ +
// default_locale "en" (official, CWS-compatible). Requires lib/messages.js.

class I18n {
  constructor() {
    this.currentLocale = MESSAGES_DEFAULT;
    this._messages = {};
    this._ready = this._init();
  }

  /** Await before using i18n.get() — resolves once messages are loaded. */
  get ready() { return this._ready; }

  /** BCP47 tag for Intl APIs, e.g. 'zh_CN' -> 'zh-CN'. */
  localeTag() { return String(this.currentLocale).replace(/_/g, '-'); }

  async _init() {
    const stored = await new Promise((resolve) => {
      chrome.storage.local.get('locale', (res) => resolve(res.locale));
    });
    const ui = (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage)
      ? chrome.i18n.getUILanguage()
      : (typeof navigator !== 'undefined' ? navigator.language : MESSAGES_DEFAULT);
    this.currentLocale = messagesResolveLocale(ui, stored);
    this._messages = await messagesLoad(this.currentLocale);
    this.updateUI();
  }

  /** Switch language: persist choice, reload messages, re-render static labels. */
  async setLocale(code) {
    if (MESSAGES_SUPPORTED.indexOf(code) === -1) return;
    this.currentLocale = code;
    this._messages = await messagesLoad(code);
    await new Promise((resolve) => {
      chrome.storage.local.set({ locale: code }, resolve);
    });
    this.updateUI();
  }

  /**
   * Fetch a localized string.
   * @param {string} key dotted key, e.g. 'nav.dashboard' -> message 'nav_dashboard'
   * @param {string|string[]} [subs] substitution(s) for $1..$9 placeholders
   * @returns {string}
   */
  get(key, subs) {
    const msgKey = key.replace(/\./g, '_');
    const template = msgKey in this._messages ? this._messages[msgKey] : key;
    return messagesSub(template, subs);
  }

  /** Apply translations to every [data-i18n] element in the document. */
  updateUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.get(el.getAttribute('data-i18n'));
    });
  }

  /** Locales for the in-app language picker. */
  getAvailableLocales() {
    return MESSAGES_SUPPORTED.map(code => ({
      code,
      nativeName: MESSAGES_NATIVE[code] || code
    }));
  }
}

// Create global instance
const i18n = new I18n();
