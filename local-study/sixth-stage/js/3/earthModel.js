import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const EARTH_RADIUS = 50;

// 地球几何体
const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS);

// 纹理加载器
const textureLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = textureLoader.load("./textures/earth.jpg");
// 注意最新版本，webgl渲染器默认编码方式已经改变，为了避免色差，纹理对象编码方式要修改为THREE.SRGBColorSpace
texture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
texture.wrapS = THREE.RepeatWrapping;

// 几何体材质，漫反射网格材质
const earthMaterial = new THREE.MeshLambertMaterial({
    map: texture,
});
// 网格模型
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.layers.enableAll();

const earthDiv = document.createElement("div");
earthDiv.className = "label";
earthDiv.textContent = "Earth";
earthDiv.style.backgroundColor = "transparent";

const earthLabel = new CSS2DObject(earthDiv);
earthLabel.position.set(1.5 * EARTH_RADIUS, 0, 0);
earthLabel.center.set(0, 2);
earthLabel.layers.set(0);
earthMesh.add(earthLabel);

const earthMassDiv = document.createElement("div");
earthMassDiv.className = "label";
earthMassDiv.textContent = "5.97237e24 kg";
earthMassDiv.style.backgroundColor = "transparent";

const earthMassLabel = new CSS2DObject(earthMassDiv);
earthMassLabel.position.set(1.5 * EARTH_RADIUS, 0, 0);
earthMassLabel.center.set(0, 1);
earthMassLabel.layers.set(1);
earthMesh.add(earthMassLabel);

export { earthMesh };
