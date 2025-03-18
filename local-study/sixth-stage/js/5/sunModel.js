import * as THREE from "three";
import { normalWorld, normalize } from "three/tsl";

const sunModel = () => {
    // 太阳，先用光源简单模拟
    const sunLight = new THREE.DirectionalLight("#ffffff", 2);
    sunLight.position.set(0, 0, 10);

    // 太阳光的方向
    const sunOrientation = normalWorld.dot(normalize(sunLight.position)).toVar();

    // 创建太阳的几何体
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32); // 半径为5的球体

    // 创建太阳的材质（发光效果）
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00, // 黄色
        emissive: 0xffff00, // 自发光颜色
        emissiveIntensity: 1, // 自发光强度
    });

    // 创建太阳的网格
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(0, 0, 10);

    return { sunMesh, sunLight, sunOrientation };
};

export { sunModel };
