import { W, H, ENEMY_TYPES } from './config.js';

export function createEnemies() { return []; }

export function spawn(es, wave, rng) {
  const r = rng || Math.random;
  const types = ['drifter', 'drifter', 'hunter', 'swarmer'];
  if (wave >= 3) types.push('tank');
  if (wave >= 5 && wave % 3 === 0) types.push('boss');
  const count = 4 + wave * 2;
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(r() * types.length)];
    const def = ENEMY_TYPES[type];
    const x = 40 + r() * (W - 80);
    const y = -40 - r() * 80;
    es.push({ type, x, y, hp: def.hp, speed: def.speed, color: def.color, size: def.size, shape: def.shape,
      alive: true, fireTimer: 1.5 + r() * 2.5, moveTimer: 0, moveAngle: r() * Math.PI * 2,
      phase: r() * Math.PI * 2 });
  }
}

export function update(es, player, dt, time) {
  for (let i = es.length - 1; i >= 0; i--) {
    const e = es[i];
    e.moveTimer -= dt;
    if (e.moveTimer <= 0) {
      e.moveTimer = 0.8 + Math.random() * 1.5;
      const dx = player.x - e.x, dy = player.y - e.y;
      e.moveAngle = Math.atan2(dy, dx);
    }
    const spd = e.speed + (e.type === 'tank' ? Math.sin(time * 3 + e.phase) * 40 : 0);
    e.x += Math.cos(e.moveAngle) * spd * dt;
    e.y += Math.sin(e.moveAngle) * spd * dt;
    if (e.x < -60 || e.x > W + 60 || e.y < -60 || e.y > H + 100) {
      es.splice(i, 1);
    }
  }
}

export function tryFire(e, bullets, player) {
  for (const en of e) {
    en.fireTimer -= bullets.length > 100 ? 0.03 : 0.016;
    if (en.fireTimer <= 0) {
      en.fireTimer = en.type === 'boss' ? 0.25 : 1.2 + Math.random() * 1.5;
      const angle = Math.atan2(player.y - en.y, player.x - en.x);
      if (en.type === 'boss') {
        for (let a = -0.3; a <= 0.3; a += 0.15) {
          bullets.push({ x: en.x, y: en.y, vx: Math.cos(angle + a) * 240, vy: Math.sin(angle + a) * 240, friendly: false, life: 3 });
        }
      } else {
        bullets.push({ x: en.x, y: en.y, vx: Math.cos(angle) * 200, vy: Math.sin(angle) * 200, friendly: false, life: 4 });
      }
    }
  }
}

export function checkCollision(e, b) {
  return Math.hypot(b.x - e.x, b.y - e.y) < e.size + 4;
}