import * as THREE from "three";

export default function Coin() {
  const coinGeometry = new THREE.BoxGeometry(15, 15, 3);
  const coinMaterial = new THREE.MeshPhongMaterial({ color: "gold" });
  const coin = new THREE.Mesh(coinGeometry, coinMaterial);
  const coinCoords = [0, 0, 3];
  coin.position.set(...coinCoords);
  coin.castShadow = true;
  coin.receiveShadow = true;

  return coin;
}
