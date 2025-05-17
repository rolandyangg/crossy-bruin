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

  return { type: "trees", trees };
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

  return { type: "scooter", direction, speed, scooters };
}
