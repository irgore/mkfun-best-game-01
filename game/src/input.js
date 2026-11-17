const keys = {};
let justPressed = {};

export function init() {
  window.addEventListener('keydown', e => {
    if (!keys[e.code]) justPressed[e.code] = true;
    keys[e.code] = true;
    e.preventDefault();
  });
  window.addEventListener('keyup', e => {
    keys[e.code] = false;
    e.preventDefault();
  });
}

export function isDown(code) { return !!keys[code]; }
export function wasPressed(code) {
  if (justPressed[code]) { justPressed[code] = false; return true; }
  return false;
}
export function clearFrame() { justPressed = {}; }
export function anyKey() { return Object.values(keys).some(Boolean); }