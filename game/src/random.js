let seed = 42;
export function seededRandom() { seed = (seed * 1664525 + 1013904223) | 0; return ((seed >>> 0) / 4294967296); }
export function reseed(s) { seed = s | 0; }
export function randomRange(min, max, rng) { return min + (rng || seededRandom)() * (max - min); }