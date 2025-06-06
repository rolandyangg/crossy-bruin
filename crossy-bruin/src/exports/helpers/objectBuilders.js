import * as THREE from "three";
import { maxTile, minTile } from "../globals";

export function buildTrees() {
  const occupiedTiles = new Set();
  const trees = Array.from({ length: 3 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTile, maxTile);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);

    const height = 20 + Math.floor(Math.random() * 31);

    return { tileIndex, height };
  });

  return { type: "trees", trees, occupiedTiles };
}

export function buildScooters(score) {
  const direction = Math.random() < 0.5 ? 1 : -1;
  const speed = Math.random() * (40 + 2 * score) + 120;

  const occupiedTiles = new Set();
  const scooters = Array.from({ length: 2 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTile, maxTile);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);

    return { tileIndex };
  });

  return { type: "scooter", direction, speed, scooters, occupiedTiles };
}

export function buildCoins(rowData) {
  // selects 0-2 places to put coins
  const numCoins = Math.floor(Math.random() * 3);

  const coins = [];
  const usedTiles = new Set();

  for (let i = 0; i < numCoins; i++) {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTile, maxTile);
    } while (rowData.occupiedTiles.has(tileIndex) || usedTiles.has(tileIndex));

    usedTiles.add(tileIndex);
    coins.push({ tileIndex, ref: null });
  }

  return { ...rowData, coins };
}

export function buildStudents(score) {
  const direction = Math.random() < 0.5 ? 1 : -1;
  const speed = Math.random() * (30 + 2 * score) + 50;
  const occupiedTiles = new Set();

  const students = Array.from({ length: 2 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTile, maxTile);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);
    return { tileIndex };
  });

  return {
    type: "student",
    direction,
    speed,
    students,
    occupiedTiles,
    coins: [],
  };
}

export function buildRobots(score) {
  const direction = Math.random() < 0.5 ? 1 : -1;
  const speed = Math.random() * (50 + 2 * score) + 80;

  const occupiedTiles = new Set();
  // spawn 1 or 2 robots
  const robots = Array.from(
    { length: 1 + Math.floor(Math.random() * 2) },
    () => {
      let tileIndex;
      do {
        tileIndex = THREE.MathUtils.randInt(minTile, maxTile);
      } while (occupiedTiles.has(tileIndex));
      occupiedTiles.add(tileIndex);
      return { tileIndex, ref: null };
    }
  );

  return { type: "robot", direction, speed, robots, occupiedTiles, coins: [] };
}
