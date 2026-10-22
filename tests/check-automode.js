#!/usr/bin/env node
// Pure-logic checks for Auto Snooze: tab selection rules in AlarmManager
const AlarmManager = require('../background/alarmManager.js');

let failed = 0;

function check(name, actual, expected) {
  const same = Array.isArray(actual) && Array.isArray(expected)
    ? JSON.stringify(actual) === JSON.stringify(expected)
    : actual === expected;
  if (same) {
    console.log(`ok   ${name}`);
  } else {
    failed++;
    console.error(`FAIL ${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

const NOW = 1700000000000;
const H = 3600000;

// Tab factory: ids 'a','b',… with lastAccessed = now - ageHours (or undefined)
const tab = (id, opts = {}) => ({
  id,
  url: opts.url || `https://${id}.example.com/`,
  active: !!opts.active,
  pinned: !!opts.pinned,
  audible: !!opts.audible,
  ...(opts.ageHours === undefined ? {} : { lastAccessed: NOW - opts.ageHours * H })
});

const opts = (maxTabs, idleHours) => ({ maxTabs, idleHours });

// ── Rule 2: inactivity ──
check('no idle tabs → nothing snoozed',
  AlarmManager.selectTabsForAutoSnooze([tab('a', { ageHours: 1 })], opts(10, 2), NOW), []);
check('tab idle beyond threshold snoozed',
  AlarmManager.selectTabsForAutoSnooze([tab('a', { ageHours: 3 })], opts(10, 2), NOW), ['a']);
check('tab idle exactly at threshold snoozed (>=)',
  AlarmManager.selectTabsForAutoSnooze([tab('a', { ageHours: 2 })], opts(10, 2), NOW), ['a']);
check('idle threshold 0 disables inactivity rule',
  AlarmManager.selectTabsForAutoSnooze([tab('a', { ageHours: 99 })], opts(10, 0), NOW), []);

// ── Rule 1: tab cap ──
check('at cap → nothing snoozed',
  AlarmManager.selectTabsForAutoSnooze(
    [tab('a', { ageHours: 1.5 }), tab('b', { ageHours: 1 })], opts(2, 2), NOW), []);
check('idle tabs snoozed even when at cap (rules independent)',
  AlarmManager.selectTabsForAutoSnooze(
    [tab('a', { ageHours: 9 }), tab('b', { ageHours: 8 })], opts(2, 2), NOW), ['a', 'b']);
check('overflow snoozes only oldest beyond cap',
  AlarmManager.selectTabsForAutoSnooze(
    [tab('old', { ageHours: 1.9 }), tab('mid', { ageHours: 1 }), tab('new', { ageHours: 0.5 })],
    opts(2, 2), NOW),
  ['old']);
check('overflow order is oldest first',
  AlarmManager.selectTabsForAutoSnooze(
    [tab('o1', { ageHours: 9 }), tab('o2', { ageHours: 8 }), tab('o3', { ageHours: 7 }), tab('n', { ageHours: 1 })],
    opts(2, 0), NOW),
  ['o1', 'o2']);

// ── Exclusions ──
check('active tab never snoozed',
  AlarmManager.selectTabsForAutoSnooze([tab('a', { active: true, ageHours: 99 })], opts(10, 2), NOW), []);
check('pinned tab never snoozed',
  AlarmManager.selectTabsForAutoSnooze([tab('a', { pinned: true, ageHours: 99 })], opts(10, 2), NOW), []);
check('audible tab never snoozed',
  AlarmManager.selectTabsForAutoSnooze([tab('a', { audible: true, ageHours: 99 })], opts(10, 2), NOW), []);
check('service pages never snoozed',
  AlarmManager.selectTabsForAutoSnooze(
    [tab('c', { url: 'chrome://settings/', ageHours: 99 }), tab('s', { url: 'chrome-extension://abc/popup.html', ageHours: 99 })],
    opts(10, 2), NOW), []);
check('excluded tabs do not count toward cap',
  AlarmManager.selectTabsForAutoSnooze(
    [tab('a', { active: true, ageHours: 99 }), tab('old', { ageHours: 1 })], opts(1, 2), NOW), []);

// ── Unknown lastAccessed (Chrome < 121) ──
check('unknown age never idle-snoozed',
  AlarmManager.selectTabsForAutoSnooze([tab('a')], opts(10, 2), NOW), []);
check('unknown age snoozed only by cap rule, last',
  AlarmManager.selectTabsForAutoSnooze(
    [tab('x'), tab('y'), tab('old', { ageHours: 9 })], opts(2, 0), NOW), ['old']);

// ── Combined rules dedupe ──
check('idle + cap overlap yields tab once',
  AlarmManager.selectTabsForAutoSnooze(
    [tab('o1', { ageHours: 9 }), tab('o2', { ageHours: 8 }), tab('n', { ageHours: 1 })],
    opts(2, 2), NOW),
  ['o1', 'o2']);

// ── Robustness ──
check('null tabs tolerated', AlarmManager.selectTabsForAutoSnooze(null, opts(10, 2), NOW), []);
check('maxTabs floor of 1 on bad input',
  AlarmManager.selectTabsForAutoSnooze(
    [tab('a', { ageHours: 9 }), tab('b', { ageHours: 1 })], opts(0, 0), NOW), ['a']);
check('empty list tolerated', AlarmManager.selectTabsForAutoSnooze([], opts(10, 2), NOW), []);

// ── Relative presets in calculateScheduledTime ──
const oneH = AlarmManager.calculateScheduledTime('1h');
check('1h is ~now+1h', Math.abs(oneH - (Date.now() + H)) < 5000, true);
const sixH = AlarmManager.calculateScheduledTime('6h');
check('6h is ~now+6h', Math.abs(sixH - (Date.now() + 6 * H)) < 5000, true);
check('tomorrow still 09:00 next day', (() => {
  const t = new Date(AlarmManager.calculateScheduledTime('tomorrow'));
  return t.getHours() === 9 && t.getMinutes() === 0;
})(), true);

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nAll auto-snooze checks passed');
