import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const MOON_RADIUS = 13.5;

// 月亮几何体
const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS);
// 纹理加载器
const moonTextureLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const moonTexture = moonTextureLoader.load("./textures/moon.jpg");
// 注意最新版本，webgl渲染器默认编码方式已经改变，为了避免色差，纹理对象编码方式要修改为THREE.SRGBColorSpace
moonTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
moonTexture.wrapS = THREE.RepeatWrapping;

const moonMaterial = new THREE.MeshLambertMaterial({
    map: moonTexture,
});
// 网格模型
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.layers.enableAll();

const moonDiv = document.createElement("div");
moonDiv.className = "label";
moonDiv.textContent = "Moon";
moonDiv.style.backgroundColor = "transparent";

const moonLabel = new CSS2DObject(moonDiv);
moonLabel.position.set(1.5 * MOON_RADIUS, 0, 0);
moonLabel.center.set(0, 1);
moonLabel.layers.set(0);
moonMesh.add(moonLabel);

const moonMassDiv = document.createElement("div");
moonMassDiv.className = "label";
moonMassDiv.textContent = "7.342e22 kg";
moonMassDiv.style.backgroundColor = "transparent";

const moonMassLabel = new CSS2DObject(moonMassDiv);
moonMassLabel.position.set(1.5 * MOON_RADIUS, 0, 0);
moonMassLabel.center.set(0, 0);
moonMassLabel.layers.set(1);
moonMesh.add(moonMassLabel);

export { moonMesh };
