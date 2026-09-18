# Repository Guidelines

## Project Overview

OneClick Snooze — Chrome MV3 extension that snoozes tabs (close now, reopen later) with one click. Vanilla JS: no framework, no build system, no `package.json`, no dependencies, no CI. UI in 5 languages (EN, RU, DE, ES, ZH) via an in-app locale map — Chrome's `_locales` system is NOT used. GitHub: https://github.com/zaharenok/oneclick-snooze (branch `main`).

## Architecture & Data Flow

```
popup.js (UI controller) ──► chrome.storage.local ──► chrome.alarms ──► background.js
        │                        'snoozedTabs'           'snooze_{id}'       service worker
        └──────────────────── 'settings', 'locale' ────────────┘
```

1. Popup: user clicks preset → `calculateScheduledTime(preset)` → tabData pushed to `snoozedTabs` → `chrome.alarms.create('snooze_{id}')` → `chrome.tabs.remove()`.
2. Background: `chrome.alarms.onAlarm` filters `snooze_` prefix → finds tabData by `t.id` → `chrome.tabs.create(url)` → marks `status: 'expired'`, sets `completedAt` → notification.
3. `chrome.runtime.onStartup`: bulk-restores overdue `active` tabs whose `scheduledTime <= now`.

### Known duplication (deliberate, be careful)

- `calculateScheduledTime` exists in THREE places: `popup/popup.js`, `lib/settings.js`, `background/alarmManager.js`. They already diverge (alarmManager hardcodes 21:00/09:00/09:00 and throws on unknown preset; popup reads configurable `currentSettings.presets` and returns null). Changing a preset means editing all three.
- `DEFAULT_SETTINGS` defined in both `popup/popup.js` and `lib/settings.js` (popup's has `soundEnabled`, lib's does not).
- `formatCountdown` duplicated in `popup/popup.js` and `alarmManager.js`.

## Key Directories

| Path | Purpose |
|---|---|
| `background/` | `background.js` (service worker: alarm listener, startup catch-up) + `alarmManager.js` (classic scripts only, joined via `importScripts`) |
| `popup/` | `popup.html` (loads `locales.js` → `sounds.js` → `popup.js`, in that order), `popup.css`, `popup.js` (~1600-line monolith: ALL UI logic), `locales.js` (`locales` object + `I18n` class, nested keys like `nav.dashboard` applied via `data-i18n` attrs), `sounds.js` (`SoundManager`, file-based audio: snooze (click) and restore (pop)) |
| `lib/` | `storage.js`, `settings.js` — `Storage`/`Settings` classes. NOT loaded by popup or background; kept importable via CommonJS guard (`if (typeof module !== 'undefined')`). Currently unused by runtime code. |
| `icons/` | Production PNGs 16/32/48/128 referenced by manifest. `icons/concepts/` = design exploration (SVG+PNG) — NEVER reference from manifest. |

## Important Files

- `manifest.json` — MV3; permissions `alarms`, `storage`, `tabs`, `notifications`, `offscreen`; `host_permissions: <all_urls>`; service worker `background/background.js`; popup `popup/popup.html`. No `default_locale` (i18n is in-app).
- `popup/popup.js` — entry point for all behavior; has its own `DEFAULT_SETTINGS` copy — grep before editing.
- `popup/locales.js` — also contains an `I18n` class using `chrome.storage.local` key `locale`; global `const i18n = new I18n()`.
- `PLAN.md` (Russian) — dev plan; next-session tasks in «Приоритет 1». `КОНКУРЕНТЫ.md` — competitor research. `PRIVACY.md` — store privacy policy.
- `offscreen/` — offscreen document (`AUDIO_PLAYBACK`) that plays the restore sound when a tab restores while the popup is closed.

### Storage schema

- `snoozedTabs` (array): `{ id (base36 timestamp+random), tabId, url, title, favicon, scheduledTime (epoch ms), createdTime, preset, presetLabel, status: 'active'|'expired', completedAt? }`.
- `settings`: `{ presets: [{id, label, icon, hour, minute, enabled}], showCompleted, completedDuration, soundEnabled, desktopNotifications? }`.
- Alarms named `snooze_{tabData.id}`; background ignores anything not prefixed `snooze_`.

## Development Commands

No build/test/lint exists. Manual workflow:

1. `chrome://extensions` → enable Developer mode.
2. "Load unpacked" → select this repo folder.
3. After every change: reload the extension (service worker dies on edit) and reopen the popup.

Quick syntax check from CLI: `node --check <file.js>` (works because all files are classic scripts).

## Code Conventions & Common Patterns

- ES classes with `static` methods; one-line `// purpose` header comment per file.
- `chrome.*` callbacks wrapped in `new Promise((resolve) => ...)` and consumed with `async/await`.
- Single quotes, semicolons, 2-space indent.
- New UI strings MUST be added to `popup/locales.js` for ALL 5 languages (en, ru, de, es, zh). HTML uses `data-i18n="key.path"` with English fallback; JS uses `i18n.get('key.path')`. Check completeness: every locale needs the same key set (EN strings in `en`, translations in the rest).
- Commits: conventional prefixes (`feat:`, `fix:`, `docs:`, `chore:`); messages often in Russian.

## Runtime/Tooling Preferences

- Pure classic scripts — do NOT convert to ES modules; `background.js` uses `importScripts('alarmManager.js')`.
- No npm, no bundler, no transpiler; files load directly in Chrome.
- Notification icon path `'../icons/icon48.png'` is relative to the service worker — leave as-is. Verify `chrome.notifications.create` promise support for the target Chrome version before chaining `.catch()`; the callback form is always safe.

## Testing & QA

- Zero automated tests, zero CI, zero test framework. The CommonJS guards in `lib/` and `background/alarmManager.js` exist for future Node testing but no harness consumes them.
- Test-eligible pure logic (no `chrome.*`): `Settings.calculateScheduledTime`, `AlarmManager.calculateScheduledTime`, `AlarmManager.formatCountdown`.
- Manual QA matrix: `PLAN.md` «Приоритет 2» (presets, all 5 languages, sounds, navigation/counters); «Приоритет 4.2» = pre-publish browser matrix (Chrome, Brave, Edge). All items unchecked.

## Pitfalls

- Preset logic divergence (see above) — three-way edit required.
- `popup.js` is a 1600+ line monolith with its own `DEFAULT_SETTINGS` — grep before editing.
- Extension name in manifest is "OneClick Snooze"; popup header shows "🦉 OneClick Snooze" + `Free` badge.
- Docs: `PLAN.md` and `КОНКУРЕНТЫ.md` in Russian; `PRIVACY.md` and this file in English.
