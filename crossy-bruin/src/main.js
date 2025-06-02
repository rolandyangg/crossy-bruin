import * as THREE from "three";
import {
  minTile,
  maxTile,
  tileSize,
  shirtPalette,
  skinTones,
} from "./exports/globals";
import {
  buildScooters,
  buildTrees,
  buildCoins,
  buildStudents,
} from "./exports/helpers/objectBuilders.js";
import Scooter from "./exports/models/Scooter.js";
import Player from "./exports/models/Player.js";
import Student from "./exports/models/Student.js";
import playerBase from "./exports/playerBase.js";
import Land from "./exports/models/Land.js";
import Road from "./exports/models/Road.js";
import Tree from "./exports/models/Tree.js";
import Coin from "./exports/models/Coin.js";
import isValidMove from "./exports/helpers/isValidMove.js";
import metadata from "./exports/metadata.js";
import { mx_bilerp_1 } from "three/src/nodes/materialx/lib/mx_noise.js";
import Sidewalk from "./exports/models/Sidewalk.js";

// Setup Game
let position = {
  currRow: 0,
  currTile: 0,
};

let currMove = null;
let currDirection = 0;

const playerClock = new THREE.Clock(false);
const scooterClock = new THREE.Clock();
const studentClock = new THREE.Clock();

const cameraOffset = new THREE.Vector3(200, -300, 350);
const dirLightOffset = new THREE.Vector3(-100, -100, 300);

let score = 0;
let coins = 0;
let isGameRunning = false;

const scoreElement = document.getElementById("score");
const ggElement = document.getElementById("gg-container");
const finalScoreElement = document.getElementById("final-score");
const coinsElement = document.getElementById("coins");

const jumpSoundPath = "./src/sounds/jump.mp3";
const crashSoundPaths = [
  "./src/sounds/crash1.mp3",
  "./src/sounds/crash2.mp3",
  "./src/sounds/crash3.mp3",
];
const coinSoundPath = "./src/sounds/coin.mp3";

// We need an array for coins because each coin can be at a different point in their animation at a time
const coinMetadata = []; // Each element: { model, coinTimer }

////////////////////////////////////////////////////////////////////////////////////////////

export function addRows() {
  const newMetadata = buildRows(20);

  const startIndex = metadata.length;
  metadata.push(...newMetadata);

  newMetadata.forEach((rowData, index) => {
    const rowIndex = startIndex + index + 1;
    let row;
    if (rowData.type === "trees") {
      row = Land(rowIndex);

      rowData.trees.forEach(({ tileIndex, height }) => {
        const tree = Tree(tileIndex, height);
        row.add(tree);
      });
    } else if (rowData.type === "scooter") {
      row = Road(rowIndex);

      rowData.scooters.forEach(({ tileIndex }, index) => {
        let shirtColor =
          shirtPalette[Math.floor(Math.random() * shirtPalette.length)];
        let neckColor =
          shirtPalette[Math.floor(Math.random() * shirtPalette.length)];
        let skinColor = skinTones[Math.floor(Math.random() * skinTones.length)];

        const scooter = new Scooter(
          tileIndex,
          rowData.direction,
          shirtColor,
          neckColor,
          skinColor
        );

        scooter.position.set(tileIndex * tileSize, 0, 5);

        scooter.userData.speed = rowData.speed;
        scooter.userData.direction = rowData.direction;

        rowData.scooters[index].ref = scooter;

        row.add(scooter);
      });
    } else if (rowData.type === "student") {
      row = Sidewalk(rowIndex);
      rowData.students.forEach(({ tileIndex }, index) => {
        const shirtColor =
          shirtPalette[Math.floor(Math.random() * shirtPalette.length)];
        const neckColor =
          shirtPalette[Math.floor(Math.random() * shirtPalette.length)];
        const skinColor =
          skinTones[Math.floor(Math.random() * skinTones.length)];

        const student = new Student(
          tileIndex,
          rowData.direction,
          shirtColor,
          neckColor,
          skinColor
        );
        student.position.set(tileIndex * tileSize, 0, 5);

        student.userData.speed = rowData.speed;
        student.userData.direction = rowData.direction;

        rowData.students[index].ref = student;
        row.add(student);
      });
    }

    // Add coins
    for (let i = 0; i < rowData.coins.length; i++) {
      // console.log(rowData.coins[i]);
      const coin = new Coin();
      coin.position.set(rowData.coins[i].tileIndex * tileSize, 0, 5);
      rowData.coins[i].ref = coin;
      row.add(coin);
    }
    map.add(row);
  });
}

