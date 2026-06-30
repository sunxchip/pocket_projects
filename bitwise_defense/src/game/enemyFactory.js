let nextId = 1;

const DISPLAY_FORMATS = ['dec', 'hex', 'bin'];

// Bit width grows with level: 8-bit until level 8, then 16-bit. Kept low
// for a long time so beginners only ever deal with small, readable numbers.
export function bitsForLevel(level) {
  return level >= 8 ? 16 : 8;
}

// Enemy values are capped well below the full bit range (especially early
// on) so the numbers stay small and a single operation can usually zero
// them out. Range widens slowly as the level increases.
export function createEnemy(level, laneX) {
  const bits = bitsForLevel(level);
  const fullRange = (1 << bits) - 1;
  const rangeCap = Math.min(fullRange, 15 + level * 12);
  const value = 1 + Math.floor(Math.random() * rangeCap);
  return {
    id: nextId++,
    value,
    bits,
    displayFormat: DISPLAY_FORMATS[Math.floor(Math.random() * DISPLAY_FORMATS.length)],
    x: laneX,
    y: -40,
  };
}

export function speedForLevel(level) {
  // px per second — slow start, gentle ramp, lower cap than before so
  // there's always enough time to think.
  return Math.min(10 + level * 4, 45);
}

export function spawnIntervalForLevel(level) {
  // Plenty of breathing room between spawns, never drops below 1.8s.
  return Math.max(3600 - level * 120, 1800);
}
