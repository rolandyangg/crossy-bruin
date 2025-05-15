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

let playerBase = []; // Used to store the coords of each player body part

////////////////////////////////////////////////////////////////////////////////////////////

// Models
// Player
function Player() {
  const player = new THREE.Group();

  // Torso/Sweatshirt (dark blue)
  const torsoGeometry   = new THREE.BoxGeometry(15, 15, 30);
  const torsoMaterial   = new THREE.MeshPhongMaterial({ color: "#1f3a93" });
  const torso           = new THREE.Mesh(torsoGeometry, torsoMaterial);
  const torsoCoords     = [0, 0, 15];
  torso.position.set(...torsoCoords);
  playerBase.push(torsoCoords);
  player.add(torso);

  // Shoulder stripe (gold)
  const shoulderGeometry   = new THREE.BoxGeometry(15, 15, 5);
  const shoulderMaterial   = new THREE.MeshPhongMaterial({ color: "#ffd966" });
  const shoulders          = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
  const shouldersCoords    = [0, 0, 32.5];
  shoulders.position.set(...shouldersCoords);
  playerBase.push(shouldersCoords);
  player.add(shoulders);

  // Head (skin tone)
  const headGeometry    = new THREE.BoxGeometry(15, 15, 15);
  const headMaterial    = new THREE.MeshPhongMaterial({ color: "#ffe3c0" });
  const head            = new THREE.Mesh(headGeometry, headMaterial);
  const headCoords      = [0, 0, 42.5];
  head.position.set(...headCoords);
  playerBase.push(headCoords);
  player.add(head);

  // Hair (black)
  const hairGeometry    = new THREE.BoxGeometry(15, 15, 5);
  const hairMaterial    = new THREE.MeshPhongMaterial({ color: "black" });
  const hair            = new THREE.Mesh(hairGeometry, hairMaterial);
  const hairCoords      = [0, 0, 52.5];
  hair.position.set(...hairCoords);
  playerBase.push(hairCoords);
  player.add(hair);

  // Left arm (skin tone)
  const armGeometry     = new THREE.BoxGeometry(5, 5, 30);
  const armMaterial     = new THREE.MeshPhongMaterial({ color: "#ffe3c0" });
  const leftArm         = new THREE.Mesh(armGeometry, armMaterial);
  const leftArmCoords   = [-10, 0, 15];
  leftArm.position.set(...leftArmCoords);
  playerBase.push(leftArmCoords);
  player.add(leftArm);

  // Right arm (skin tone)
  const rightArm        = new THREE.Mesh(armGeometry, armMaterial);
  const rightArmCoords  = [10, 0, 15];
  rightArm.position.set(...rightArmCoords);
  playerBase.push(rightArmCoords);
  player.add(rightArm);

  // Right sleeve (dark blue)
  const sleeveGeometry  = new THREE.BoxGeometry(7, 7, 10);
  const sleeveMaterial  = new THREE.MeshPhongMaterial({ color: "#1f3a93" });
  const rightSleeve     = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  const rightSleeveCoords = [10, 0, 27];
  rightSleeve.position.set(...rightSleeveCoords);
  playerBase.push(rightSleeveCoords);
  player.add(rightSleeve);

  // Left sleeve (dark blue)
  const leftSleeve      = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  const leftSleeveCoords = [-10, 0, 27];
  leftSleeve.position.set(...leftSleeveCoords);
  playerBase.push(leftSleeveCoords);
  player.add(leftSleeve);

  // Backpack (grey)
  const packGeometry    = new THREE.BoxGeometry(10, 4, 20);
  const packMaterial    = new THREE.MeshPhongMaterial({ color: "grey" });
  const backpack        = new THREE.Mesh(packGeometry, packMaterial);
  const backpackCoords  = [0, -10, 20];
  backpack.position.set(...backpackCoords);
  playerBase.push(backpackCoords);
  player.add(backpack);

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

  // Must loop through for z instead of player.position.z else it will move the camera too
  for (let i = 0; i < player.children.length; i++) {
    if (player.children[i].isCamera) continue;
    player.children[i].position.z = Math.sin(progress * Math.PI) * 10 + playerBase[i][2];
    // console.log(playerBase[i]);
  }
  
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