// Shared locale resolution + _locales messages.json loading + $n substitution.
// Used by popup/locales.js (classic <script>) and background/background.js (importScripts).
// Pure helpers are exported under CommonJS for Node tests; chrome-dependent
// loaders stay as global functions.

const MESSAGES_DEFAULT = 'en';

// Supported Chrome _locales codes (must match _locales/ and tests/check-locales.js).
const MESSAGES_SUPPORTED = [
  'en', 'ru', 'de', 'es', 'zh_CN', 'uk', 'fr', 'pt_BR',
  'it', 'pl', 'tr', 'ja', 'zh_TW', 'ko', 'nl', 'vi', 'id'
];

// Aliases: bare/legacy codes -> supported code (returning users may have 'zh'/'pt' stored).
const MESSAGES_ALIASES = {
  zh: 'zh_CN',
  pt: 'pt_BR',
  zh_Hans: 'zh_CN',
  zh_Hant: 'zh_TW'
};

// Native display names for the in-app language picker.
const MESSAGES_NATIVE = {
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
  es: 'Español',
  zh_CN: '中文（简体）',
  uk: 'Українська',
  fr: 'Français',
  pt_BR: 'Português (Brasil)',
  it: 'Italiano',
  pl: 'Polski',
  tr: 'Türkçe',
  ja: '日本語',
  zh_TW: '中文（繁體）',
  ko: '한국어',
  nl: 'Nederlands',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia'
};

// Normalize a locale tag: 'zh-CN' -> 'zh_CN'.
function messagesNormalize(code) {
  return String(code == null ? '' : code).replace(/-/g, '_');
}

// Resolve the active locale. Precedence: valid stored choice > browser UI locale >
// alias/base-language mapping > default (en). Handles legacy stored 'zh'/'pt'.
function messagesResolveLocale(uiLang, stored) {
  if (stored && MESSAGES_SUPPORTED.indexOf(stored) !== -1) return stored;
  const storedNorm = messagesNormalize(stored);
  if (storedNorm && MESSAGES_ALIASES[storedNorm]) return MESSAGES_ALIASES[storedNorm];

  const ui = messagesNormalize(uiLang);
  if (ui && MESSAGES_SUPPORTED.indexOf(ui) !== -1) return ui;
  const base = ui ? ui.split('_')[0] : '';
  if (base) {
    if (MESSAGES_ALIASES[base]) return MESSAGES_ALIASES[base];
    if (MESSAGES_SUPPORTED.indexOf(base) !== -1) return base;
    if (base === 'zh') return 'zh_CN';
    if (base === 'pt') return 'pt_BR';
  }
  return MESSAGES_DEFAULT;
}

// Replace $1..$9 placeholders. subs may be a single value or an array.
function messagesSub(template, subs) {
  if (template == null) return '';
  let out = String(template);
  const arr = Array.isArray(subs) ? subs : (subs == null ? [] : [subs]);
  for (let i = 0; i < 9; i++) {
    const token = '$' + (i + 1);
    if (out.indexOf(token) !== -1) {
      out = out.split(token).join(arr[i] != null ? String(arr[i]) : '');
    }
  }
  return out;
}

// Fetch one locale's messages.json and flatten to { key: message }.
async function messagesFetch(code) {
  const url = chrome.runtime.getURL('_locales/' + code + '/messages.json');
  const res = await fetch(url);
  if (!res.ok) return {};
  const json = await res.json();
  const flat = {};
  for (const key of Object.keys(json)) {
    const entry = json[key];
    flat[key] = entry && entry.message != null ? entry.message : '';
  }
  return flat;
}

// Load messages for a code with English fallback (sparse locales inherit missing keys).
async function messagesLoad(code) {
  const en = await messagesFetch(MESSAGES_DEFAULT);
  if (code === MESSAGES_DEFAULT) return en;
  const loc = await messagesFetch(code);
  return Object.assign({}, en, loc);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MESSAGES_DEFAULT,
    MESSAGES_SUPPORTED,
    MESSAGES_ALIASES,
    MESSAGES_NATIVE,
    messagesNormalize,
    messagesResolveLocale,
    messagesSub
  };
}
