// ═════════════════════════════════════════════════════════════
// ROOM BUILDING - Walls, Floors, Doors, Objects
// ═════════════════════════════════════════════════════════════

import { scene } from './three-setup.js';
import { ROOM_W, ROOM_H, ROOM_D, DIFF_COUNTS, MASTER_OBJECTS } from './config.js';

export let roomObjects = [];
export let refSnapshot = [];
export let extraObj = null;
export let ambientLight, pointLight;
export let flickerIntv = null;
export const doors = { red: null, blue: null };

const mat = (c, r = 0.92, m = 0) =>
  new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });

export function buildRoom(difficulty) {
  // Wipe entire scene
  while (scene.children.length) scene.remove(scene.children[0]);
  roomObjects = [];
  extraObj = null;
  if (flickerIntv) {
    clearInterval(flickerIntv);
    flickerIntv = null;
  }

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), mat(0x181818));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), mat(0x0f0f0f));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = ROOM_H;
  ceil.receiveShadow = true;
  scene.add(ceil);

  // Walls: [w, h, d, x, y, z, rotY]
  const wallMat = mat(0x1b1920);
  [
    [ROOM_W, ROOM_H, 0.14, 0, ROOM_H / 2, -ROOM_D / 2, 0],
    [ROOM_W, ROOM_H, 0.14, 0, ROOM_H / 2, ROOM_D / 2, Math.PI],
    [0.14, ROOM_H, ROOM_D, -ROOM_W / 2, ROOM_H / 2, 0, 0],
    [0.14, ROOM_H, ROOM_D, ROOM_W / 2, ROOM_H / 2, 0, 0],
  ].forEach(([w, h, d, x, y, z, ry]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat.clone());
    m.position.set(x, y, z);
    m.rotation.y = ry;
    m.receiveShadow = true;
    scene.add(m);
  });

  // Skirting boards
  const skirtMat = mat(0x111010, 0.95);
  [-ROOM_W / 2 + 0.07, ROOM_W / 2 - 0.07].forEach(x => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, ROOM_D), skirtMat);
    s.position.set(x, 0.09, 0);
    scene.add(s);
  });

  // Lights
  ambientLight = new THREE.AmbientLight(0x090812, 1.3);
  scene.add(ambientLight);
  pointLight = new THREE.PointLight(0xffe0b0, 2.0, 20);
  pointLight.position.set(0, ROOM_H - 0.35, 0);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.set(512, 512);
  scene.add(pointLight);
  const fill = new THREE.PointLight(0x35000a, 0.7, 12);
  fill.position.set(0, 1.4, ROOM_D / 2 - 1.2);
  scene.add(fill);
  const backFill = new THREE.PointLight(0x051520, 0.5, 8);
  backFill.position.set(-ROOM_W / 2 + 1, 1.5, -ROOM_D / 2 + 1);
  scene.add(backFill);

  // Corner pipes (static decor)
  const pipeMat = mat(0x1e1e1e, 0.7, 0.6);
  [[-ROOM_W / 2 + 0.25, -ROOM_D / 2 + 0.3], [ROOM_W / 2 - 0.25, -ROOM_D / 2 + 0.3]].forEach(([x, z]) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, ROOM_H, 8), pipeMat);
    p.position.set(x, ROOM_H / 2, z);
    scene.add(p);
  });

  // Painting on back wall (static decor)
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 0.07), mat(0x150900, 1));
  frame.position.set(0, 2, -ROOM_D / 2 + 0.08);
  scene.add(frame);
  const paint = new THREE.Mesh(
    new THREE.PlaneGeometry(1.34, 0.95),
    new THREE.MeshBasicMaterial({ color: 0x1a0404 })
  );
  paint.position.set(0, 2, -ROOM_D / 2 + 0.13);
  scene.add(paint);

  buildDoors();
  buildRoomObjects(difficulty);
}

