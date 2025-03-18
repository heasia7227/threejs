import * as THREE from "three";
import { normalWorld, normalize } from "three/tsl";

const sunModel = () => {
    // 太阳，先用光源简单模拟
    const sunLight = new THREE.DirectionalLight("#ffffff", 2);
    sunLight.position.set(0, 0, 10);

    // 太阳光的方向
    const sunOrientation = normalWorld.dot(normalize(sunLight.position)).toVar();

    return { sunLight, sunOrientation };
};

export { sunModel };
