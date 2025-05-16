import * as THREE from "three";

// Setup Game
let position = {
  currRow: 0,
  currTile: 0,
};
let currMove = null;
let currDirection = 0;

const playerClock = new THREE.Clock(false);

const minTile = -8;
const maxTile = 8;
const tilesPerRow = maxTile - minTile + 1;
const tileSize = 42;
const cameraOffset = new THREE.Vector3(200, -300, 350);

let score = 0;
let gameRunning = false;

let playerBase = []; // Used to store the coords of each player body part

const metadata = [];

const scoreElement = document.getElementById("score");
const ggElement = document.getElementById("gg-container");
const finalScoreElement = document.getElementById("final-score");

////////////////////////////////////////////////////////////////////////////////////////////

// Models
export function Scooter(tileIndex, direction, shirtColor, neckColor, skinColor) {
  const scooter = new THREE.Group();

  scooter.position.x = tileIndex * tileSize;
  if (direction == -1) {
    scooter.rotation.z = Math.PI / 2;
  } else {
    scooter.rotation.z = -Math.PI / 2;
  }

  // Footboard (dark gray)
  const boardGeometry = new THREE.BoxGeometry(10, 40, 2);
  const boardMaterial = new THREE.MeshPhongMaterial({ color: "#555555" });
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  const boardCoords = [0, 0, 3];
  board.position.set(...boardCoords);
  scooter.add(board);

  // Front wheel (black)
  const wheelGeometry = new THREE.BoxGeometry(7, 7, 6);
  const wheelMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
  const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  const frontWheelCoords = [0, 16, 0];
  frontWheel.position.set(...frontWheelCoords);
  scooter.add(frontWheel);

  // Back wheel (black)
  const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  const backWheelCoords = [0, -16, 0];
  backWheel.position.set(...backWheelCoords);
  scooter.add(backWheel);

  // Stem (handle support, black)
  const stemGeometry = new THREE.BoxGeometry(3, 3, 35);
  const stemMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
  const stem = new THREE.Mesh(stemGeometry, stemMaterial);
  const stemCoords = [0, 16, 13];
  stem.position.set(...stemCoords);
  scooter.add(stem);

  // Handlebar (black)
  const handleGeometry = new THREE.BoxGeometry(18, 3, 2);
  const handleMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
  const handlebar = new THREE.Mesh(handleGeometry, handleMaterial);
  const handlebarCoords = [0, 16, 29];
  handlebar.position.set(...handlebarCoords);
  scooter.add(handlebar);

  ///////////////////////////////////////////

  // Torso/Sweatshirt (dark blue)
  const torsoGeometry = new THREE.BoxGeometry(15, 15, 30);
  const torsoMaterial = new THREE.MeshPhongMaterial({ color: shirtColor }); // #"#1f3a93"
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
  const torsoCoords = [0, 0, 19];
  torso.position.set(...torsoCoords);
  playerBase.push(torsoCoords);
  scooter.add(torso);

  // Shoulder stripe (gold)
  const shoulderGeometry = new THREE.BoxGeometry(15, 15, 5);
  const shoulderMaterial = new THREE.MeshPhongMaterial({ color: neckColor }); // "#ffd966"
  const shoulders = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
  const shouldersCoords = [0, 0, 36.5];
  shoulders.position.set(...shouldersCoords);
  playerBase.push(shouldersCoords);
  scooter.add(shoulders);

  // Head (skin tone)
  const headGeometry = new THREE.BoxGeometry(15, 15, 15);
  const headMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  const headCoords = [0, 0, 46.5];
  head.position.set(...headCoords);
  playerBase.push(headCoords);
  scooter.add(head);

  // Hair (black)
  const hairGeometry = new THREE.BoxGeometry(15, 15, 5);
  const hairMaterial = new THREE.MeshPhongMaterial({ color: "black" });
  const hair = new THREE.Mesh(hairGeometry, hairMaterial);
  const hairCoords = [0, 0, 56.5];
  hair.position.set(...hairCoords);
  playerBase.push(hairCoords);
  scooter.add(hair);

  // Left arm (skin tone)
  const armGeometry = new THREE.BoxGeometry(5, 16, 5);
  const armMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  const leftArmCoords = [-10, 10, 31];
  leftArm.position.set(...leftArmCoords);
  playerBase.push(leftArmCoords);
  scooter.add(leftArm);

  // Right arm (skin tone)
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  const rightArmCoords = [10, 10, 31];
  rightArm.position.set(...rightArmCoords);
  playerBase.push(rightArmCoords);
  scooter.add(rightArm);

  // Right sleeve (dark blue)
  const sleeveGeometry = new THREE.BoxGeometry(7, 10, 7);
  const sleeveMaterial = new THREE.MeshPhongMaterial({ color: shirtColor });
  const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  const rightSleeveCoords = [10, 0, 31];
  rightSleeve.position.set(...rightSleeveCoords);
  playerBase.push(rightSleeveCoords);
  scooter.add(rightSleeve);

  // Left sleeve (dark blue)
  const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  const leftSleeveCoords = [-10, 0, 31];
  leftSleeve.position.set(...leftSleeveCoords);
  playerBase.push(leftSleeveCoords);
  scooter.add(leftSleeve);

  // Backpack (grey)
  const packGeometry = new THREE.BoxGeometry(10, 4, 20);
  const packMaterial = new THREE.MeshPhongMaterial({ color: "grey" });
  const backpack = new THREE.Mesh(packGeometry, packMaterial);
  const backpackCoords = [0, -10, 24];
  backpack.position.set(...backpackCoords);
  playerBase.push(backpackCoords);
  scooter.add(backpack);

  return scooter;
}

