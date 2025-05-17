import * as THREE from "three";
import { tileSize } from "../globals";
import playerBase from "../playerBase";

export default function Scooter(tileIndex, direction, shirtColor, neckColor, skinColor) {
  const scooter = new THREE.Group();

  scooter.position.x = tileIndex * tileSize;
  if (direction == -1) {
    scooter.rotation.z = Math.PI / 2;
  } else {
    scooter.rotation.z = -Math.PI / 2;
  }

  // Footboard (dark gray)
  const boardGeometry = new THREE.BoxGeometry(10, 40, 2);
  const boardMaterial = new THREE.MeshPhongMaterial({ color: "#555555" });
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.position.set(0, 0, 3);
  board.castShadow = true;
  board.receiveShadow = true;
  scooter.add(board);

  // Front wheel (black)
  const wheelGeometry = new THREE.BoxGeometry(7, 7, 6);
  const wheelMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
  const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  frontWheel.position.set(0, 16, 0);
  frontWheel.castShadow = true;
  frontWheel.receiveShadow = true;
  scooter.add(frontWheel);

  // Back wheel (black)
  const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  backWheel.position.set(0, -16, 0);
  backWheel.castShadow = true;
  backWheel.receiveShadow = true;
  scooter.add(backWheel);

  // Stem (handle support, black)
  const stemGeometry = new THREE.BoxGeometry(3, 3, 35);
  const stemMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
  const stem = new THREE.Mesh(stemGeometry, stemMaterial);
  stem.position.set(0, 16, 13);
  stem.castShadow = true;
  stem.receiveShadow = true;
  scooter.add(stem);

  // Handlebar (black)
  const handleGeometry = new THREE.BoxGeometry(18, 3, 2);
  const handleMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
  const handlebar = new THREE.Mesh(handleGeometry, handleMaterial);
  handlebar.position.set(0, 16, 29);
  handlebar.castShadow = true;
  handlebar.receiveShadow = true;
  scooter.add(handlebar);

  ///////////////////////////////////////////

  // Torso/Sweatshirt (shirtColor)
  const torsoGeometry = new THREE.BoxGeometry(15, 15, 30);
  const torsoMaterial = new THREE.MeshPhongMaterial({ color: shirtColor });
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
  torso.position.set(0, 0, 19);
  torso.castShadow = true;
  torso.receiveShadow = true;
  playerBase.push([0, 0, 19]);
  scooter.add(torso);

  // Shoulder stripe (neckColor)
  const shoulderGeometry = new THREE.BoxGeometry(15, 15, 5);
  const shoulderMaterial = new THREE.MeshPhongMaterial({ color: neckColor });
  const shoulders = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
  shoulders.position.set(0, 0, 36.5);
  shoulders.castShadow = true;
  shoulders.receiveShadow = true;
  playerBase.push([0, 0, 36.5]);
  scooter.add(shoulders);

  // Head (skinColor)
  const headGeometry = new THREE.BoxGeometry(15, 15, 15);
  const headMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, 0, 46.5);
  head.castShadow = true;
  head.receiveShadow = true;
  playerBase.push([0, 0, 46.5]);
  scooter.add(head);

  // Hair (black)
  const hairGeometry = new THREE.BoxGeometry(15, 15, 5);
  const hairMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
  const hair = new THREE.Mesh(hairGeometry, hairMaterial);
  hair.position.set(0, 0, 56.5);
  hair.castShadow = true;
  hair.receiveShadow = true;
  playerBase.push([0, 0, 56.5]);
  scooter.add(hair);

  // Left arm (skinColor)
  const armGeometry = new THREE.BoxGeometry(5, 16, 5);
  const armMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(-10, 10, 31);
  leftArm.castShadow = true;
  leftArm.receiveShadow = true;
  playerBase.push([-10, 10, 31]);
  scooter.add(leftArm);

  // Right arm (skinColor)
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(10, 10, 31);
  rightArm.castShadow = true;
  rightArm.receiveShadow = true;
  playerBase.push([10, 10, 31]);
  scooter.add(rightArm);

  // Right sleeve (shirtColor)
  const sleeveGeometry = new THREE.BoxGeometry(7, 10, 7);
  const sleeveMaterial = new THREE.MeshPhongMaterial({ color: shirtColor });
  const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  rightSleeve.position.set(10, 0, 31);
  rightSleeve.castShadow = true;
  rightSleeve.receiveShadow = true;
  playerBase.push([10, 0, 31]);
  scooter.add(rightSleeve);

  // Left sleeve (shirtColor)
  const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  leftSleeve.position.set(-10, 0, 31);
  leftSleeve.castShadow = true;
  leftSleeve.receiveShadow = true;
  playerBase.push([-10, 0, 31]);
  scooter.add(leftSleeve);

  // Backpack (grey)
  const packGeometry = new THREE.BoxGeometry(10, 4, 20);
  const packMaterial = new THREE.MeshPhongMaterial({ color: "grey" });
  const backpack = new THREE.Mesh(packGeometry, packMaterial);
  backpack.position.set(0, -10, 24);
  backpack.castShadow = true;
  backpack.receiveShadow = true;
  playerBase.push([0, -10, 24]);
  scooter.add(backpack);

  return scooter;
}
