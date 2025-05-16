import * as THREE from "three";
import { minTile, maxTile, tileSize } from "./exports/globals";
import { buildScooters, buildTrees } from "./exports/helpers/objectBuilders.js";
import Scooter from "./exports/models/Scooter.js";
import Player from "./exports/models/Player.js";
import playerBase from "./exports/playerBase.js";
import Land from "./exports/models/Land.js";
import Road from "./exports/models/Road.js";
import Tree from "./exports/models/Tree.js";
import isValidMove from "./exports/helpers/isValidMove.js";
import metadata from "./exports/metadata.js";

// Setup Game
let position = {
  currRow: 0,
  currTile: 0,
};

let currMove = null;
let currDirection = 0;

const playerClock = new THREE.Clock(false);
const scooterClock = new THREE.Clock();

const cameraOffset = new THREE.Vector3(200, -300, 350);

let score = 0;

const scoreElement = document.getElementById("score");
const ggElement = document.getElementById("gg-container");
const finalScoreElement = document.getElementById("final-score");

////////////////////////////////////////////////////////////////////////////////////////////

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
        const scooter = new Scooter(tileIndex, rowData.direction);

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
  if (scoreElement) scoreElement.innerText = "0";
  if (finalScoreElement) finalScoreElement.innerText = "0";
  if (ggElement) ggElement.style.visibility = "hidden";
}

document.querySelector("#retry")?.addEventListener("click", startGame);

startGame();

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

window.addEventListener("keydown", (event) => {
  if (currMove != null) return;

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

  if (!isValidMove(direction, position.currRow, position.currTile)) {
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
