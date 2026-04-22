// ═════════════════════════════════════════════════════════════
// INPUT CONTROLS - Keyboard handling
// ═════════════════════════════════════════════════════════════

import { setMoveF, setMoveB, setMoveL, setMoveR } from './three-setup.js';

export function setupKeys(gameActiveGetter, interactDoorCallback) {
  document.addEventListener('keydown', e => {
    if (!gameActiveGetter()) return;
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': setMoveF(true); break;
      case 'KeyS': case 'ArrowDown': setMoveB(true); break;
      case 'KeyA': case 'ArrowLeft': setMoveL(true); break;
      case 'KeyD': case 'ArrowRight': setMoveR(true); break;
      case 'KeyE': interactDoorCallback(); break;
    }
  });

  document.addEventListener('keyup', e => {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': setMoveF(false); break;
      case 'KeyS': case 'ArrowDown': setMoveB(false); break;
      case 'KeyA': case 'ArrowLeft': setMoveL(false); break;
      case 'KeyD': case 'ArrowRight': setMoveR(false); break;
    }
  });
}
