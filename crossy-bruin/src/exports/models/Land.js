import * as THREE from "three";
import { tileSize, tilesPerRow } from "../globals";

export default function Land(rowIndex) {
  const row = new THREE.Group();
  row.position.y = rowIndex * tileSize;

  const landGeometry = new THREE.BoxGeometry(tilesPerRow * tileSize, tileSize, 3);
  const landMaterial = new THREE.MeshPhongMaterial({ color: 0xedcea8 });
  const land = new THREE.Mesh(landGeometry, landMaterial);
  land.position.z = 1.5;
  land.receiveShadow = true;
  row.add(land);

  return row;
}
