import * as THREE from "three";
import { tileSize, tilesPerRow } from "../globals";

export default function Road(rowIndex) {
  const row = new THREE.Group();
  row.position.y = rowIndex * tileSize;

  const roadWidth = tilesPerRow * tileSize;
  const roadGeometry = new THREE.BoxGeometry(roadWidth, tileSize, 3);
  const roadMaterial = new THREE.MeshPhongMaterial({ color: "#3B3B3B" });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.position.z = 1.5; // half of thickness (3)
  road.receiveShadow = true;
  row.add(road);

  const dashLength = tileSize * 0.3; // length of each dash
  const dashDepth = tileSize * 0.1; // narrow thickness along Y
  const dashHeight = 0.05; // small height above road
  const gapLength = tileSize * 0.5; // space between dashes

  const totalWidth = roadWidth;
  const halfWidth = totalWidth / 2;

  // Yellow material for dashes
  const dashMaterial = new THREE.MeshPhongMaterial({ color: "#FFFF00" });

  let x = -halfWidth + gapLength / 2 + dashLength / 2;

  while (x < halfWidth) {
    const dashGeo = new THREE.BoxGeometry(dashLength, dashDepth, dashHeight);
    const dashMesh = new THREE.Mesh(dashGeo, dashMaterial);

    dashMesh.position.set(x, 0, 3 + dashHeight / 2);
    dashMesh.receiveShadow = true;
    dashMesh.castShadow = false;

    row.add(dashMesh);
    x += dashLength + gapLength;
  }

  return row;
}
