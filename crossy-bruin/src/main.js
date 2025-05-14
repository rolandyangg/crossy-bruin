import * as THREE from "three";

// Models
function Player() {
  const player = new THREE.Group();

  const bodyGeometry = new THREE.BoxGeometry(15, 15, 30);
  const bodyMaterial = new THREE.MeshPhongMaterial({ color: "black" });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.z = 10;
  player.add(body);

  return player;
}

// Camera
const size = 300;
const aspectRatio = window.innerWidth / window.innerHeight;
let width = size * aspectRatio;
let height = size;
if (aspectRatio < 1) {
  width = size;
  height = size / aspectRatio;
}

const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 100, 900);
camera.up.set(0, 0, 1); // Make z-axis the up direction
camera.position.set(200, -300, 350);
camera.lookAt(0, 0, 0);

// World
const world = new THREE.Scene();
const player = new Player();
world.add(player);
player.add(camera);

// Render the game onto the screen
const canvas = document.querySelector("canvas.app");
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas: canvas
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(world, camera);