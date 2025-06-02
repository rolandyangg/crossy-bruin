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

export function buildScooters() {
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

  return { type: "scooter", direction, speed, scooters, occupiedTiles };
}

export function buildCoins(rowData) {
  // Select 1 to 3 random spots to put coins
  const coins = Array.from({ length: Math.floor(Math.random() * 3) }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTile, maxTile);
    } while (rowData.occupiedTiles.has(tileIndex));
    rowData.occupiedTiles.add(tileIndex);
    let ref = null;
    return { tileIndex, ref };
  });

  return { ...rowData, coins };
}

export function buildStudents() {
  const direction = Math.random() < 0.5 ? 1 : -1;
  const speed = Math.random() * 30 + 50;
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
