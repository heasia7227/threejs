import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 画布 Canvas 大小
const width = 800;
const height = 500;

// 3D场景
const scene = new THREE.Scene();

// BoxGeometry: 长方体
const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
// 几何体材质，漫反射网格材质
const boxMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide, //两面可见
});
// 网格模型
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// 设置网格模型位置
// boxMesh.position.set(25, 25, 25);
// 把网格模型加入到场景中, 默认位置几何体的中心在原点 (0,0,0)
scene.add(boxMesh);

// SphereGeometry：球体
const sphereGeometry = new THREE.SphereGeometry(25);
// 网格模型
const sphereMesh = new THREE.Mesh(sphereGeometry, boxMaterial);
sphereMesh.position.set(100, 0, 0);
scene.add(sphereMesh);

// CylinderGeometry：圆柱
const cylinderGeometry = new THREE.CylinderGeometry(25, 25, 100);
// 网格模型
const cylinderMesh = new THREE.Mesh(cylinderGeometry, boxMaterial);
cylinderMesh.position.set(200, 0, 0);
scene.add(cylinderMesh);

// PlaneGeometry：矩形平面
const planeGeometry = new THREE.PlaneGeometry(50, 50);
// 网格模型
const planeMesh = new THREE.Mesh(planeGeometry, boxMaterial);
planeMesh.position.set(300, 0, 0);
scene.add(planeMesh);

// CircleGeometry：圆形平面
const circleGeometry = new THREE.CircleGeometry(25);
// 网格模型
const circleMesh = new THREE.Mesh(circleGeometry, boxMaterial);
circleMesh.position.set(400, 0, 0);
scene.add(circleMesh);

// 辅助坐标系
const axesHelper = new THREE.AxesHelper(150);
// 把坐标系加入到场景中
scene.add(axesHelper);

// 点光源
// const pointLight = new THREE.PointLight(0xffffff, 1.0);
// // 设置光源不随距离衰减
// pointLight.decay = 0.0;
// // 设置点光源位置
// pointLight.position.set(400, 200, 300);
// // 把点光源加入到场景中
// scene.add(pointLight);

// 环境光: 没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
// 把环境光加入到场景中
scene.add(ambient);

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
directionalLight.position.set(200, 100, 150);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
directionalLight.target = boxMesh;
// 把平行光加入到场景中
scene.add(directionalLight);

// 透视相机
const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 3000);
// 设置相机位置
camera.position.set(1000, 1000, 1000);
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

// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener("change", function () {
    renderer.render(scene, camera); //执行渲染操作
});
