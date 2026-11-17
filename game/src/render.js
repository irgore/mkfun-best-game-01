let ctx = null;

export function init(c) {
  ctx = c;
  ctx.imageSmoothingEnabled = false;
}

export function clear() {
  const c = ctx;
  c.fillStyle = '#050510';
  c.fillRect(0, 0, 960, 640);
}

export function drawStars(stars) {
  const c = ctx;
  for (const s of stars) {
    c.globalAlpha = s.alpha;
    c.fillStyle = s.color;
    c.fillRect(s.x, s.y, s.size, s.size);
  }
  c.globalAlpha = 1;
}

export function drawPlayer(p, shieldActive, spreadActive, rapidActive) {
  const c = ctx;
  if (!p || !p.alive) return;
  c.save();
  c.translate(p.x, p.y);

  // Thruster flame
  const flicker = Math.sin(p.thruster) * 4;
  c.fillStyle = '#ff8844';
  c.beginPath();
  c.moveTo(-10, 14 + flicker);
  c.lineTo(0, 24 + Math.abs(flicker) * 1.5);
  c.lineTo(10, 14 + flicker);
  c.fill();
  c.fillStyle = '#ffcc66';
  c.beginPath();
  c.moveTo(-6, 14 + flicker * 0.5);
  c.lineTo(0, 20 + Math.abs(flicker));
  c.lineTo(6, 14 + flicker * 0.5);
  c.fill();

  // Body
  c.strokeStyle = '#44ddff';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(0, -16);
  c.lineTo(-14, 12);
  c.lineTo(-4, 8);
  c.lineTo(-4, 14);
  c.lineTo(4, 14);
  c.lineTo(4, 8);
  c.lineTo(14, 12);
  c.closePath();
  c.stroke();
  c.fillStyle = 'rgba(68, 221, 255, 0.3)';
  c.fill();

  // Cockpit glow
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.arc(0, -4, 3, 0, Math.PI * 2);
  c.fill();

  // Shield
  if (shieldActive) {
    c.strokeStyle = '#44ddff';
    c.lineWidth = 1.5;
    c.globalAlpha = 0.6 + Math.sin(Date.now() * 0.01) * 0.3;
    c.beginPath();
    c.arc(0, 0, 22, 0, Math.PI * 2);
    c.stroke();
    c.globalAlpha = 1;
  }

  // Powerup indicators
  if (spreadActive) {
    c.fillStyle = '#ff44dd';
    c.beginPath();
    c.arc(-18, 0, 3, 0, Math.PI * 2);
    c.fill();
  }
  if (rapidActive) {
    c.fillStyle = '#ffdd44';
    c.beginPath();
    c.arc(18, 0, 3, 0, Math.PI * 2);
    c.fill();
  }

  c.restore();
}

export function drawEnemy(e) {
  const c = ctx;
  c.save();
  c.translate(e.x, e.y);

  const hpRatio = e.hp / (e.type === 'boss' ? 20 : e.type === 'tank' ? 8 : 2);

  // Draw shape
  if (e.shape === 'diamond') {
    c.rotate(Math.PI / 4);
    c.fillStyle = e.color;
    c.fillRect(-e.size, -e.size, e.size * 2, e.size * 2);
    c.strokeStyle = '#fff';
    c.lineWidth = 1;
    c.strokeRect(-e.size, -e.size, e.size * 2, e.size * 2);
  } else if (e.shape === 'triangle') {
    c.fillStyle = e.color;
    c.beginPath();
    c.moveTo(0, -e.size);
    c.lineTo(-e.size, e.size);
    c.lineTo(e.size, e.size);
    c.closePath();
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth = 1;
    c.stroke();
  } else if (e.shape === 'hexagon' || e.shape === 'octagon') {
    const sides = e.shape === 'hexagon' ? 6 : 8;
    c.fillStyle = e.color;
    c.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const r = e.size;
      i === 0 ? c.moveTo(Math.cos(a) * r, Math.sin(a) * r) : c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    c.closePath();
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth = 1.5;
    c.stroke();
  } else {
    c.fillStyle = e.color;
    c.beginPath();
    c.arc(0, 0, e.size, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth = 1;
    c.stroke();
  }

  // HP bar for tank/boss
  if (e.hp > 4) {
    c.fillStyle = 'rgba(0,0,0,0.6)';
    c.fillRect(-e.size, -e.size - 8, e.size * 2, 4);
    c.fillStyle = hpRatio > 0.5 ? '#44ff44' : hpRatio > 0.25 ? '#ffaa00' : '#ff3333';
    c.fillRect(-e.size, -e.size - 8, e.size * 2 * hpRatio, 4);
  }

  c.restore();
}

export function drawBullet(b) {
  const c = ctx;
  c.fillStyle = b.friendly ? '#ffffff' : '#ff6666';
  c.beginPath();
  c.arc(b.x, b.y, b.friendly ? 2.5 : 2, 0, Math.PI * 2);
  c.fill();
  if (b.friendly) {
    c.fillStyle = 'rgba(255,255,255,0.4)';
    c.beginPath();
    c.arc(b.x, b.y, 5, 0, Math.PI * 2);
    c.fill();
  }
}

export function drawPowerup(p) {
  const c = ctx;
  const pulse = 1 + Math.sin(p.pulse) * 0.15;
  c.save();
  c.translate(p.x, p.y);
  c.scale(pulse, pulse);
  c.fillStyle = 'rgba(0,0,0,0.5)';
  c.beginPath();
  c.arc(0, 0, 14, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = p.type === 'shield' ? '#44ddff' : p.type === 'rapid' ? '#ffdd44' : p.type === 'spread' ? '#ff44dd' : p.type === 'heal' ? '#44ff44' : '#ff4444';
  c.lineWidth = 2;
  c.beginPath();
  c.arc(0, 0, 12, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = '#fff';
  c.font = 'bold 12px monospace';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  const symbols = { shield: 'S', rapid: '⚡', spread: 'W', heal: '+', bomb: '💣' };
  c.fillText(symbols[p.type] || '?', 0, 0);
  c.restore();
}

export function drawParticle(p) {
  const c = ctx;
  c.globalAlpha = Math.max(0, p.life / p.maxLife);
  c.fillStyle = p.color;
  c.beginPath();
  c.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
  c.fill();
  c.globalAlpha = 1;
}