export const W = 960;
export const H = 640;
export const BG = '#050510';
export const STAR_COUNT = 120;
export const PLAYER_SPEED = 380;
export const PLAYER_FIRE_RATE = 0.14;
export const BULLET_SPEED = 640;
export const ENEMY_TYPES = {
  drifter:  { hp: 1, speed: 80, score: 100, color: '#ff4466', size: 12, shape: 'diamond' },
  hunter:   { hp: 2, speed: 140, score: 200, color: '#ff8800', size: 14, shape: 'triangle' },
  tank:     { hp: 4, speed: 50, score: 400, color: '#cc44ff', size: 20, shape: 'hexagon' },
  swarmer:  { hp: 1, speed: 200, score: 150, color: '#44ff88', size: 9, shape: 'circle' },
  boss:     { hp: 30, speed: 30, score: 5000, color: '#ffcc00', size: 40, shape: 'octagon' },
};
export const POWERUP_TYPES = {
  shield:  { color: '#44ddff', symbol: 'S', duration: 8000 },
  rapid:   { color: '#ffdd44', symbol: 'R', duration: 6000 },
  spread:  { color: '#ff44dd', symbol: 'W', duration: 7000 },
  heal:    { color: '#44ff44', symbol: '+', duration: 0 },
  bomb:    { color: '#ff4444', symbol: 'B', duration: 0 },
};
export const WAVE_INTERVAL = 18;
export const MAX_LIVES = 5;
export const PARTICLE_COUNT = 24;