// Player
function Player() {
  const player = new THREE.Group();

  // Torso/Sweatshirt (dark blue)
  const torsoGeometry = new THREE.BoxGeometry(15, 15, 30);
  const torsoMaterial = new THREE.MeshPhongMaterial({ color: "#1f3a93" });
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
  const torsoCoords = [0, 0, 15];
  torso.position.set(...torsoCoords);
  playerBase.push(torsoCoords);
  player.add(torso);

  // Shoulder stripe (gold)
  const shoulderGeometry = new THREE.BoxGeometry(15, 15, 5);
  const shoulderMaterial = new THREE.MeshPhongMaterial({ color: "#ffd966" });
  const shoulders = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
  const shouldersCoords = [0, 0, 32.5];
  shoulders.position.set(...shouldersCoords);
  playerBase.push(shouldersCoords);
  player.add(shoulders);

  // Head (skin tone)
  const headGeometry = new THREE.BoxGeometry(15, 15, 15);
  const headMaterial = new THREE.MeshPhongMaterial({ color: "#ffe3c0" });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  const headCoords = [0, 0, 42.5];
  head.position.set(...headCoords);
  playerBase.push(headCoords);
  player.add(head);

  // Hair (black)
  const hairGeometry = new THREE.BoxGeometry(15, 15, 5);
  const hairMaterial = new THREE.MeshPhongMaterial({ color: "black" });
  const hair = new THREE.Mesh(hairGeometry, hairMaterial);
  const hairCoords = [0, 0, 52.5];
  hair.position.set(...hairCoords);
  playerBase.push(hairCoords);
  player.add(hair);

  // Left arm (skin tone)
  const armGeometry = new THREE.BoxGeometry(5, 5, 30);
  const armMaterial = new THREE.MeshPhongMaterial({ color: "#ffe3c0" });
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  const leftArmCoords = [-10, 0, 15];
  leftArm.position.set(...leftArmCoords);
  playerBase.push(leftArmCoords);
  player.add(leftArm);

  // Right arm (skin tone)
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  const rightArmCoords = [10, 0, 15];
  rightArm.position.set(...rightArmCoords);
  playerBase.push(rightArmCoords);
  player.add(rightArm);

  // Right sleeve (dark blue)
  const sleeveGeometry = new THREE.BoxGeometry(7, 7, 10);
  const sleeveMaterial = new THREE.MeshPhongMaterial({ color: "#1f3a93" });
  const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  const rightSleeveCoords = [10, 0, 27];
  rightSleeve.position.set(...rightSleeveCoords);
  playerBase.push(rightSleeveCoords);
  player.add(rightSleeve);

  // Left sleeve (dark blue)
  const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  const leftSleeveCoords = [-10, 0, 27];
  leftSleeve.position.set(...leftSleeveCoords);
  playerBase.push(leftSleeveCoords);
  player.add(leftSleeve);

  // Backpack (grey)
  const packGeometry = new THREE.BoxGeometry(10, 4, 20);
  const packMaterial = new THREE.MeshPhongMaterial({ color: "grey" });
  const backpack = new THREE.Mesh(packGeometry, packMaterial);
  const backpackCoords = [0, -10, 20];
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

function Road(rowIndex) {
  const row = new THREE.Group();
  row.position.y = rowIndex * tileSize;

  const roadGeometry = new THREE.BoxGeometry(tilesPerRow * tileSize, tileSize, 3);
  const roadMaterial = new THREE.MeshPhongMaterial({ color: "#3B3B3B" });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.position.z = 1.5;
  row.add(road);

  return row;
}

function Tree(tileIndex, height) {
  const tree = new THREE.Group();
  tree.position.x = tileIndex * tileSize;

  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 30),
    new THREE.MeshLambertMaterial({
      color: 0x725c42,
      flatShading: true,
    })
  );
  trunk.position.z = 10;
  tree.add(trunk);

  const crown = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, height),
    new THREE.MeshLambertMaterial({
      color: 0x5ca904,
      flatShading: true,
    })
  );
  crown.position.z = height / 2 + 20;
  tree.add(crown);

  return tree;
}

