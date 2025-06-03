import * as THREE from "three";
import { tileSize, tilesPerRow } from "../globals";

export default function Sidewalk(rowIndex) {
  const row = new THREE.Group();
  row.position.y = rowIndex * tileSize;

  // Sidewalk a bit thinner in Z than the road and give it a light gray color.
  const sidewalkGeometry = new THREE.BoxGeometry(
    tilesPerRow * tileSize,
    tileSize,
    1.5
  );
  const sidewalkMaterial = new THREE.MeshPhongMaterial({ color: "#A0A0A0" });
  const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
  sidewalk.position.z = 0.75; // half of 1.5 so it sits just above z=0

  sidewalk.receiveShadow = true;
  row.add(sidewalk);

  return row;
}
