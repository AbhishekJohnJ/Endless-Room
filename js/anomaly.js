// ═════════════════════════════════════════════════════════════
// ANOMALY SYSTEM - Apply different types of anomalies
// ═════════════════════════════════════════════════════════════

import { scene } from './three-setup.js';
import { roomObjects, ambientLight, pointLight } from './room.js';
import { ANOMALY_TYPES, ROOM_W, ROOM_D } from './config.js';

export let extraObj = null;
export let anomalyDesc = '';
export let flickerIntv = null;

export function applyAnomaly(gameActiveGetter) {
  anomalyDesc = '';
  const type = ANOMALY_TYPES[Math.floor(Math.random() * ANOMALY_TYPES.length)];
  const visible = roomObjects.filter(o => o.visible);

  switch (type) {
    case 'move': {
      const obj = visible[Math.floor(Math.random() * visible.length)];
      let nx = obj.position.x + (Math.random() - 0.5) * 3.0;
      let nz = obj.position.z + (Math.random() - 0.5) * 3.0;
      nx = Math.max(-ROOM_W / 2 + 0.7, Math.min(ROOM_W / 2 - 0.7, nx));
      nz = Math.max(-ROOM_D / 2 + 0.7, Math.min(ROOM_D / 2 - 2.0, nz));
      obj.position.x = nx;
      obj.position.z = nz;
      anomalyDesc = `"${obj.userData.label}" has moved to a different position.`;
      break;
    }
    case 'color': {
      const obj = visible[Math.floor(Math.random() * visible.length)];
      const palette = [0xcc2222, 0x2288aa, 0x228833, 0xcc8800, 0xaa22aa, 0x22aacc, 0xddcc11];
      let c;
      do {
        c = palette[Math.floor(Math.random() * palette.length)];
      } while (c === obj.userData.baseColor);
      obj.material.color.setHex(c);
      anomalyDesc = `"${obj.userData.label}" has changed color.`;
      break;
    }
    case 'remove': {
      const obj = visible[Math.floor(Math.random() * visible.length)];
      obj.visible = false;
      anomalyDesc = `"${obj.userData.label}" has disappeared.`;
      break;
    }
    case 'add': {
      extraObj = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.42, 0.42),
        new THREE.MeshStandardMaterial({ color: 0xff1111, emissive: 0x3a0000, roughness: 0.4 })
      );
      extraObj.position.set(
        (Math.random() - 0.5) * (ROOM_W - 2.5),
        0.21,
        (Math.random() - 0.5) * (ROOM_D - 4.5) - 1
      );
      extraObj.castShadow = true;
      scene.add(extraObj);
      anomalyDesc = 'An unknown object has appeared that was not here before.';
      break;
    }
    case 'flicker': {
      const bI = 2.0, bA = 1.3;
      flickerIntv = setInterval(() => {
        if (!gameActiveGetter()) {
          clearInterval(flickerIntv);
          return;
        }
        if (Math.random() < 0.28) {
          pointLight.intensity = 0.05 + Math.random() * 0.4;
          ambientLight.intensity = 0.15;
        } else {
          pointLight.intensity = bI;
          ambientLight.intensity = bA;
        }
      }, 100 + Math.random() * 220);
      anomalyDesc = 'The lighting is behaving strangely — something is wrong with the electricity.';
      break;
    }
  }
}

export function getAnomalyDesc() {
  return anomalyDesc;
}

export function clearFlickerInterval() {
  if (flickerIntv) {
    clearInterval(flickerIntv);
    flickerIntv = null;
  }
}
