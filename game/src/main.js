import { W, H, ENEMY_TYPES, POWERUP_TYPES, MAX_LIVES, WAVE_INTERVAL } from './config.js';
import * as Input from './input.js';
import * as Player from './player.js';
import * as Enemies from './enemies.js';
import * as Bullets from './bullets.js';
import * as Powerups from './powerups.js';
import * as Particles from './particles.js';
import * as Render from './render.js';
import * as HUD from './hud.js';
import * as Audio from './audio.js';
import { seededRandom } from './random.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;

Render.init(ctx);
Input.init();
Audio.init();

// Stars
const stars = [];
for (let i = 0; i < 120; i++) {
  stars.push({
    x: Math.random() * W, y: Math.random() * H,
    size: 0.5 + Math.random() * 2,
    alpha: 0.3 + Math.random() * 0.7,
    color: Math.random() < 0.1 ? '#44ddff' : Math.random() < 0.2 ? '#aaccff' : '#556688',
    vy: 20 + Math.random() * 40,
  });
}

// State
let state = 'title';
let score = 0, lives = MAX_LIVES, wave = 0;
let combo = 1, comboText = '', comboTimer = 0, killsInWindow = 0;
let waveTimer = 0;
let highScore = 0;
let lastTime = 0;
let timeSinceDeath = 0;
let inputEnabled = true;
// Pre-initialize for title screen render
let player = null, enemies = [], bullets = [], powerups = [], particles = [];
const rng = seededRandom;

function startGame() {
  state = 'playing';
  player = Player.create();
  enemies = Enemies.createEnemies();
  bullets = Bullets.createBullets();
  powerups = Powerups.createPowerups();
  particles = Particles.createParticles();
  score = 0;
  lives = MAX_LIVES;
  wave = 0;
  combo = 1;
  comboText = '';
  comboTimer = 0;
  killsInWindow = 0;
  waveTimer = 0;
  timeSinceDeath = 0;
  inputEnabled = true;
  Enemies.spawn(enemies, wave, rng);
}

function updateComboTimer(dt) {
  if (comboTimer > 0) {
    comboTimer -= dt;
    if (comboTimer <= 0) { combo = 1; comboText = ''; killsInWindow = 0; }
  }
}

