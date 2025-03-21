import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { earthGroup } from "./earthModel.js";
import { venusGroup } from "./venusModel.js";
import { mercuryGroup } from "./mercuryModel.js";
import { sunModel } from "./sunModel.js";
import { marsGroup } from "./marsModel.js";
import { jupiterGroup } from "./jupiterModel.js";

// Canvas 容器
const container = document.getElementById("container");

// 3D场景
const scene = new THREE.Scene();
// 定义立方体贴图的路径
const cubeTextureLoader = new THREE.CubeTextureLoader().setPath("./textures/cube/");
const cubeTexture = cubeTextureLoader.load([
    "dark-s_px.jpg", // 右
    "dark-s_nx.jpg", // 左
    "dark-s_py.jpg", // 上
    "dark-s_ny.jpg", // 下
    "dark-s_pz.jpg", // 前
    "dark-s_nz.jpg", // 后
]);
// 设置场景背景
scene.background = cubeTexture;

// 太阳
const sun = sunModel();
// 太阳光
scene.add(sun.sunLight);
// 太阳球体
scene.add(sun.sunMesh);

// 水星
const mercury = mercuryGroup(sun);
scene.add(mercury.group);

// 金星
const venus = venusGroup(sun);
scene.add(venus.group);

// 地球
const earth = earthGroup(sun);
scene.add(earth.group);

// 火星
const mars = marsGroup(sun);
scene.add(mars.group);

// 木星
const jupiter = jupiterGroup(sun);
scene.add(jupiter.group);

// // 辅助坐标系
// const axesHelper = new THREE.AxesHelper(150);
// // 把坐标系加入到场景中
// scene.add(axesHelper);

// 相机
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(81, 90, 98);
camera.lookAt(sun.sunPosition.x, sun.sunPosition.y, sun.sunPosition.z);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0.1;
controls.maxDistance = 900;
controls.target.set(sun.sunPosition.x, sun.sunPosition.y, sun.sunPosition.z);
controls.update();

// 动画函数
function animate() {
    earth.earthAutoroatation(); // 地球自转
    earth.earthRevolution(); // 地球公转
    earth.moonRevolution(); // 月球公转和自转
    venus.venusAutoroatation(); // 金星自转
    venus.venusRevolution(); // 金星公转
    mercury.mercuryAutoroatation(); //水星自转
    mercury.mercuryRevolution(); // 水星公转
    mars.marsAutoroatation(); // 火星自转
    mars.marsRevolution(); // 火星公转
    jupiter.jupiterAutoroatation(); // 木星自转
    jupiter.jupiterRevolution(); // 木星公转
    renderer.render(scene, camera); //执行渲染操作
}

// onresize 事件会在窗口被调整大小时发生
window.onresize = function () {
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
};
