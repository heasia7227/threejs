import * as THREE from "three";

// 画布 Canvas 大小
const width = 800;
const height = 500;

// 3D场景
const scene = new THREE.Scene();

// 几何体 - 长方体
const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
// 几何体材质
const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true, // 开启透明
    opacity: 0.5, // 设置透明
});
// 网格模型
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// 设置网格模型位置
// boxMesh.position.set(0, 10, 0);
// 把网格模型加入到场景中, 默认位置在原点 (0,0,0)
scene.add(boxMesh);

// 辅助坐标系
const axesHelper = new THREE.AxesHelper(150);
// 把坐标系加入到场景中
scene.add(axesHelper);

// 透视相机
const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 3000);
// 设置相机位置
camera.position.set(200, 200, 200);
// 设置相机观察点或对象
// camera.lookAt(0, 0, 0);
camera.lookAt(boxMesh.position);

// 渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器大小
renderer.setSize(width, height);
// 执行渲染
renderer.render(scene, camera);
// 把渲染结果显示到浏览器，结果是个canvas
document.body.appendChild(renderer.domElement);
