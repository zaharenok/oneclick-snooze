#!/usr/bin/env node
// Key-parity test for popup/locales.js.
// Run: node tests/check-locales.js
// Exits 0 when all UI locales share the same key set as en; 1 otherwise.
'use strict';

const fs = require('fs');
const path = require('path');

const EXPECTED = ['en', 'ru', 'de', 'es', 'zh'];

const src = fs.readFileSync(
  process.argv[2] || path.join(__dirname, '..', 'popup', 'locales.js'),
  'utf8'
);
const start = src.indexOf('const locales = {');
const end = src.indexOf('class I18n');
if (start === -1 || end === -1 || end <= start) {
  console.error('FAIL: could not locate the locales object in popup/locales.js');
  process.exit(1);
}
const literal = src
  .slice(start + 'const locales ='.length, end)
  .trim()
  .replace(/;\s*$/, '');
let locales;
try {
  locales = new Function(`return ${literal}`)();
} catch (err) {
  console.error(`FAIL: could not evaluate locales object: ${err.message}`);
  process.exit(1);
}

const flatten = (obj, prefix = '') => {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') keys.push(...flatten(v, key));
    else keys.push(key);
  }
  return keys;
};

const errors = [];

const actual = Object.keys(locales);
for (const code of EXPECTED) {
  if (!actual.includes(code)) errors.push(`missing locale: ${code}`);
}
for (const code of actual) {
  if (!EXPECTED.includes(code)) {
    errors.push(`unexpected locale: ${code} (extension supports: ${EXPECTED.join(', ')})`);
  }
}

const enKeys = new Set(flatten(locales.en || {}));
for (const code of actual) {
  const keys = new Set(flatten(locales[code]));
  for (const k of enKeys) {
    if (!keys.has(k)) errors.push(`${code}: missing key "${k}"`);
  }
  for (const k of keys) {
    if (!enKeys.has(k)) errors.push(`${code}: extra key "${k}" (not in en)`);
  }
  for (const [k, v] of Object.entries(locales[code])) {
    if (typeof v === 'string' && v.trim() === '') {
      errors.push(`${code}: empty value at "${k}"`);
    }
  }
}

if (errors.length) {
  console.error(`FAIL: ${errors.length} problem(s) in popup/locales.js`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `OK: ${actual.length} locales (${actual.join(', ')}), ` +
    `${enKeys.size} keys each, parity with en confirmed`
);
