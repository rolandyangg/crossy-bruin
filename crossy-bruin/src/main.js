import * as THREE from "three";

// Setup Game
let position = {
  currRow: 0,
  currTile: 0
};
let currMove = null;

const playerClock = new THREE.Clock(false);

const minTile = -8;
const maxTile = 8;
const tilesPerRow = maxTile - minTile + 1;
const tileSize = 42;

////////////////////////////////////////////////////////////////////////////////////////////

// Models
// Player
function Player() {
  const player = new THREE.Group();

  const bodyGeometry = new THREE.BoxGeometry(15, 15, 30);
  const bodyMaterial = new THREE.MeshPhongMaterial({ color: "grey" });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.z = 10;
  player.add(body);

  return player;
}

function Land(rowIndex) {
  const row = new THREE.Group();
  row.position.y = rowIndex * tileSize;

  const landGeometry = new THREE.BoxGeometry(tilesPerRow * tileSize, tileSize, 3);
  const landMaterial = new THREE.MeshPhongMaterial({ color: 0xedcea8 });
  const land = new THREE.Mesh(landGeometry, landMaterial);
  land.position.z = 1.5;
  row.add(land);

  return row;
}

////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////

// World
const world = new THREE.Scene();
const player = new Player();
world.add(player);
player.add(camera);

world.add(new THREE.AmbientLight());

const map = new THREE.Group();
for (let i = 0; i < 10; i++) {
  let land = new Land(i);
  map.add(land);
}
world.add(map);

////////////////////////////////////////////////////////////////////////////////////////////

// Render the game onto the screen
const canvas = document.querySelector("canvas.app");
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas: canvas
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);

////////////////////////////////////////////////////////////////////////////////////////////

function move(direction) {
  currMove = direction;
  console.log(currMove + " started");
}

window.addEventListener("keydown", (event) => {
  if (currMove != null) return;

  if (event.key === "ArrowUp" || event.key === "w" || event.key === " ") {
    move("forward");
  } else if (event.key === "ArrowDown" || event.key === "s") {
    move("backward");
  } else if (event.key === "ArrowLeft" || event.key === "a") {
    move("left");
  } else if (event.key === "ArrowRight" || event.key === "d") {
    move("right");
  }
});

function animatePlayer() {
  if (currMove === null) return; // No move occuring, end animation

  if (!playerClock.running) playerClock.start();

  // Calculate position to move to
  const startX = position.currTile * tileSize;
  const startY = position.currRow * tileSize;
  let endX = startX;
  let endY = startY;

  switch (currMove) {
    case "forward":
      endY += tileSize;
      break;
    case "backward":
      endY -= tileSize;
      break;
    case "left":
      endX -= tileSize;
      break;
    case "right":
      endX += tileSize;
      break;
  }

  // Animate it
  const stepTime = 0.1; // Seconds it takes to take a step
  const progress = Math.min(1, playerClock.getElapsedTime() / stepTime);
  player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
  player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
  player.children[0].position.z = Math.sin(progress * Math.PI) * 10 + 10;

  // Move finished, process it
  if (progress >= 1) {
    switch (currMove) {
      case "forward":
        position.currRow += 1;
        break;
      case "backward":
        position.currRow -= 1;
        break;
      case "left":
        position.currTile -= 1;
        break;
      case "right":
        position.currTile += 1;
        break;
    }

    // console.log(position);
    console.log(currMove + " finished");

    currMove = null;
    playerClock.stop();
  }
}

function animate() {
  animatePlayer();
  renderer.render(world, camera);
}