export function addRows() {
  const newMetadata = buildRows(20);

  const startIndex = metadata.length;
  metadata.push(...newMetadata);

  newMetadata.forEach((rowData, index) => {
    const rowIndex = startIndex + index + 1;

    if (rowData.type === "trees") {
      const row = Land(rowIndex);

      rowData.trees.forEach(({ tileIndex, height }) => {
        const tree = Tree(tileIndex, height);
        row.add(tree);
      });

      map.add(row);
    }
    if (rowData.type === "scooter") {
      const row = Road(rowIndex);

      rowData.scooters.forEach(({ tileIndex }, index) => {
        const shirtPalette = [
          '#2774AE', // UCLA Primary Blue
          '#FFD100', // UCLA Primary Gold
          '#005A9C', // UCLA Dark Blue
          '#438CCE', // UCLA Secondary Light Blue
          '#FDB927', // UCLA Secondary Gold
          '#003DA5', // UCLA Royal Dark Blue
          '#91B5E3'  // UCLA Tertiary Pale Blue
        ];
        

        const skinTones = [
          '#F2D6CB',
          '#E0AC69',
          '#C68642',
          '#8D5524'
        ];

        let shirtColor = shirtPalette[Math.floor(Math.random() * shirtPalette.length)];
        let neckColor = shirtPalette[Math.floor(Math.random() * shirtPalette.length)];
        let skinColor = skinTones[Math.floor(Math.random() * skinTones.length)];

        const scooter = new Scooter(tileIndex, rowData.direction, shirtColor, neckColor, skinColor);

        scooter.position.set(tileIndex * tileSize, 0, 5);

        scooter.userData.speed = rowData.speed;
        scooter.userData.direction = rowData.direction;

        rowData.scooters[index].ref = scooter;

        row.add(scooter);
      });
      map.add(row);
    }
  });
}

function buildRows(amount) {
  const rows = [];
  for (let i = 0; i < amount; i++) {
    const rowData = Math.random() < 0.5 ? buildScooters() : buildTrees();
    rows.push(rowData);
  }
  return rows;
}

function buildTrees() {
  const occupiedTiles = new Set();
  const trees = Array.from({ length: 3 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTile, maxTile);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);

    const height = Math.floor(Math.random() * (45 - 10 + 1)) + 25; // Choose a random tree height

    return { tileIndex, height };
  });

  return { type: "trees", trees };
}

function buildScooters() {
  const direction = Math.random() < 0.5 ? 1 : -1;
  const speed = Math.random() * 40 + 120;

  const occupiedTiles = new Set();
  const scooters = Array.from({ length: 2 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTile, maxTile);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);

    return { tileIndex };
  });

  return { type: "scooter", direction, speed, scooters };
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

const savedQuarternion = camera.quaternion.clone();

////////////////////////////////////////////////////////////////////////////////////////////

// World
const world = new THREE.Scene();
const player = new Player();
world.add(player);
world.add(camera);

world.add(new THREE.AmbientLight());
const dirLight = new THREE.DirectionalLight();
dirLight.position.set(-100, -100, 200);
world.add(dirLight);

const map = new THREE.Group();

world.add(map);

startGame();

function resetMap() {
  metadata.length = 0;
  map.remove(...map.children);

  for (let rowIndex = 0; rowIndex > -4; rowIndex--) {
    const land = Land(rowIndex);
    map.add(land);
  }
  addRows();
}

function resetPlayer() {
  player.position.x = 0;
  player.position.y = 0;
  player.rotation.z = 0;

  position.currRow = 0;
  position.currTile = 0;
}

function resetCamera() {
  camera.position.set(200, -300, 350);
  camera.lookAt(0, 0, 0);
}

function startGame() {
  resetMap();
  resetPlayer();
  resetCamera();
  score = 0;
  gameRunning = true;
  if (scoreElement) scoreElement.innerText = "0";
  if (finalScoreElement) finalScoreElement.innerText = "0";
  if (ggElement) ggElement.style.visibility = "hidden";
}
document.querySelector("#retry")?.addEventListener("click", startGame);

////////////////////////////////////////////////////////////////////////////////////////////

// Render the game onto the screen
const canvas = document.querySelector("canvas.app");
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);

////////////////////////////////////////////////////////////////////////////////////////////

function move(direction) {
  currMove = direction;
  console.log(currMove + " started");
}

