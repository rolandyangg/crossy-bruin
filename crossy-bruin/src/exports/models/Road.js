import * as THREE from "three";
import { tileSize, tilesPerRow } from "../globals";

export default function Road(rowIndex) {
  const row = new THREE.Group();
  row.position.y = rowIndex * tileSize;

  const roadGeometry = new THREE.BoxGeometry(tilesPerRow * tileSize, tileSize, 3);
  const roadMaterial = new THREE.MeshPhongMaterial({ color: "#3B3B3B" });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.position.z = 1.5;
  row.add(road);

  return row;
}
