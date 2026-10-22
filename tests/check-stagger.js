#!/usr/bin/env node
// Pure-logic checks for the restore queue: same-slot stagger + due-tab selection
const { staggerScheduledTime, RESTORE_QUEUE_GAP_MS } = require('../lib/queueStagger.js');
const AlarmManager = require('../background/alarmManager.js');

let failed = 0;

function check(name, actual, expected) {
  if (actual === expected) {
    console.log(`ok   ${name}`);
  } else {
    failed++;
    console.error(`FAIL ${name}: expected ${expected}, got ${actual}`);
  }
}

const T = 1700000000000; // fixed slot base (whole seconds, like preset times)
const G = RESTORE_QUEUE_GAP_MS;

const active = (id, scheduledTime, extra = {}) =>
  ({ id, scheduledTime, status: 'active', ...extra });

// ── staggerScheduledTime ──
check('first tab in slot keeps base time', staggerScheduledTime(T, []), T);
check('second tab +1 gap', staggerScheduledTime(T, [active('a', T)]), T + G);
check('third tab +2 gaps', staggerScheduledTime(T, [active('a', T), active('b', T + G)]), T + 2 * G);
check(
  'queue continues past existing offsets',
  staggerScheduledTime(T, [active('a', T), active('b', T + G), active('c', T + 2 * G)]),
  T + 3 * G
);
check('edited tab excluded by id', staggerScheduledTime(T, [active('a', T)], 'a'), T);
check('isCurrentTab temp entries skipped', staggerScheduledTime(T, [active('tmp', T, { isCurrentTab: true })]), T);
check('expired tabs skipped', staggerScheduledTime(T, [{ id: 'x', scheduledTime: T, status: 'expired' }]), T);
check('other slots untouched', staggerScheduledTime(T + 3600000, [active('a', T)]), T + 3600000);
check('legacy non-multiple offset ignored', staggerScheduledTime(T, [active('a', T + 2300)]), T);
check('relative preset click spread not stacked', staggerScheduledTime(T, [active('a', T + 800)]), T);
check('null existing list tolerated', staggerScheduledTime(T, null), T);

// ── AlarmManager.selectNextDueTab ──
check('no tabs → null', AlarmManager.selectNextDueTab([], T), null);
check('null list → null', AlarmManager.selectNextDueTab(null, T), null);
check('future tab not due', AlarmManager.selectNextDueTab([active('a', T + 1)], T), null);
check('expired tab not selected', AlarmManager.selectNextDueTab([{ id: 'a', scheduledTime: T, status: 'expired' }], T), null);

const mixed = [active('late', T + 10), active('early', T), active('mid', T + 5)];
check('earliest due tab selected', AlarmManager.selectNextDueTab(mixed, T + 10).id, 'early');

// ── AlarmManager.countDueTabs ──
check('due count at base time', AlarmManager.countDueTabs(mixed, T), 1);
check('due count excludes restored id', AlarmManager.countDueTabs(mixed, T + 10, 'early'), 2);
check('due count ignores future tabs', AlarmManager.countDueTabs(mixed, T - 1), 0);

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nAll restore-queue checks passed');
