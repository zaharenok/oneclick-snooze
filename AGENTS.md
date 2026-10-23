# Repository Guidelines

## Project Overview

OneClick Snooze — Chrome MV3 extension that snoozes tabs (close now, reopen later) with one click. Vanilla JS: no framework, no build system, no `package.json`, no dependencies, no CI. UI localized via Chrome's official `_locales` + `chrome.i18n` in 17 languages. GitHub: https://github.com/zaharenok/oneclick-snooze (branch `main`).

## Architecture & Data Flow

```
popup.js (UI controller) ──► chrome.storage.local ──► chrome.alarms ──► background.js
        │                        'snoozedTabs'           'snooze_{id}'       service worker
        └───────────────────────── 'settings' ──────────────────────┘

i18n (hybrid): popup + background load _locales/<lang>/messages.json directly (lib/messages.js).
Locale = stored 'locale' choice (in-app switcher in Settings) else browser UI locale, default "en".
manifest still uses __MSG_*__ + default_locale "en" (official, CWS-compatible).
```

1. Popup: user clicks preset → `calculateScheduledTime(preset)` → `staggerScheduledTime()` assigns a same-slot queue offset (`+5 s` per active tab already targeting that time; «Tomorrow», «Weekends», custom date) → tabData pushed to `snoozedTabs` → `chrome.alarms.create('snooze_{id}')` → `chrome.tabs.remove()`. Relative presets («через 1/3/6 ч») keep natural click-time spread.
2. Background: `onAlarm` (`snooze_*` and `catchup`) and `onStartup` all funnel into `restoreOverdueTabs()`, which drains due tabs one-by-one in `scheduledTime` order with `RESTORE_GAP_MS` (5 s) between restores — simultaneous alarms («Tomorrow 09:00», «Weekends») open as a queue, not a burst. Per tab: mark `status: 'expired'` + `completedAt` in storage first, then `chrome.tabs.create(url)`, notification (alarm-driven only), restore sound.
3. Auto Snooze (v1.5.0, `settings.autoMode.enabled`): a periodic `automode` alarm (15 min) runs `runAutoModeCheck()` → pure `AlarmManager.selectTabsForAutoSnooze(tabs, cfg, now)` (tab cap + inactivity via `tabs.Tab.lastAccessed`; never touches active/pinned/audible/`chrome://` tabs) → the same snooze pipeline as manual (persist → alarm → `tabs.remove`), staggered via `staggerScheduledTime`. Popup re-arms/clears the alarm by sending `{type:'settingsUpdated'}` after `saveSettings()`; `onInstalled`/`onStartup` also re-arm it. Optional desktop notification: `notif_autoSnoozed1`/`notif_autoSnoozedN`. The Dashboard shows a status strip (`#auto-strip`, `renderAutoStrip()` in v1.5.2): ON → rules summary + next check time from the live alarm, OFF → invite; tapping it opens the Auto Snooze settings modal.

### Known duplication (deliberate, be careful)

