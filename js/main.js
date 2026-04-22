// ═════════════════════════════════════════════════════════════
// MAIN GAME LOGIC & FLOW
// ═════════════════════════════════════════════════════════════

import { playAmbience, playJumpscare, playCorrect, playClick } from './audio.js';
import { initThree, setupPointerLock, resetCamera, updateMovement, renderer, scene, camera } from './three-setup.js';
import { buildRoom, captureSnapshot, restoreFromSnapshot, doors, clearFlickerInterval } from './room.js';
import { applyAnomaly, getAnomalyDesc } from './anomaly.js';
import { setupKeys } from './controls.js';
import { DIFF_COUNTS } from './config.js';

// ── Game state ────────────────────────────────────────────────
let difficulty = null;
let level = 1;
let isRefRoom = true;
let hasAnomaly = false;
let gameActive = false;
let nearDoor = null;

// ── DOM refs ──────────────────────────────────────────────────
const startScreen = document.getElementById('start-screen');
const refBanner = document.getElementById('ref-banner');
const hud = document.getElementById('hud');
const levelNum = document.getElementById('level-num');
const diffBadge = document.getElementById('diff-badge');
const doorHint = document.getElementById('door-hint');
const crosshairEl = document.getElementById('crosshair');
const flash = document.getElementById('flash');
const correctFlash = document.getElementById('correct-flash');
const gameoverScreen = document.getElementById('gameover-screen');
const finalScore = document.getElementById('final-score');
const goMsg = document.getElementById('go-msg');
const goDiff = document.getElementById('go-diff');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');

// ── Difficulty UI ─────────────────────────────────────────────
document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    difficulty = btn.dataset.diff;
    startBtn.textContent = 'Enter';
    startBtn.disabled = false;
  });
});

// ═════════════════════════════════════════════════════════════
// DOOR INTERACTION
// ═════════════════════════════════════════════════════════════
function interactDoor() {
  if (!nearDoor) return;
  playClick();

  if (isRefRoom) {
    captureSnapshot();
    doFlash(correctFlash, '#ccbb44', 0.28, 260, () => {
      level++;
      levelNum.textContent = level;
      startChallengeRoom();
    });
    return;
  }

  const guessedAnomaly = (nearDoor === 'red');
  if (guessedAnomaly === hasAnomaly) handleCorrect();
  else handleWrong();
}

function handleCorrect() {
  playCorrect();
  doFlash(correctFlash, '#00ff88', 0.3, 260, () => {
    level++;
    levelNum.textContent = level;
    startChallengeRoom();
  });
}

function handleWrong() {
  playJumpscare();
  gameActive = false;
  document.exitPointerLock();

  flash.style.background = '#ff0000';
  flash.style.opacity = '1';
  setTimeout(() => {
    flash.style.transition = 'opacity 1.1s';
    flash.style.opacity = '0';
  }, 70);
  setTimeout(() => {
    flash.style.transition = '';
  }, 1250);

  setTimeout(() => {
    finalScore.textContent = Math.max(0, level - 2);
    goDiff.textContent = `Difficulty: ${difficulty.toUpperCase()} · ${DIFF_COUNTS[difficulty]} objects`;
    goMsg.textContent = hasAnomaly
      ? `There WAS an anomaly — but you missed it.\n${getAnomalyDesc()}`
      : `There was NO anomaly — but you panicked.\nThe room was unchanged. Your memory failed you.`;
    gameoverScreen.style.display = 'flex';
  }, 900);
}

// ═════════════════════════════════════════════════════════════
// FLASH HELPER
// ═════════════════════════════════════════════════════════════
function doFlash(el, color, opacity, dur, cb) {
  el.style.background = color;
  el.style.opacity = opacity;
  setTimeout(() => {
    el.style.transition = `opacity ${dur}ms`;
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.transition = '';
      if (cb) cb();
    }, dur);
  }, 80);
}

// ═════════════════════════════════════════════════════════════
// MOVEMENT + PROXIMITY
// ═════════════════════════════════════════════════════════════
function update() {
  if (!gameActive) return;
  updateMovement(gameActive);

  const bd = camera.position.distanceTo(doors.blue.position);
  const rd = camera.position.distanceTo(doors.red.position);
  const REACH = 2.4;

  if (bd < REACH || rd < REACH) {
    nearDoor = bd < rd ? 'blue' : 'red';
    if (isRefRoom) {
      doorHint.textContent = 'Press E — ready to continue to the challenge';
    } else {
      doorHint.textContent = nearDoor === 'blue'
        ? 'Press E — 🔵 Nothing changed'
        : 'Press E — 🔴 Anomaly present';
    }
    doorHint.classList.add('visible');
  } else {
    nearDoor = null;
    doorHint.classList.remove('visible');
  }
}

// ═════════════════════════════════════════════════════════════
// ROOM FLOW
// ═════════════════════════════════════════════════════════════
function startReferenceRoom() {
  isRefRoom = true;
  buildRoom(difficulty);
  resetCamera();
  refBanner.style.display = 'block';
  gameActive = true;
}

function startChallengeRoom() {
  isRefRoom = false;
  buildRoom(difficulty);
  restoreFromSnapshot();
  hasAnomaly = Math.random() < 0.5;
  if (hasAnomaly) applyAnomaly(() => gameActive);
  refBanner.style.display = 'none';
  resetCamera();
  gameActive = true;
}

// ═════════════════════════════════════════════════════════════
// START GAME
// ═════════════════════════════════════════════════════════════
function startGame() {
  level = 1;
  levelNum.textContent = '1';
  diffBadge.textContent = `${difficulty.toUpperCase()} · ${DIFF_COUNTS[difficulty]} objects`;
  startScreen.style.display = 'none';
  gameoverScreen.style.display = 'none';
  hud.style.display = 'flex';
  crosshairEl.style.display = 'block';
  playAmbience();
  startReferenceRoom();
  renderer.domElement.requestPointerLock();
}

// ═════════════════════════════════════════════════════════════
// RENDER LOOP
// ═════════════════════════════════════════════════════════════
function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}

// ═════════════════════════════════════════════════════════════
// BOOTSTRAP
// ═════════════════════════════════════════════════════════════
initThree();
setupPointerLock(() => gameActive);
setupKeys(() => gameActive, interactDoor);
animate();

startBtn.addEventListener('click', () => {
  if (difficulty) startGame();
});
restartBtn.addEventListener('click', () => {
  gameoverScreen.style.display = 'none';
  startGame();
});
