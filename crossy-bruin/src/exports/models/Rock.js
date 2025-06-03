import * as THREE from "three";
import { tileSize } from "../globals";

export default function Rock(tileIndex) {
  const radius = tileSize * 0.3;
  const geometry = new THREE.DodecahedronGeometry(radius, 0);
  const material = new THREE.MeshPhongMaterial({ color: "#777777" });
  const rock = new THREE.Mesh(geometry, material);

  rock.castShadow = true;
  rock.receiveShadow = true;

  rock.position.set(tileIndex * tileSize, 0, radius * 0.5);

  return rock;
}
