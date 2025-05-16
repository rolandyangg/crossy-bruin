import * as THREE from "three";
import playerBase from "../playerBase";

export default function Player() {
  const player = new THREE.Group();

  // Torso/Sweatshirt (dark blue)
  const torsoGeometry = new THREE.BoxGeometry(15, 15, 30);
  const torsoMaterial = new THREE.MeshPhongMaterial({ color: "#1f3a93" });
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
  const torsoCoords = [0, 0, 15];
  torso.position.set(...torsoCoords);
  playerBase.push(torsoCoords);
  player.add(torso);

  // Shoulder stripe (gold)
  const shoulderGeometry = new THREE.BoxGeometry(15, 15, 5);
  const shoulderMaterial = new THREE.MeshPhongMaterial({ color: "#ffd966" });
  const shoulders = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
  const shouldersCoords = [0, 0, 32.5];
  shoulders.position.set(...shouldersCoords);
  playerBase.push(shouldersCoords);
  player.add(shoulders);

  // Head (skin tone)
  const headGeometry = new THREE.BoxGeometry(15, 15, 15);
  const headMaterial = new THREE.MeshPhongMaterial({ color: "#ffe3c0" });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  const headCoords = [0, 0, 42.5];
  head.position.set(...headCoords);
  playerBase.push(headCoords);
  player.add(head);

  // Hair (black)
  const hairGeometry = new THREE.BoxGeometry(15, 15, 5);
  const hairMaterial = new THREE.MeshPhongMaterial({ color: "black" });
  const hair = new THREE.Mesh(hairGeometry, hairMaterial);
  const hairCoords = [0, 0, 52.5];
  hair.position.set(...hairCoords);
  playerBase.push(hairCoords);
  player.add(hair);

  // Left arm (skin tone)
  const armGeometry = new THREE.BoxGeometry(5, 5, 30);
  const armMaterial = new THREE.MeshPhongMaterial({ color: "#ffe3c0" });
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  const leftArmCoords = [-10, 0, 15];
  leftArm.position.set(...leftArmCoords);
  playerBase.push(leftArmCoords);
  player.add(leftArm);

  // Right arm (skin tone)
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  const rightArmCoords = [10, 0, 15];
  rightArm.position.set(...rightArmCoords);
  playerBase.push(rightArmCoords);
  player.add(rightArm);

  // Right sleeve (dark blue)
  const sleeveGeometry = new THREE.BoxGeometry(7, 7, 10);
  const sleeveMaterial = new THREE.MeshPhongMaterial({ color: "#1f3a93" });
  const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  const rightSleeveCoords = [10, 0, 27];
  rightSleeve.position.set(...rightSleeveCoords);
  playerBase.push(rightSleeveCoords);
  player.add(rightSleeve);

  // Left sleeve (dark blue)
  const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  const leftSleeveCoords = [-10, 0, 27];
  leftSleeve.position.set(...leftSleeveCoords);
  playerBase.push(leftSleeveCoords);
  player.add(leftSleeve);

  // Backpack (grey)
  const packGeometry = new THREE.BoxGeometry(10, 4, 20);
  const packMaterial = new THREE.MeshPhongMaterial({ color: "grey" });
  const backpack = new THREE.Mesh(packGeometry, packMaterial);
  const backpackCoords = [0, -10, 20];
  backpack.position.set(...backpackCoords);
  playerBase.push(backpackCoords);
  player.add(backpack);

  return player;
}
