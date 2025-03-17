import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { Octree } from "three/addons/math/Octree.js";
import { loadMap } from "./mapModel.js";
import {
    playerControls,
    updatePlayer,
    teleportPlayerIfOob,
    playerDirection,
    playerCollider,
    playerVelocity,
} from "./playerMove.js";
import { initSpheres, shooting, updateSpheres } from "./sphereModel.js";

// 画布 Canvas 大小
const width = window.innerWidth;
const height = window.innerHeight;

const GRAVITY = 30;
const STEPS_PER_FRAME = 5;
let mouseTime = 0;

const container = document.getElementById("container");

const clock = new THREE.Clock();

// 3D场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x88ccee); // 渲染场景背景
scene.fog = new THREE.Fog(0x88ccee, 0, 50); // 定义影响场景中的每个物体的雾的类型。默认值为null。

const stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0px";
container.appendChild(stats.domElement);

// 创建八叉树
const octree = new Octree();
// 加载地图
loadMap(scene, octree);
// 初始化球
initSpheres(scene);

// 半球光, 半球光不能投射阴影
const hemisphereLight = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5);
hemisphereLight.position.set(2, 1, 1);
scene.add(hemisphereLight);

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(-5, 25, -1);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.01;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.top = 30;
directionalLight.shadow.camera.bottom = -30;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 4;
directionalLight.shadow.bias = -0.00006;
scene.add(directionalLight);

// 透视相机
const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
// 设置相机位置
camera.position.set(-0.15, 0.22, 0.96);
camera.rotation.order = "YXZ";

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
// 设置渲染器大小
renderer.setSize(width, height);
// 执行渲染
renderer.render(scene, camera);
renderer.setAnimationLoop(render);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
//解决加载gltf格式模型纹理贴图和原图不一样问题
renderer.outputEncoding = THREE.sRGBEncoding;
//新版本，加载gltf，不需要执行下面代码解决颜色偏差
renderer.outputColorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
// 把渲染结果显示到浏览器，结果是个canvas
container.appendChild(renderer.domElement);

// 渲染函数
function render() {
    const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;
    // we look for collisions in substeps to mitigate the risk of
    // an object traversing another too quickly for detection.
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
        playerControls(camera, deltaTime);
        updatePlayer(camera, deltaTime, octree, GRAVITY);
        updateSpheres(deltaTime, octree, playerCollider, playerVelocity, GRAVITY);
        teleportPlayerIfOob(camera);
    }

    renderer.render(scene, camera); //执行渲染操作
    stats.update();
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

container.addEventListener("mousedown", () => {
    document.body.requestPointerLock();

    mouseTime = performance.now();
});

document.addEventListener("mouseup", () => {
    if (document.pointerLockElement !== null) {
        shooting(camera, playerDirection, playerCollider, playerVelocity, mouseTime);
    }
});

document.body.addEventListener("mousemove", (event) => {
    if (document.pointerLockElement === document.body) {
        camera.rotation.y -= event.movementX / 500;
        camera.rotation.x -= event.movementY / 500;
    }
});
