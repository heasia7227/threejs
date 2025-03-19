import * as THREE from "three";
import { normalWorld, normalize } from "three/tsl";

const sunModel = () => {
    // 太阳位置
    const sunPosition = new THREE.Vector3(0, 0, 10);

    // 太阳，先用光源简单模拟
    const sunLight = new THREE.DirectionalLight("#ffffff", 5);
    sunLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);

    // 太阳光的方向
    const sunOrientation = normalWorld.dot(normalize(sunLight.position)).toVar();

    // 纹理加载器
    const sunTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    const sunTexture = sunTextureLoader.load("sun_bg.jpg");
    sunTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    sunTexture.wrapS = THREE.RepeatWrapping;

    // 创建太阳
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: sunTexture,
        emissive: 0xffff00, // 自发光颜色
        emissiveIntensity: 1, // 自发光强度
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(sunPosition.x, sunPosition.y + 1, sunPosition.z);

    return { sunMesh, sunLight, sunOrientation, sunPosition };
};

export { sunModel };
