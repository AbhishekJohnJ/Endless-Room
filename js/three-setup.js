// ═════════════════════════════════════════════════════════════
// THREE.JS SETUP - Scene, Camera, Renderer, Controls
// ═════════════════════════════════════════════════════════════

import { SPEED, HALF_W, NEAR_Z, FAR_Z } from './config.js';

export let renderer, scene, camera;
export const clock = new THREE.Clock();
export let yaw = 0, pitch = 0, isLocked = false;
export let moveF = false, moveB = false, moveL = false, moveR = false;
export const velocity = new THREE.Vector3();

export function initThree() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  document.body.insertBefore(renderer.domElement, document.body.firstChild);
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x040407);
  scene.fog = new THREE.FogExp2(0x040407, 0.055);
  
  camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 60);
  
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

export function setupPointerLock(gameActiveGetter) {
  document.addEventListener('pointerlockchange', () => {
    isLocked = document.pointerLockElement === renderer.domElement;
  });
  
  renderer.domElement.addEventListener('click', () => {
    if (gameActiveGetter() && !isLocked) renderer.domElement.requestPointerLock();
  });
  
  document.addEventListener('mousemove', e => {
    if (!isLocked || !gameActiveGetter()) return;
    yaw -= e.movementX * 0.0018;
    pitch -= e.movementY * 0.0018;
    pitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, pitch));
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
  });
}

export function resetCamera() {
  camera.position.set(0, 1.65, 4.5);
  yaw = Math.PI;
  pitch = 0;
  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
  moveF = moveB = moveL = moveR = false;
}

export function updateMovement(gameActive) {
  if (!gameActive) return;
  const dt = clock.getDelta();

  const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  velocity.set(0, 0, 0);
  if (moveF) velocity.addScaledVector(fwd, SPEED);
  if (moveB) velocity.addScaledVector(fwd, -SPEED);
  if (moveL) velocity.addScaledVector(right, -SPEED);
  if (moveR) velocity.addScaledVector(right, SPEED);

  const next = camera.position.clone().addScaledVector(velocity, dt);
  next.x = Math.max(-HALF_W, Math.min(HALF_W, next.x));
  next.z = Math.max(FAR_Z, Math.min(NEAR_Z, next.z));
  camera.position.copy(next);
  camera.position.y = 1.65;
}

export function setMoveF(val) { moveF = val; }
export function setMoveB(val) { moveB = val; }
export function setMoveL(val) { moveL = val; }
export function setMoveR(val) { moveR = val; }
export function setYaw(val) { yaw = val; }
export function setPitch(val) { pitch = val; }