function buildRows(amount) {
  const rows = [];
  for (let i = 0; i < amount; i++) {
    let rowData;
    const rand = Math.random();

    if (rand < 0.4) {
      rowData = buildTrees();
    } else if (rand < 0.75) {
      rowData = buildScooters();
    } else {
      rowData = buildStudents();
    }
    rowData = buildCoins(rowData);
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

const camera = new THREE.OrthographicCamera(
  width / -2,
  width / 2,
  height / 2,
  height / -2,
  100,
  900
);
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

// Lighting
world.add(new THREE.AmbientLight());
const dirLight = new THREE.DirectionalLight();
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.up.set(0, 0, 1);
dirLight.shadow.camera.left = -500;
dirLight.shadow.camera.right = 500;
dirLight.shadow.camera.top = 500;
dirLight.shadow.camera.bottom = -500;
dirLight.shadow.camera.near = 50;
dirLight.shadow.camera.far = 500;
dirLight.position.set(-100, -100, 300);
world.add(dirLight);

const listener = new THREE.AudioListener();
camera.add(listener);
const jumpSound = new THREE.Audio(listener);
new THREE.AudioLoader().load(jumpSoundPath, (buf) => {
  jumpSound.setBuffer(buf);
  jumpSound.setLoop(false);
  jumpSound.setVolume(1);
});
const crashSounds = [];
for (let i = 0; i < crashSoundPaths.length; i++) {
  let crashSound = new THREE.Audio(listener);
  new THREE.AudioLoader().load(crashSoundPaths[i], (buf) => {
    crashSound.setBuffer(buf);
    crashSound.setLoop(false);
    crashSound.setVolume(0.5);
  });
  crashSounds.push(crashSound);
}
const coinSound = new THREE.Audio(listener);
new THREE.AudioLoader().load(coinSoundPath, (buf) => {
  coinSound.setBuffer(buf);
  coinSound.setLoop(false);
  coinSound.setVolume(0.5);
});

const map = new THREE.Group();

world.add(map);

function resetMap() {
  metadata.length = 0;
  map.remove(...map.children);

  for (let rowIndex = 0; rowIndex > -15; rowIndex--) {
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
  dirLight.target = player;
  dirLight.position.copy(player.position).add(dirLightOffset);
  score = 0;
  isGameRunning = true;
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
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);

////////////////////////////////////////////////////////////////////////////////////////////

function move(direction) {
  currMove = direction;
  if (jumpSound.isPlaying) jumpSound.stop();
  jumpSound.play();
  console.log(currMove + " started");
}

window.addEventListener("keydown", (event) => {
  if (currMove != null) return;
  if (!isGameRunning) return;

  let direction;
  if (event.key === "ArrowUp" || event.key === "w" || event.key === " ") {
    direction = "forward";
  } else if (event.key === "ArrowDown" || event.key === "s") {
    direction = "backward";
  } else if (event.key === "ArrowLeft" || event.key === "a") {
    direction = "left";
  } else if (event.key === "ArrowRight" || event.key === "d") {
    direction = "right";
  } else {
    return;
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
  player.rotation.z = THREE.MathUtils.lerp(
    currDirection,
    endDirection,
    progress
  );

  // Must loop through for z instead of player.position.z else it will move the camera too
  for (let i = 0; i < player.children.length; i++) {
    if (player.children[i].isCamera) continue;
    player.children[i].position.z =
      Math.sin(progress * Math.PI) * 20 + playerBase[i][2];
    // console.log(playerBase[i]);
  }

  camera.position.copy(player.position).add(cameraOffset);
  dirLight.position.copy(player.position).add(dirLightOffset);
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
        ref.position.x =
          ref.position.x > rightBound
            ? leftBound
            : ref.position.x + rowData.speed * dt;
      } else {
        ref.position.x =
          ref.position.x < leftBound
            ? rightBound
            : ref.position.x - rowData.speed * dt;
      }
    });
  });
}

