import * as THREE from "three";
import { tileSize } from "../globals";

export default function Tree(tileIndex, height) {
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