function isValidMove(direction) {
  let newPosition = { row: position.currRow, tile: position.currTile };

  switch (direction) {
    case "forward":
      newPosition.row += 1;
      break;
    case "backward":
      newPosition.row -= 1;
      break;
    case "left":
      newPosition.tile -= 1;
      break;
    case "right":
      newPosition.tile += 1;
      break;
  }

  // border detection
  if (newPosition.row <= -1 || newPosition.tile < minTile || newPosition.tile > maxTile) {
    return false;
  }

  // tree detection
  const newRow = metadata[newPosition.row - 1];

  if (newRow && newRow.type == "trees" && newRow.trees.some((tree) => tree.tileIndex == newPosition.tile)) {
    return false;
  }

  return true;
}

window.addEventListener("keydown", (event) => {
  if (currMove != null) return;
  if (!gameRunning) return;

  let direction;
  if (event.key === "ArrowUp" || event.key === "w" || event.key === " ") {
    direction = "forward";
  } else if (event.key === "ArrowDown" || event.key === "s") {
    direction = "backward";
  } else if (event.key === "ArrowLeft" || event.key === "a") {
    direction = "left";
  } else if (event.key === "ArrowRight" || event.key === "d") {
    direction = "right";
  }

  if (!isValidMove(direction)) {
    direction = "static-" + direction;
  }

  move(direction);
});

function animatePlayer() {
  if (currMove === null) return; // No move occuring, end animation

  if (!playerClock.running) playerClock.start();

  // Calculate position to move to
  const startX = position.currTile * tileSize;
  const startY = position.currRow * tileSize;
  let endX = startX;
  let endY = startY;
  let endDirection = currDirection;

  switch (currMove) {
    case "forward":
      endY += tileSize;
    case "static-forward":
      endDirection = 0;
      break;
    case "backward":
      endY -= tileSize;
    case "static-backward":
      endDirection = Math.PI;
      break;
    case "left":
      endX -= tileSize;
    case "static-left":
      endDirection = Math.PI / 2;
      break;
    case "right":
      endX += tileSize;
    case "static-right":
      endDirection = -Math.PI / 2;
      break;
  }

  // Animate it
  const stepTime = 0.15; // Seconds it takes to take a step
  const progress = Math.min(1, playerClock.getElapsedTime() / stepTime);
  player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
  player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
  player.rotation.z = THREE.MathUtils.lerp(currDirection, endDirection, progress);

  // Must loop through for z instead of player.position.z else it will move the camera too
  for (let i = 0; i < player.children.length; i++) {
    if (player.children[i].isCamera) continue;
    player.children[i].position.z = Math.sin(progress * Math.PI) * 10 + playerBase[i][2];
    // console.log(playerBase[i]);
  }

  // camera.quaternion.copy(savedQuarternion);
  camera.position.copy(player.position).add(cameraOffset);
  camera.lookAt(player.position);

  // Move finished, process it
  if (progress >= 1) {
    switch (currMove) {
      case "forward":
        position.currRow += 1;
      case "static-forward":
        currDirection = 0;
        break;
      case "backward":
        position.currRow -= 1;
      case "static-backward":
        currDirection = Math.PI;
        break;
      case "left":
        position.currTile -= 1;
      case "static-left":
        currDirection = Math.PI / 2;
        break;
      case "right":
        position.currTile += 1;
      case "static-right":
        currDirection = -Math.PI / 2;
        break;
    }

    // console.log(position);
    console.log(currMove + " finished");

    if (position.currRow > score) score = position.currRow;
    scoreElement.textContent = score;

    if (position.currRow > metadata.length - 10) addRows();
    currMove = null;
    playerClock.stop();
  }
}

const scooterClock = new THREE.Clock();

export function animateScooters() {
  const dt = scooterClock.getDelta();
  metadata.forEach((rowData) => {
    if (rowData.type !== "scooter") return;

    const leftBound = (minTile - 2) * tileSize;
    const rightBound = (maxTile + 2) * tileSize;

    rowData.scooters.forEach(({ ref }) => {
      if (!ref) return;

      if (rowData.direction == 1) {
        ref.position.x = ref.position.x > rightBound ? leftBound : ref.position.x + rowData.speed * dt;
      } else {
        ref.position.x = ref.position.x < leftBound ? rightBound : ref.position.x - rowData.speed * dt;
      }
    });
  });
}

function collisionCheck() {
  const rowData = metadata[position.currRow - 1];
  if (!rowData) return;

  if (rowData.type === "scooter") {
    const playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(player);

    rowData.scooters.forEach(({ ref }) => {
      if (!ref) return;

      const scooterBoundingBox = new THREE.Box3();
      scooterBoundingBox.setFromObject(ref);

      if (playerBoundingBox.intersectsBox(scooterBoundingBox)) {
        if (!ggElement || !finalScoreElement) return;
        ggElement.style.visibility = "visible";
        finalScoreElement.innerText = score.toString();
        gameRunning = false;
      }
    });
  }
}

function animate() {
  animatePlayer();
  animateScooters();
  collisionCheck();
  renderer.render(world, camera);
}
