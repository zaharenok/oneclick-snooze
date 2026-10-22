#!/usr/bin/env node
// Locale parity test for _locales/<code>/messages.json.
// Run: node tests/check-locales.js
// Exits 0 when: manifest wiring is correct, en has every key, all other
// locales match en's key set exactly with non-empty messages and matching
// $n placeholders, and every literal i18n key referenced in popup.js /
// popup.html / background.js exists in en.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, '_locales');

// Must match the Chrome Web Store listing locales (store-listing/master.py),
// mapped to valid Chrome _locales codes.
const EXPECTED = [
  'en', 'ru', 'de', 'es', 'zh_CN', 'uk', 'fr', 'pt_BR',
  'it', 'pl', 'tr', 'ja', 'zh_TW', 'ko', 'nl', 'vi', 'id'
];

const errors = [];

function loadLocale(code) {
  const file = path.join(LOCALES_DIR, code, 'messages.json');
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    errors.push(`${code}: invalid JSON — ${err.message}`);
    return null;
  }
}

const en = loadLocale('en');
if (!en) {
  console.error('FAIL: could not load _locales/en/messages.json');
  process.exit(1);
}
const enKeys = Object.keys(en);

// en is the source of truth: safe key names, non-empty messages.
for (const k of enKeys) {
  if (!/^[A-Za-z0-9_]+$/.test(k)) {
    errors.push(`en: key "${k}" contains characters outside [A-Za-z0-9_]`);
  }
  if (!en[k] || typeof en[k].message !== 'string' || en[k].message.trim() === '') {
    errors.push(`en: key "${k}" has an empty or missing "message"`);
  }
}

// Directory set: exactly the expected locales, no extras.
const actualDirs = fs.readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);
for (const code of EXPECTED) {
  if (!actualDirs.includes(code)) errors.push(`missing locale directory: _locales/${code}`);
}
for (const code of actualDirs) {
  if (!EXPECTED.includes(code)) {
    errors.push(`unexpected locale directory: _locales/${code} (supported: ${EXPECTED.join(', ')})`);
  }
}

const placeholders = (s) => (String(s).match(/\$\d/g) || []).sort().join(',');

for (const code of EXPECTED) {
  const messages = loadLocale(code);
  if (!messages) {
    if (actualDirs.includes(code)) errors.push(`${code}: failed to parse messages.json`);
    continue;
  }
  const keys = Object.keys(messages);
  for (const k of enKeys) {
    if (!keys.includes(k)) errors.push(`${code}: missing key "${k}"`);
  }
  for (const k of keys) {
    if (!enKeys.includes(k)) errors.push(`${code}: extra key "${k}" (not in en)`);
    const v = messages[k];
    if (!v || typeof v.message !== 'string' || v.message.trim() === '') {
      errors.push(`${code}: key "${k}" has an empty or missing "message"`);
    }
  }
  for (const k of enKeys) {
    const loc = messages[k];
    if (!loc || typeof loc.message !== 'string') continue;
    const enPh = placeholders(en[k].message);
    const locPh = placeholders(loc.message);
    if (enPh !== locPh) {
      errors.push(`${code}: key "${k}" placeholder mismatch (en: "${enPh || 'none'}", ${code}: "${locPh || 'none'}")`);
    }
  }
}

// Manifest wiring: default_locale + __MSG_*__ references resolve in en.
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
if (manifest.default_locale !== 'en') {
  errors.push(`manifest: default_locale is "${manifest.default_locale}", expected "en"`);
}
const msgRef = (value) => {
  const m = /^__MSG_(\w+)__$/.exec(String(value));
  return m ? m[1] : null;
};
for (const field of ['name', 'description']) {
  const key = msgRef(manifest[field]);
  if (!key) errors.push(`manifest: ${field} is not a __MSG_*__ reference (${JSON.stringify(manifest[field])})`);
  else if (!enKeys.includes(key)) errors.push(`manifest: ${field} references missing key "${key}"`);
}
const actionTitleKey = msgRef(manifest.action && manifest.action.default_title);
if (!actionTitleKey) errors.push('manifest: action.default_title is not a __MSG_*__ reference');
else if (!enKeys.includes(actionTitleKey)) {
  errors.push(`manifest: action.default_title references missing key "${actionTitleKey}"`);
}

// Static reference check: every literal key used in code exists in en.
const flat = (dotted) => dotted.replace(/\./g, '_');

function scanFile(relPath, patterns) {
  const src = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  const found = new Set();
  for (const re of patterns) {
    let m;
    while ((m = re.exec(src)) !== null) {
      const key = m[1];
      // Skip dynamic concatenations such as 'preset.' + key.
      if (key.endsWith('.')) continue;
      found.add(key);
    }
  }
  return [...found];
}

const referenced = new Set();
for (const key of scanFile('popup/popup.js', [
  /i18n\.get\(\s*'([^']+)'/g,
  /chrome\.i18n\.getMessage\(\s*'([^']+)'/g,
  /data-i18n="([^"]+)"/g
])) referenced.add(flat(key));
for (const key of scanFile('popup/popup.html', [/data-i18n="([^"]+)"/g])) referenced.add(flat(key));
for (const key of scanFile('background/background.js', [
  /msgs\.([A-Za-z0-9_]+)/g
])) referenced.add(key);

for (const key of referenced) {
  if (!enKeys.includes(key)) errors.push(`code references missing en key "${key}"`);
}

// ── Pure locale-resolution + substitution logic (lib/messages.js) ──
const M = require(path.join(ROOT, 'lib', 'messages.js'));
const eq = (actual, expected, label) => {
  if (actual !== expected) {
    errors.push(`${label}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
  }
};
eq(M.messagesResolveLocale('en-US', undefined), 'en', 'resolve en-US');
eq(M.messagesResolveLocale('ru', undefined), 'ru', 'resolve ru');
eq(M.messagesResolveLocale('de-DE', undefined), 'de', 'resolve de-DE');
eq(M.messagesResolveLocale('zh-CN', undefined), 'zh_CN', 'resolve zh-CN');
eq(M.messagesResolveLocale('pt-BR', undefined), 'pt_BR', 'resolve pt-BR');
eq(M.messagesResolveLocale('fr', 'de'), 'de', 'stored choice wins over browser');
eq(M.messagesResolveLocale('en-US', 'zh'), 'zh_CN', 'legacy stored zh -> zh_CN');
eq(M.messagesResolveLocale('unknown-XX', undefined), 'en', 'unknown locale -> en');
eq(M.messagesSub('$1 minutes', ['30']), '30 minutes', 'messagesSub array sub');
eq(M.messagesSub('"$1" has been restored.', 'My Tab'), '"My Tab" has been restored.', 'messagesSub string sub');
eq(M.messagesSub('no placeholder', 'x'), 'no placeholder', 'messagesSub no-op');

if (errors.length) {
  console.error(`FAIL: ${errors.length} problem(s) in _locales / manifest / code`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `OK: ${EXPECTED.length} locales (${EXPECTED.join(', ')}), ` +
    `${enKeys.length} keys each, parity + manifest wiring + code references + locale logic confirmed`
);