export function animateStudents() {
  const dt = studentClock.getDelta();
  const time = performance.now() * 0.005;

  metadata.forEach((rowData) => {
    if (rowData.type !== "student") return;

    const leftBound = (minTile - 2) * tileSize;
    const rightBound = (maxTile + 2) * tileSize;

    rowData.students.forEach(({ ref }) => {
      if (!ref) return;

      // Move left/right
      if (rowData.direction === 1) {
        ref.position.x =
          ref.position.x > rightBound
            ? leftBound
            : ref.position.x + rowData.speed * dt;
      } else {
        ref.position.x =
          ref.position.x < leftBound
            ? rightBound
            : ref.position.x - rowData.speed * dt;
      }

      // Bobbing
      const bob = Math.sin((time + ref.position.x) * 0.3) * 1.5;
      ref.position.z = 5 + bob;

      // Arm swinging
      const swing = (Math.sin((time + ref.position.x) * 0.2) * Math.PI) / 10;
      if (ref.userData.limbs) {
        const { leftArm, rightArm } = ref.userData.limbs;
        leftArm.rotation.x = swing;
        rightArm.rotation.x = -swing;
      }
    });
  });
}

export function animateCoins() {
  for (let i = 0; i < coinMetadata.length; i++) {
    let timer = coinMetadata[i].timer;
    let coin = coinMetadata[i].model;
    if (!timer.running) timer.start();

    const stepTime = 0.2; // Seconds it takes to take a step
    const progress1 = Math.min(1, timer.getElapsedTime() / stepTime);
    const progress2 = timer.getElapsedTime() / stepTime;

    if (progress1 <= 1) {
      coin.position.z = THREE.MathUtils.lerp(5, 100, progress1);
      coin.rotation.x = THREE.MathUtils.lerp(0, (5 * Math.PI) / 2, progress1);
      coin.rotation.y = THREE.MathUtils.lerp(0, 2 * Math.PI, progress1);
    }
    if (progress2 >= 3) {
      console.log("Done!");
      coinMetadata.splice(i, 1);
      console.log(coinMetadata);
      coin.parent.remove(coin);
    }
  }
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
        if (isGameRunning) {
          let currCrashSound =
            crashSounds[Math.floor(Math.random() * crashSoundPaths.length)];
          if (currCrashSound.isPlaying) currCrashSound.stop();
          currCrashSound.play();
        }
        isGameRunning = false;
        finalScoreElement.innerText = score.toString();
      }
    });
  }

  if (rowData.type === "student") {
    // Build a Box3 around the player
    const playerBox = new THREE.Box3().setFromObject(player);

    rowData.students.forEach(({ ref }) => {
      if (!ref) return;

      // Build a Box3 around each student mesh
      const studentBox = new THREE.Box3().setFromObject(ref);
      console.log(studentBox);
      // If they intersect, end the game
      if (playerBox.intersectsBox(studentBox)) {
        console.log("ending");
        if (!ggElement || !finalScoreElement) return;

        ggElement.style.visibility = "visible";

        if (isGameRunning) {
          const crashSound =
            crashSounds[Math.floor(Math.random() * crashSoundPaths.length)];
          if (crashSound.isPlaying) crashSound.stop();
          crashSound.play();
        }

        isGameRunning = false;

        finalScoreElement.innerText = score.toString();
      }
    });
  }

  for (let i = 0; i < rowData.coins.length; i++) {
    if (position.currTile == rowData.coins[i].tileIndex) {
      if (coinSound.isPlaying) coinSound.stop();
      coinSound.play();
      coins += 1;
      coinsElement.innerText = coins;

      const coinModel = rowData.coins[i].ref;
      coinMetadata.push({ model: coinModel, timer: new THREE.Clock(false) });
      rowData.coins.splice(i, 1);

      break;
    }
  }
}

function animate() {
  animatePlayer();
  animateScooters();
  animateStudents();
  animateCoins();
  collisionCheck();
  renderer.render(world, camera);
}
