import { W, H, PLAYER_SPEED, PLAYER_FIRE_RATE, BULLET_SPEED } from './config.js';
import { isDown } from './input.js';

export function create() {
  return {
    x: W / 2, y: H - 80,
    vx: 0, vy: 0,
    w: 28, h: 32,
    alive: true,
    fireTimer: 0,
    shield: 0,
    rapidFire: 0,
    spreadShot: 0,
    invuln: 0,
    thruster: 0,
  };
}

export function update(p, dt) {
  if (!p.alive) return;
  p.vx = 0; p.vy = 0;
  if (isDown('ArrowLeft') || isDown('KeyA')) p.vx = -PLAYER_SPEED;
  if (isDown('ArrowRight') || isDown('KeyD')) p.vx = PLAYER_SPEED;
  if (isDown('ArrowUp') || isDown('KeyW')) p.vy = -PLAYER_SPEED;
  if (isDown('ArrowDown') || isDown('KeyS')) p.vy = PLAYER_SPEED;

  const mag = Math.hypot(p.vx, p.vy);
  if (mag > PLAYER_SPEED) { p.vx = p.vx / mag * PLAYER_SPEED; p.vy = p.vy / mag * PLAYER_SPEED; }

  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.x = Math.max(p.w / 2, Math.min(W - p.w / 2, p.x));
  p.y = Math.max(p.h / 2, Math.min(H - p.h / 2, p.y));

  p.fireTimer -= dt;
  if (p.shield > 0) p.shield -= dt;
  if (p.rapidFire > 0) p.rapidFire -= dt;
  if (p.spreadShot > 0) p.spreadShot -= dt;
  if (p.invuln > 0) p.invuln -= dt;
  p.thruster += dt * 12;
}

export function canFire(p) {
  const rate = p.rapidFire > 0 ? PLAYER_FIRE_RATE * 0.35 : PLAYER_FIRE_RATE;
  if (p.fireTimer <= 0) { p.fireTimer = rate; return true; }
  return false;
}

export function hit(p) {
  if (p.invuln > 0) return false;
  if (p.shield > 0) { p.shield = 0; p.invuln = 0.5; return false; }
  p.alive = false;
  return true;
}

export function activatePowerup(p, type) {
  if (type === 'shield') p.shield = 8000;
  if (type === 'rapid') p.rapidFire = 6000;
  if (type === 'spread') p.spreadShot = 7000;
  if (type === 'heal') return 'heal';
  if (type === 'bomb') return 'bomb';
  return null;
}