function buildDoors() {
  const dH = 2.5, dW = 1.05, dD = 0.2;

  function makeDoor(color, emissive, x) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(dW, dH, dD),
      new THREE.MeshStandardMaterial({ color, roughness: 0.5, emissive })
    );
    mesh.position.set(x, dH / 2, ROOM_D / 2 - 0.12);
    mesh.castShadow = true;
    scene.add(mesh);
    return mesh;
  }

  doors.blue = makeDoor(0x0d4080, 0x001025, -1.7);
  doors.red = makeDoor(0x7a0e0e, 0x1e0000, 1.7);

  // Frames
  function addFrame(mat, pos) {
    const t = 0.11;
    [[dW + t * 2, t, dD + 0.05, pos.x, pos.y + dH / 2 + t / 2, pos.z],
     [t, dH, dD + 0.05, pos.x - dW / 2 - t / 2, pos.y, pos.z],
     [t, dH, dD + 0.05, pos.x + dW / 2 + t / 2, pos.y, pos.z]
    ].forEach(([w, h, d, x, y, z]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      scene.add(m);
    });
  }
  addFrame(new THREE.MeshStandardMaterial({ color: 0x082040, roughness: .85 }), doors.blue.position);
  addFrame(new THREE.MeshStandardMaterial({ color: 0x4a0a0a, roughness: .85 }), doors.red.position);

  // Signs
  function addSign(pos, text, color) {
    const cv = document.createElement('canvas');
    cv.width = 256; cv.height = 64;
    const cx = cv.getContext('2d');
    cx.fillStyle = '#000'; cx.fillRect(0, 0, 256, 64);
    cx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    cx.font = 'bold 20px Courier New';
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(text, 128, 32);
    const sg = new THREE.Mesh(
      new THREE.PlaneGeometry(0.95, 0.24),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true })
    );
    sg.position.set(pos.x, 2.88, pos.z + 0.18);
    scene.add(sg);
  }
  addSign(doors.blue.position, 'NO CHANGE', 0x3377cc);
  addSign(doors.red.position, 'ANOMALY', 0xdd2211);

  // Knobs
  [doors.blue, doors.red].forEach(door => {
    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.15, metalness: 0.9 })
    );
    knob.position.copy(door.position);
    knob.position.z += dD / 2 + 0.01;
    knob.position.x += (door === doors.blue ? 0.38 : -0.38);
    knob.position.y = 1.0;
    scene.add(knob);
  });
}

function buildRoomObjects(difficulty) {
  const count = DIFF_COUNTS[difficulty];
  MASTER_OBJECTS.slice(0, count).forEach((def, i) => {
    let geo;
    switch (def.geo) {
      case 'cylinder': geo = new THREE.CylinderGeometry(...def.size); break;
      case 'sphere': geo = new THREE.SphereGeometry(...def.size); break;
      default: geo = new THREE.BoxGeometry(...def.size);
    }
    const mat = new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.82 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...def.pos);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.userData = {
      defIndex: i,
      baseColor: def.color,
      basePos: mesh.position.clone(),
      label: def.label,
    };
    scene.add(mesh);
    roomObjects.push(mesh);
  });
}

export function captureSnapshot() {
  refSnapshot = roomObjects.map(obj => ({
    pos: obj.position.clone(),
    color: obj.material.color.getHex(),
    vis: obj.visible,
  }));
}

export function restoreFromSnapshot() {
  if (extraObj) {
    scene.remove(extraObj);
    extraObj = null;
  }
  roomObjects.forEach((obj, i) => {
    if (!refSnapshot[i]) return;
    obj.position.copy(refSnapshot[i].pos);
    obj.material.color.setHex(refSnapshot[i].color);
    obj.visible = refSnapshot[i].vis;
  });
}

export function clearFlickerInterval() {
  if (flickerIntv) {
    clearInterval(flickerIntv);
    flickerIntv = null;
  }
}
