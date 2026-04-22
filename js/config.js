// ═════════════════════════════════════════════════════════════
// GAME CONFIGURATION & CONSTANTS
// ═════════════════════════════════════════════════════════════

export const ROOM_W = 13;
export const ROOM_H = 3.4;
export const ROOM_D = 15;
export const HALF_W = ROOM_W / 2 - 0.45;
export const NEAR_Z = ROOM_D / 2 - 0.65;
export const FAR_Z = -ROOM_D / 2 + 0.4;
export const SPEED = 6;

export const DIFF_COUNTS = { easy: 3, medium: 6, hard: 10 };

export const ANOMALY_TYPES = ['move', 'color', 'remove', 'add', 'flicker'];

// ═════════════════════════════════════════════════════════════
// MASTER OBJECT LIST  (10 entries — difficulty slices it)
// ═════════════════════════════════════════════════════════════
export const MASTER_OBJECTS = [
  // ── Easy (indices 0-2) ─────────────────────────────────────
  {
    geo:'box', size:[0.8, 0.8, 0.8],
    pos:[-3.2, 0.40, -4.0], color:0x8b6914, label:'wooden crate'
  },
  {
    geo:'box', size:[0.6, 1.5, 0.6],
    pos:[ 3.0, 0.75, -2.5], color:0x4a4a5e, label:'tall cabinet'
  },
  {
    geo:'box', size:[1.8, 0.3, 0.9],
    pos:[ 0.0, 0.15, -5.5], color:0x5c3a28, label:'long shelf'
  },
  // ── Medium extras (indices 3-5) ────────────────────────────
  {
    geo:'cylinder', size:[0.25, 0.25, 1.0, 10],
    pos:[-1.5, 0.50, -6.0], color:0x2d6e3a, label:'green canister'
  },
  {
    geo:'box', size:[1.0, 0.5, 1.0],
    pos:[ 2.5, 0.25, -5.5], color:0x6b2222, label:'red crate'
  },
  {
    geo:'sphere', size:[0.4, 12, 12],
    pos:[-3.5, 0.40, -1.5], color:0x888866, label:'grey orb'
  },
  // ── Hard extras (indices 6-9) ──────────────────────────────
  {
    geo:'box', size:[0.5, 0.5, 0.5],
    pos:[ 1.0, 0.25, -7.0], color:0x336655, label:'small cube'
  },
  {
    geo:'cylinder', size:[0.15, 0.15, 1.8, 8],
    pos:[-2.0, 0.90, -3.0], color:0x553322, label:'brown rod'
  },
  {
    geo:'box', size:[0.7, 0.9, 0.4],
    pos:[ 3.8, 0.45, -6.5], color:0x334477, label:'blue console'
  },
  {
    geo:'sphere', size:[0.3, 10, 10],
    pos:[-4.0, 0.30, -5.0], color:0x994422, label:'orange ball'
  },
];