function update(dt) {
  updateComboTimer(dt);

  // Stars
  for (const s of stars) {
    s.y += s.vy * dt;
    if (s.y > H) { s.y = -2; s.x = Math.random() * W; }
  }

  if (!player.alive) {
    timeSinceDeath += dt;
    Particles.update(particles, dt);
    Enemies.update(enemies, player, dt, lastTime);
    return;
  }

  // Input
  const firing = Input.isDown('Space');
  if (firing && Player.canFire(player)) {
    if (player.spreadShot > 0) {
      for (const a of [-0.15, 0, 0.15]) Bullets.fire(bullets, player.x, player.y - 16, -Math.PI / 2 + a, true);
    } else {
      Bullets.fire(bullets, player.x, player.y - 16, -Math.PI / 2, true);
    }
    Audio.sfxShoot();
  }

  Player.update(player, dt);
  Enemies.update(enemies, player, dt, lastTime);
  Enemies.tryFire(enemies, bullets, player);
  Bullets.update(bullets, dt);
  Powerups.update(powerups, dt);
  Particles.update(particles, dt);

  // Player bullets hit enemies
  const playerBullets = bullets.filter(b => b.friendly);
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    const b = playerBullets[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (Enemies.checkCollision(e, b)) {
        e.hp--;
        b.life = 0;
        if (e.hp <= 0) {
          e.alive = false;
          Particles.burst(particles, e.x, e.y, 14, e.color, 0.2, 0.6, 200);
          Audio.sfxExplosion();
          const def = ENEMY_TYPES[e.type];
          score += def.score * combo;
          killsInWindow++;
          if (killsInWindow >= 3) comboText = 'KILLING SPREE';
          if (killsInWindow >= 6) comboText = 'DOMINATING';
          if (killsInWindow >= 10) comboText = 'UNSTOPPABLE';
          if (killsInWindow >= 15) comboText = 'GODLIKE';
          combo = 1 + Math.floor(killsInWindow / 3);
          comboTimer = 2.5;
          const pu = Powerups.maybeDrop(e.x, e.y);
          if (pu) powerups.push(pu);
        } else {
          Particles.burst(particles, b.x, b.y, 4, '#ffffff', 0.1, 0.3, 80);
          Audio.sfxHit();
        }
        break;
      }
    }
  }

  // Enemy bullets hit player
  for (const b of bullets) {
    if (b.friendly) continue;
    if (Math.hypot(b.x - player.x, b.y - player.y) < player.w / 2 + 4) {
      b.life = 0;
      if (Player.hit(player)) {
        lives--;
        Particles.burst(particles, player.x, player.y, 40, '#ff4466', 0.3, 0.9, 300);
        Audio.sfxDie();
      }
    }
  }

  // Enemy-player collision
  for (const e of enemies) {
    if (!e.alive) continue;
    if (Math.hypot(player.x - e.x, player.y - e.y) < player.w / 2 + e.size) {
      if (Player.hit(player)) {
        lives--;
        e.alive = false;
        Particles.burst(particles, player.x, player.y, 40, '#ff4466', 0.3, 0.9, 300);
      }
    }
  }

  // Dead
  if (lives <= 0) player.alive = false;
  enemies = enemies.filter(e => e.alive);

  // Wave completion
  if (enemies.length === 0 && player.alive) {
    waveTimer += dt;
    if (waveTimer >= WAVE_INTERVAL) {
      wave++;
      waveTimer = 0;
      Enemies.spawn(enemies, wave, rng);
      Audio.sfxWave();
    }
  }

  // Powerup spawns
  if (player.alive) Powerups.maybeSpawn(powerups, rng);

  // Powerup collection
  for (let i = powerups.length - 1; i >= 0; i--) {
    if (Powerups.checkGrab(player, powerups[i])) {
      const result = Player.activatePowerup(player, powerups[i].type);
      if (result === 'heal') lives = Math.min(MAX_LIVES, lives + 1);
      if (result === 'bomb') {
        for (const e of enemies) {
          e.alive = false;
          Particles.burst(particles, e.x, e.y, 18, '#ff4444', 0.2, 0.6, 200);
          score += ENEMY_TYPES[e.type] ? ENEMY_TYPES[e.type].score : 5000;
        }
        enemies = [];
        Audio.sfxBomb();
      }
      Particles.burst(particles, powerups[i].x, powerups[i].y, 10, POWERUP_TYPES[powerups[i].type].color, 0.15, 0.4, 120);
      Audio.sfxPowerup();
      powerups.splice(i, 1);
    }
  }

  if (!player.alive) {
    timeSinceDeath = 0;
    Audio.sfxGameOver();
    if (score > highScore) highScore = score;
  }
}

function render() {
  Render.clear();
  Render.drawStars(stars);
  for (const p of particles) Render.drawParticle(p);
  for (const b of bullets) Render.drawBullet(b);
  for (const p of powerups) Render.drawPowerup(p);
  for (const e of enemies) Render.drawEnemy(e);
  Render.drawPlayer(player, player && player.shield > 0, player && player.spreadShot > 0, player && player.rapidFire > 0);

  if (state === 'title') {
    HUD.drawTitleScreen(ctx, highScore);
  } else if (state === 'playing' || state === 'dying') {
    HUD.drawHUD(ctx, score, lives, wave, combo, comboText,
      player && player.shield > 0, player && player.spreadShot > 0, player && player.rapidFire > 0);
  } else if (state === 'gameover') {
    const isNew = score >= highScore && score > 0;
    HUD.drawGameOver(ctx, score, highScore, isNew, wave);
  }
}

function gameLoop(ts) {
  const now = ts / 1000;
  if (lastTime === 0) lastTime = now;
  let dt = now - lastTime;
  lastTime = now;
  if (dt > 0.1) dt = 0.1;

  canvas.width = W;
  canvas.height = H;

  if (state === 'title') {
    render();
    if (Input.anyKey()) { Audio.resume(); startGame(); }
  } else if (state === 'playing') {
    update(dt);
    render();
    if (!player.alive) { state = 'dying'; timeSinceDeath = 0; }
  } else if (state === 'dying') {
    update(dt);
    render();
    if (timeSinceDeath > 2.5) state = 'gameover';
  } else if (state === 'gameover') {
    render();
    if (Input.anyKey() && timeSinceDeath > 3) startGame();
  }

  Input.clearFrame();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);