import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { earthModel, atmosphereModel } from "./earthModel.js";
import { sunModel } from "./sunModel.js";

// Canvas 容器
const container = document.getElementById("container");

// 3D场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // 渲染场景背景

// 太阳
const sun = sunModel();
scene.add(sun.sunLight);

const earthGroup = new THREE.Group();
// 地球
const earth = earthModel(sun);
earthGroup.add(earth);
// 地球大气层
const atmosphere = atmosphereModel(sun, earth);
earthGroup.add(atmosphere);

scene.add(earthGroup);

// 相机
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4.5, 2, 3);

const renderer = new THREE.WebGPURenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0.1;
controls.maxDistance = 50;

// 动画函数
function animate() {
    earthGroup.rotation.y += 0.001;

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
