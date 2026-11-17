import { W, H, MAX_LIVES } from './config.js';

export function drawHUD(ctx, score, lives, wave, combo, comboText, shieldActive, spreadActive, rapidActive) {
  ctx.save();
  // Background bar
  ctx.fillStyle = 'rgba(5, 5, 16, 0.85)';
  ctx.fillRect(0, 0, W, 42);
  ctx.strokeStyle = '#222244';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 43);
  ctx.lineTo(W, 43);
  ctx.stroke();

  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.textBaseline = 'middle';

  // Score
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE ${formatNum(score)}`, 16, 21);

  // Wave
  ctx.fillStyle = '#aaccff';
  ctx.textAlign = 'center';
  ctx.fillText(`WAVE ${wave}`, W / 2, 21);

  // Combo
  if (combo > 1) {
    ctx.fillStyle = combo > 10 ? '#ffdd44' : combo > 5 ? '#ff8844' : '#aaaaaa';
    ctx.fillText(`x${combo} ${comboText || ''}`, W / 2, 42);
  }

  // Lives
  ctx.textAlign = 'right';
  for (let i = 0; i < MAX_LIVES; i++) {
    ctx.fillStyle = i < lives ? '#ff4466' : '#333355';
    ctx.fillText('♥', W - 20 - i * 22, 21);
  }

  ctx.restore();
}

export function drawTitleScreen(ctx, highScore) {
  ctx.save();
  ctx.fillStyle = 'rgba(5, 5, 16, 0.92)';
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title
  ctx.fillStyle = '#44ddff';
  ctx.font = 'bold 56px "Courier New", monospace';
  ctx.fillText('STAR RUNNER', W / 2, H / 2 - 80);

  // Subtitle
  ctx.fillStyle = '#8888cc';
  ctx.font = '16px "Courier New", monospace';
  ctx.fillText('A NEON SPACE SURVIVAL GAME', W / 2, H / 2 - 35);

  // Ship preview
  ctx.strokeStyle = '#44ddff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2, H / 2 + 5);
  ctx.lineTo(W / 2 - 14, H / 2 + 33);
  ctx.lineTo(W / 2 - 4, H / 2 + 29);
  ctx.lineTo(W / 2 - 4, H / 2 + 35);
  ctx.lineTo(W / 2 + 4, H / 2 + 35);
  ctx.lineTo(W / 2 + 4, H / 2 + 29);
  ctx.lineTo(W / 2 + 14, H / 2 + 33);
  ctx.closePath();
  ctx.stroke();

  // Controls
  ctx.fillStyle = '#6688aa';
  ctx.font = '13px "Courier New", monospace';
  ctx.fillText('ARROW KEYS / WASD — MOVE', W / 2, H / 2 + 70);
  ctx.fillText('SPACE — FIRE  |  HOLD FOR AUTO-FIRE', W / 2, H / 2 + 88);

  // Power-up guide
  ctx.fillStyle = '#5577aa';
  ctx.font = '11px "Courier New", monospace';
  ctx.fillText('S = SHIELD   ⚡ = RAPID FIRE   W = SPREAD SHOT   + = HEAL   💣 = BOMB', W / 2, H / 2 + 115);

  // High score
  if (highScore > 0) {
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillText(`BEST SCORE: ${formatNum(highScore)}`, W / 2, H / 2 + 145);
  }

  // Start prompt
  const alpha = 0.5 + Math.sin(Date.now() * 0.004) * 0.5;
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.fillText('PRESS ANY KEY TO START', W / 2, H / 2 + 180);

  ctx.restore();
}

export function drawGameOver(ctx, score, highScore, isNewHigh, wave) {
  ctx.save();
  ctx.fillStyle = 'rgba(5, 5, 16, 0.88)';
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#ff4466';
  ctx.font = 'bold 48px "Courier New", monospace';
  ctx.fillText('GAME OVER', W / 2, H / 2 - 60);

  ctx.fillStyle = '#ffffff';
  ctx.font = '20px "Courier New", monospace';
  ctx.fillText(`FINAL SCORE: ${formatNum(score)}`, W / 2, H / 2 - 10);
  ctx.fillText(`WAVE REACHED: ${wave}`, W / 2, H / 2 + 18);

  if (isNewHigh) {
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillText('★ NEW HIGH SCORE ★', W / 2, H / 2 + 55);
  } else {
    ctx.fillStyle = '#8888cc';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText(`BEST: ${formatNum(highScore)}`, W / 2, H / 2 + 55);
  }

  const alpha = 0.5 + Math.sin(Date.now() * 0.004) * 0.5;
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.fillText('PRESS ANY KEY TO PLAY AGAIN', W / 2, H / 2 + 100);

  ctx.restore();
}

function formatNum(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}