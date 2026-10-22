// Restore queue stagger: spread same-slot snoozes apart when they restore
// RESTORE_QUEUE_GAP_MS must match RESTORE_GAP_MS in background/background.js
const RESTORE_QUEUE_GAP_MS = 5000;

function staggerScheduledTime(baseTime, existingTabs, excludeId = null) {
  let nextIndex = 0;
  for (const t of existingTabs || []) {
    if (t.status !== 'active' || t.id === excludeId || t.isCurrentTab) continue;
    if (typeof t.scheduledTime !== 'number') continue;
    const delta = t.scheduledTime - baseTime;
    // Same slot = exact base time or an earlier queue position (whole multiples of the gap)
    if (delta >= 0 && delta % RESTORE_QUEUE_GAP_MS === 0) {
      const index = delta / RESTORE_QUEUE_GAP_MS;
      if (index >= nextIndex) nextIndex = index + 1;
    }
  }
  return baseTime + nextIndex * RESTORE_QUEUE_GAP_MS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { staggerScheduledTime, RESTORE_QUEUE_GAP_MS };
}
