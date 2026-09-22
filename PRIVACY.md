# Privacy Policy — OneClick Snooze

**Effective date:** August 2026

OneClick Snooze ("the extension") is designed to snooze browser tabs: close them now and reopen them at a scheduled time.

## Data collection

**The extension does not collect, transmit, or share any personal data.**

All data the extension works with is stored **locally on your device** using the browser's `chrome.storage.local` API:

- The list of snoozed tabs (URL, title, scheduled time, status) — used only to restore your tabs at the scheduled time.
- Your preferences (presets, sound on/off, theme, language) — used only to configure the extension for you.

## Permissions

The extension requests the minimum permissions required for its single purpose (tab snoozing):

- `tabs` — to close the tab you snooze and reopen it later.
- `alarms` — to schedule the exact time a tab comes back.
- `storage` — to save your snoozed tabs and settings locally.
- `notifications` — to let you know when a snoozed tab has been restored.
- `offscreen` — to play an audio notification (restore sound) when a tab comes back. Service workers cannot play audio in MV3; an offscreen document is the only available mechanism. No data is collected or transmitted.
- Host access (`<all_urls>`) — so you can snooze any tab, regardless of the website. The extension never reads page content.

## Third parties

The extension does not use third-party analytics, trackers, advertising, or any external services. No data leaves your device.

## Contact

If you have questions about this privacy policy, please open an issue at:
https://github.com/zaharenok/oneclick-snooze/issues
