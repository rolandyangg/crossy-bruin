import * as THREE from "three";
import { tileSize } from "../globals";

export default function Student(
  tileIndex,
  direction,
  shirtColor,
  neckColor,
  skinColor
) {
  const student = new THREE.Group();

  student.position.x = tileIndex * tileSize;
  student.rotation.z = direction === -1 ? Math.PI / 2 : -Math.PI / 2;

  // Torso
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 30),
    new THREE.MeshPhongMaterial({ color: shirtColor })
  );
  torso.position.set(0, 0, 19);
  torso.castShadow = true;
  torso.receiveShadow = true;
  student.add(torso);

  // Shoulder stripe
  const shoulders = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 5),
    new THREE.MeshPhongMaterial({ color: neckColor })
  );
  shoulders.position.set(0, 0, 36.5);
  shoulders.castShadow = true;
  shoulders.receiveShadow = true;
  student.add(shoulders);

  // Head
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 15),
    new THREE.MeshPhongMaterial({ color: skinColor })
  );
  head.position.set(0, 0, 46.5);
  head.castShadow = true;
  head.receiveShadow = true;
  student.add(head);

  // Hair
  const hair = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 5),
    new THREE.MeshPhongMaterial({ color: "#000000" })
  );
  hair.position.set(0, 0, 56.5);
  hair.castShadow = true;
  hair.receiveShadow = true;
  student.add(hair);

  // Arms
  const armGeometry = new THREE.BoxGeometry(5, 5, 16);
  const armMaterial = new THREE.MeshPhongMaterial({ color: skinColor });

  const leftArmPivot = new THREE.Object3D();
  leftArmPivot.position.set(-10, 0, 28);
  student.add(leftArmPivot);

  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(0, 0, -8);
  leftArm.castShadow = true;
  leftArm.receiveShadow = true;
  leftArmPivot.add(leftArm);

  const rightArmPivot = new THREE.Object3D();
  rightArmPivot.position.set(10, 0, 28);
  student.add(rightArmPivot);

  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(0, 0, -8);
  rightArm.castShadow = true;
  rightArm.receiveShadow = true;
  rightArmPivot.add(rightArm);

  student.userData.limbs = { leftArm, rightArm };

  // Sleeves
  const sleeveGeometry = new THREE.BoxGeometry(7, 10, 7);
  const sleeveMaterial = new THREE.MeshPhongMaterial({ color: shirtColor });

  const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  leftSleeve.position.set(-10, 0, 26);
  leftSleeve.castShadow = true;
  leftSleeve.receiveShadow = true;
  student.add(leftSleeve);

  const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  rightSleeve.position.set(10, 0, 26);
  rightSleeve.castShadow = true;
  rightSleeve.receiveShadow = true;
  student.add(rightSleeve);

  // Backpack
  const pack = new THREE.Mesh(
    new THREE.BoxGeometry(10, 4, 20),
    new THREE.MeshPhongMaterial({ color: "grey" })
  );
  pack.position.set(0, -10, 24);
  pack.castShadow = true;
  pack.receiveShadow = true;
  student.add(pack);

  return student;
}
