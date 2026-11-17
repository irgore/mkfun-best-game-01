import { W, H, BULLET_SPEED } from './config.js';

export function createBullets() { return []; }

export function fire(bullets, x, y, angle, friendly) {
  bullets.push({ x, y, vx: Math.cos(angle) * BULLET_SPEED, vy: Math.sin(angle) * BULLET_SPEED, friendly, life: 2 });
}

export function fireSpread(bullets, x, y, angles, friendly) {
  for (const a of angles) fire(bullets, x, y, a, friendly);
}

export function update(bullets, dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20 || b.life <= 0) {
      bullets.splice(i, 1);
    }
  }
}