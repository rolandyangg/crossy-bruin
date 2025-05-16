import * as THREE from "three";
import { tileSize } from "../globals";
import playerBase from "../playerBase";

export default function Scooter(tileIndex, direction) {
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
  const boardCoords = [0, 0, 3];
  board.position.set(...boardCoords);
  scooter.add(board);

  // Front wheel (black)
  const wheelGeometry = new THREE.BoxGeometry(7, 7, 6);
  const wheelMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
  const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  const frontWheelCoords = [0, 16, 0];
  frontWheel.position.set(...frontWheelCoords);
  scooter.add(frontWheel);

  // Back wheel (black)
  const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  const backWheelCoords = [0, -16, 0];
  backWheel.position.set(...backWheelCoords);
  scooter.add(backWheel);

  // Stem (handle support, black)
  const stemGeometry = new THREE.BoxGeometry(3, 3, 35);
  const stemMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
  const stem = new THREE.Mesh(stemGeometry, stemMaterial);
  const stemCoords = [0, 16, 13];
  stem.position.set(...stemCoords);
  scooter.add(stem);

  // Handlebar (black)
  const handleGeometry = new THREE.BoxGeometry(18, 3, 2);
  const handleMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
  const handlebar = new THREE.Mesh(handleGeometry, handleMaterial);
  const handlebarCoords = [0, 16, 29];
  handlebar.position.set(...handlebarCoords);
  scooter.add(handlebar);

  ///////////////////////////////////////////

  // Torso/Sweatshirt (dark blue)
  const torsoGeometry = new THREE.BoxGeometry(15, 15, 30);
  const torsoMaterial = new THREE.MeshPhongMaterial({ color: "#1f3a93" });
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
  const torsoCoords = [0, 0, 19];
  torso.position.set(...torsoCoords);
  playerBase.push(torsoCoords);
  scooter.add(torso);

  // Shoulder stripe (gold)
  const shoulderGeometry = new THREE.BoxGeometry(15, 15, 5);
  const shoulderMaterial = new THREE.MeshPhongMaterial({ color: "#ffd966" });
  const shoulders = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
  const shouldersCoords = [0, 0, 36.5];
  shoulders.position.set(...shouldersCoords);
  playerBase.push(shouldersCoords);
  scooter.add(shoulders);

  // Head (skin tone)
  const headGeometry = new THREE.BoxGeometry(15, 15, 15);
  const headMaterial = new THREE.MeshPhongMaterial({ color: "#ffe3c0" });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  const headCoords = [0, 0, 46.5];
  head.position.set(...headCoords);
  playerBase.push(headCoords);
  scooter.add(head);

  // Hair (black)
  const hairGeometry = new THREE.BoxGeometry(15, 15, 5);
  const hairMaterial = new THREE.MeshPhongMaterial({ color: "black" });
  const hair = new THREE.Mesh(hairGeometry, hairMaterial);
  const hairCoords = [0, 0, 56.5];
  hair.position.set(...hairCoords);
  playerBase.push(hairCoords);
  scooter.add(hair);

  // Left arm (skin tone)
  const armGeometry = new THREE.BoxGeometry(5, 16, 5);
  const armMaterial = new THREE.MeshPhongMaterial({ color: "#ffe3c0" });
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  const leftArmCoords = [-10, 10, 31];
  leftArm.position.set(...leftArmCoords);
  playerBase.push(leftArmCoords);
  scooter.add(leftArm);

  // Right arm (skin tone)
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  const rightArmCoords = [10, 10, 31];
  rightArm.position.set(...rightArmCoords);
  playerBase.push(rightArmCoords);
  scooter.add(rightArm);

  // Right sleeve (dark blue)
  const sleeveGeometry = new THREE.BoxGeometry(7, 10, 7);
  const sleeveMaterial = new THREE.MeshPhongMaterial({ color: "#1f3a93" });
  const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  const rightSleeveCoords = [10, 0, 31];
  rightSleeve.position.set(...rightSleeveCoords);
  playerBase.push(rightSleeveCoords);
  scooter.add(rightSleeve);

  // Left sleeve (dark blue)
  const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  const leftSleeveCoords = [-10, 0, 31];
  leftSleeve.position.set(...leftSleeveCoords);
  playerBase.push(leftSleeveCoords);
  scooter.add(leftSleeve);

  // Backpack (grey)
  const packGeometry = new THREE.BoxGeometry(10, 4, 20);
  const packMaterial = new THREE.MeshPhongMaterial({ color: "grey" });
  const backpack = new THREE.Mesh(packGeometry, packMaterial);
  const backpackCoords = [0, -10, 24];
  backpack.position.set(...backpackCoords);
  playerBase.push(backpackCoords);
  scooter.add(backpack);

  return scooter;
}
