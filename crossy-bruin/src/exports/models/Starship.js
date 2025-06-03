import * as THREE from "three";
import { tileSize } from "../globals";

export default function StarshipRobot(tileIndex, direction) {
  const robot = new THREE.Group();

  const bodyLength = tileSize * 0.6;
  const bodyWidth = tileSize * 0.4;
  const bodyHeight = tileSize * 0.4;

  const wheelRadius = tileSize * 0.1;
  const wheelWidth = tileSize * 0.05;

  const wheelOffsetXs = [
    -bodyLength / 2, // back wheels
    0, // middle wheels
    bodyLength / 2, // front wheels
  ];

  const wheelOffsetY = bodyWidth / 2 + wheelWidth / 2;
  const bodyCenterZ = wheelRadius + bodyHeight / 2;

  robot.position.set(tileIndex * tileSize, 0, 0);

  // body pivot
  const bodyPivot = new THREE.Object3D();
  bodyPivot.position.set(0, 0, bodyCenterZ);
  bodyPivot.rotation.z = direction === 1 ? -Math.PI / 2 : Math.PI / 2;
  robot.add(bodyPivot);

  // torso
  const bodyGeom = new THREE.BoxGeometry(bodyWidth, bodyLength, bodyHeight);
  const bodyMat = new THREE.MeshPhongMaterial({ color: "#ffffff" });
  const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bodyMesh.position.set(0, 0, 0);
  bodyPivot.add(bodyMesh);

  // antenna
  const antennaHeight = tileSize * 0.25;
  const antennaGeom = new THREE.CylinderGeometry(
    tileSize * 0.02,
    tileSize * 0.02,
    antennaHeight,
    8
  );
  const antennaMat = new THREE.MeshPhongMaterial({ color: "#000000" });
  const antenna = new THREE.Mesh(antennaGeom, antennaMat);
  antenna.rotation.x = Math.PI / 2;
  antenna.position.set(0, 0, bodyHeight / 2 + antennaHeight / 2);
  antenna.castShadow = true;
  antenna.receiveShadow = true;
  bodyPivot.add(antenna);

  // wheels
  const wheelGeom = new THREE.CylinderGeometry(
    wheelRadius,
    wheelRadius,
    wheelWidth,
    16
  );
  const wheelMat = new THREE.MeshPhongMaterial({ color: "#333333" });

  wheelOffsetXs.forEach((wx) => {
    // left wheel
    const leftWheel = new THREE.Mesh(wheelGeom, wheelMat);
    leftWheel.position.set(wx, -wheelOffsetY, wheelRadius);
    leftWheel.castShadow = true;
    leftWheel.receiveShadow = true;
    robot.add(leftWheel);

    // right wheel
    const rightWheel = new THREE.Mesh(wheelGeom, wheelMat);
    rightWheel.position.set(wx, wheelOffsetY, wheelRadius);
    rightWheel.castShadow = true;
    rightWheel.receiveShadow = true;
    robot.add(rightWheel);
  });

  // front panel
  const panelWidth = bodyWidth * 0.4;
  const panelHeight = bodyHeight * 0.3;
  const panelDepth = wheelWidth * 0.1;
  const panelGeom = new THREE.BoxGeometry(panelWidth, panelDepth, panelHeight);
  const panelMat = new THREE.MeshBasicMaterial({
    color: "#ff3333",
    emissive: "#ff3333",
  });
  const panelMesh = new THREE.Mesh(panelGeom, panelMat);
  panelMesh.castShadow = false;
  panelMesh.receiveShadow = false;
  panelMesh.position.set(0, bodyLength / 2 + panelDepth / 2, 0);
  bodyPivot.add(panelMesh);

  return robot;
}
