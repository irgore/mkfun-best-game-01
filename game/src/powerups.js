import { W, H, POWERUP_TYPES } from './config.js';

export function createPowerups() { return []; }

export function maybeDrop(x, y) {
  if (Math.random() > 0.12) return null;
  const types = Object.keys(POWERUP_TYPES);
  const t = types[Math.floor(Math.random() * types.length)];
  return { x, y, type: t, life: 12, vy: 30 + Math.random() * 40, pulse: 0 };
}

export function update(powerups, dt) {
  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.y += p.vy * dt;
    p.life -= dt;
    p.pulse += dt * 6;
    if (p.y > H + 30 || p.life <= 0) powerups.splice(i, 1);
  }
}

export function maybeSpawn(powerups, rng) {
  if (powerups.length > 5) return;
  if (Math.random() < 0.003) {
    const types = Object.keys(POWERUP_TYPES);
    const t = types[Math.floor(Math.random() * types.length)];
    powerups.push({
      x: 30 + Math.random() * (W - 60), y: -20,
      type: t, life: 15, vy: 50 + Math.random() * 30, pulse: 0
    });
  }
}

export function checkGrab(player, pu) {
  return Math.hypot(player.x - pu.x, player.y - pu.y) < player.w / 2 + 16;
}