- `calculateScheduledTime` exists in THREE places: `popup/popup.js`, `lib/settings.js`, `background/alarmManager.js`. They already diverge (alarmManager hardcodes 21:00/09:00/09:00 and throws on unknown preset; popup reads configurable `currentSettings.presets` and returns null). Changing a preset means editing all three.
- `DEFAULT_SETTINGS` defined in `popup/popup.js` (twice: `loadSettings` + an inline copy in `resetSettings`; popup's has `soundEnabled`) and `lib/settings.js` (no `soundEnabled`). All copies carry `autoMode` (v1.5.0+) and every settings reader deep-merges `autoMode` on top of defaults.
- `formatCountdown` duplicated in `popup/popup.js` and `alarmManager.js`.

## Key Directories

| Path | Purpose |
|---|---|
| `background/` | `background.js` (service worker: alarm listener, startup catch-up) + `alarmManager.js` (classic scripts only, joined via `importScripts`) |
| `popup/` | `popup.html` (loads `../lib/messages.js` → `locales.js` → `sounds.js` → `../lib/queueStagger.js` → `popup.js`, in that order), `popup.css`, `popup.js` (~1600-line monolith: ALL UI logic), `locales.js` (`I18n` wrapper over `lib/messages.js`: loads chosen `messages.json`, `setLocale()` persists to `chrome.storage.local` 'locale', `get(key, subs)` maps dotted→underscore + `$n`, `updateUI()` applies `data-i18n`), `sounds.js` (`SoundManager`, file-based audio: snooze (click) and restore (pop)) |
| `lib/` | `messages.js` — shared i18n core (`messagesResolveLocale`, `messagesSub`, `messagesLoad`, `MESSAGES_*`); loaded by popup via `<script>` and background via `importScripts`. `storage.js`, `settings.js` — `Storage`/`Settings` classes, unused at runtime. `queueStagger.js` — pure `staggerScheduledTime()` + `RESTORE_QUEUE_GAP_MS`, loaded by popup via `<script src="../lib/queueStagger.js">`. All lib files keep CommonJS guards (`if (typeof module !== 'undefined')`) for Node tests. |
| `icons/` | Production PNGs 16/32/48/128 referenced by manifest. `icons/concepts/` = design exploration (SVG+PNG) — NEVER reference from manifest. |
| `_locales/` | `<code>/messages.json` for 17 Chrome locales (en, ru, de, es, zh_CN, uk, fr, pt_BR, it, pl, tr, ja, zh_TW, ko, nl, vi, id). `en` is the source of truth (carries `description` fields); other locales carry `message` only. |

## Important Files

- `manifest.json` — MV3; permissions `alarms`, `storage`, `tabs`, `notifications`, `offscreen`; `host_permissions: <all_urls>`; service worker `background/background.js`; popup `popup/popup.html`. `default_locale: "en"`; name/description/action title use `__MSG_*__` refs into `_locales`.
- `popup/popup.js` — entry point for all behavior; has its own `DEFAULT_SETTINGS` copy — grep before editing.
- `popup/locales.js` — `I18n` wrapper over `lib/messages.js`; global `const i18n = new I18n()`. `i18n.get('nav.dashboard')` maps dotted→underscore (`nav_dashboard`) and forwards `$n` subs; `i18n.updateUI()` applies `data-i18n`; `i18n.setLocale(code)` persists to `chrome.storage.local` 'locale' + reloads messages. Language = stored choice else browser UI locale.
- `lib/messages.js` — shared locale core used by popup and background: `messagesResolveLocale(uiLang, stored)` (stored > browser > alias > en), `messagesSub(template, subs)` (`$1..$9`), `messagesLoad(code)` (fetch `_locales/<code>/messages.json` with en fallback). CommonJS-exported for `tests/check-locales.js`.
- `PLAN.md` (Russian) — dev plan; next-session tasks in «Приоритет 1». `КОНКУРЕНТЫ.md` — competitor research. `PRIVACY.md` — store privacy policy.
- `offscreen/` — offscreen document (`AUDIO_PLAYBACK`) that plays the restore sound when a tab restores while the popup is closed.

### Storage schema

- `snoozedTabs` (array): `{ id (base36 timestamp+random), tabId, url, title, favicon, scheduledTime (epoch ms; may carry a +5 s queue offset for same-slot snoozes), createdTime, preset, presetLabel, status: 'active'|'expired', completedAt? }`.
- `settings`: `{ presets: [{id, label, icon, hour, minute, enabled}], showCompleted, completedDuration, soundEnabled, desktopNotifications?, autoMode: { enabled, maxTabs, idleHours, snoozePreset: '1h'|'3h'|'6h'|'12h'|'tomorrow'|'nextweek' } }`.
- Alarms named `snooze_{tabData.id}`; background ignores anything not prefixed `snooze_`. Plus `catchup` (5 min) and, when `autoMode.enabled`, `automode` (15 min).

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
- New UI strings MUST be added to `_locales/en/messages.json` (with a `description`) AND translated into all 16 other `_locales/<code>/messages.json`. Message names are FLAT underscores (`nav_dashboard`), never dotted. HTML uses `data-i18n="key.path"` (dot form in markup); JS uses `i18n.get('key.path')` or `i18n.get('key.path', [subs])` for `$n` placeholders. Run `node tests/check-locales.js` to verify 17-locale parity + manifest wiring + code refs + locale logic.
- Commits: conventional prefixes (`feat:`, `fix:`, `docs:`, `chore:`); messages often in Russian.

## Runtime/Tooling Preferences

- Pure classic scripts — do NOT convert to ES modules; `background.js` uses `importScripts('alarmManager.js')`.
- No npm, no bundler, no transpiler; files load directly in Chrome.
- Notification icon path `'../icons/icon48.png'` is relative to the service worker — leave as-is. Verify `chrome.notifications.create` promise support for the target Chrome version before chaining `.catch()`; the callback form is always safe.

## Testing & QA

Two automated tests, no CI, no test framework:

- `tests/check-locales.js` — validates `_locales`: all 17 locales present with exactly `en`'s key set, non-empty messages, `$n` placeholder parity, manifest `default_locale` + `__MSG_*__` refs resolve in `en`, every literal `i18n.get`/`data-i18n`/`msgs.*` key referenced in `popup.js`/`popup.html`/`background.js` exists in `en`, and pure locale logic in `lib/messages.js` (resolve precedence, alias mapping, substitution). Run: `node tests/check-locales.js`. Exit 1 on any mismatch.
- `tests/check-stagger.js` — pure-logic checks for the restore queue: `staggerScheduledTime` in `lib/queueStagger.js` (same-slot offsets, edited-tab exclusion, legacy offsets) and `AlarmManager.selectNextDueTab` / `countDueTabs` (due-filter, earliest-first). Run: `node tests/check-stagger.js`. Exit 1 on any mismatch.
- `tests/check-automode.js` — pure-logic checks for Auto Snooze: `AlarmManager.selectTabsForAutoSnooze` (cap rule, inactivity rule, active/pinned/audible/service-page exclusions, oldest-first order, unknown `lastAccessed` handling) and the relative `1h`/`3h`/`6h` presets in `AlarmManager.calculateScheduledTime`. Run: `node tests/check-automode.js`. Exit 1 on any mismatch.
- `store-listing/build.py` — validates the 17-locale Web Store listing table in `store-listing/master.py` (title ≤45, short ≤132 chars, per-locale CTA present, script sanity markers, manifest.json parses) and generates paste-ready `store-listing/out/<lang>.md`. Run: `python3 store-listing/build.py`.

The CommonJS guards in `lib/` and `background/alarmManager.js` are consumed by `tests/check-stagger.js`.
- Test-eligible pure logic (no `chrome.*`): `Settings.calculateScheduledTime`, `AlarmManager.calculateScheduledTime`, `AlarmManager.formatCountdown`, `AlarmManager.selectNextDueTab`, `AlarmManager.countDueTabs`, `AlarmManager.selectTabsForAutoSnooze`, `staggerScheduledTime` (lib/queueStagger.js).
- Manual QA matrix: `PLAN.md` «Приоритет 2» (presets, languages, sounds, navigation/counters); «Приоритет 4.2» = pre-publish browser matrix (Chrome, Brave, Edge). All items unchecked.

## Pitfalls

- Preset logic divergence (see above) — three-way edit required.
- `popup.js` is a 1600+ line monolith with its own `DEFAULT_SETTINGS` — grep before editing.
- Store/manifest name (v1.4.2+) is keyword-led per locale, e.g. en `extName` = "Tab Snooze - Save Tabs for Later & Reopen" — it MUST stay in sync with `TITLES`/`SHORTS` in `store-listing/master.py` (master keys: zh_CN→zh, zh_TW→tw, pt_BR→pt). The in-product popup keeps the hardcoded brand "🦉 OneClick Snooze" + `Free` badge by design. Rewording the CTA tails requires updating the `CTA` dict in `store-listing/build.py` too.
- Restore-queue gap lives in two places that must stay in sync: `RESTORE_GAP_MS` (background/background.js) and `RESTORE_QUEUE_GAP_MS` (lib/queueStagger.js), both 5000 ms.
- Docs: `PLAN.md` and `КОНКУРЕНТЫ.md` in Russian; `PRIVACY.md` and this file in English.
