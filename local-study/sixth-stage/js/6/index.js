import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { earthGroup } from "./models/earth.js";
import { venusGroup } from "./models/venus.js";
import { mercuryGroup } from "./models/mercury.js";
import { sunModel } from "./models/sun.js";
import { marsGroup } from "./models/mars.js";
import { jupiterGroup } from "./models/jupiter.js";
import { saturnGroup } from "./models/saturn.js";
import { uranusGroup } from "./models/uranus.js";
import { neptuneGroup } from "./models/neptune.js";
import { plutoGroup } from "./models/pluto.js";

// 创建stats对象
const stats = new Stats();
// stats.domElement:web页面上输出计算结果,一个div元素
document.body.appendChild(stats.domElement);

// 实例化一个gui对象
const gui = new GUI();
const guiConfig = {
    showTrack: true,
};

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

const ambientLight = new THREE.AmbientLight(0x666666); // 柔和的环境光
scene.add(ambientLight);

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
const earth = earthGroup(sun, guiConfig);
scene.add(earth.group);

// 火星
const mars = marsGroup(sun);
scene.add(mars.group);

// 木星
const jupiter = jupiterGroup(sun);
scene.add(jupiter.group);

// 土星
const saturn = saturnGroup(sun);
scene.add(saturn.group);

// 天王星
const uranus = uranusGroup(sun);
scene.add(uranus.group);

// 海王星
const neptune = neptuneGroup(sun);
scene.add(neptune.group);

// 冥王星
const pluto = plutoGroup(sun);
scene.add(pluto.group);

// const pointLightHelper = new THREE.PointLightHelper(sun.sunLight, 0.5);
// scene.add(pointLightHelper);

// // 辅助坐标系
// const axesHelper = new THREE.AxesHelper(150);
// // 把坐标系加入到场景中
// scene.add(axesHelper);

// 相机
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(30, 200, 300);
camera.lookAt(sun.sunPosition.x, sun.sunPosition.y, sun.sunPosition.z);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true; // 启用阴影映射
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用软阴影
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0.1;
controls.maxDistance = 900;
controls.target.set(sun.sunPosition.x, sun.sunPosition.y, sun.sunPosition.z);
controls.update();

// 动画函数
function animate() {
    stats.update(); // 告诉stats更新

    mercury.animate(); // 水星运动
    venus.animate(); // 金星运动
    earth.animate(); // 地球运动
    mars.animate(); // 火星运动
    jupiter.animate(); // 木星运动
    saturn.animate(); // 土星运动
    uranus.animate(); // 天王星运动
    neptune.animate(); // 海王星运动
    pluto.animate(); // 冥王星运动
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

gui.add(guiConfig, "showTrack")
    .name("显示轨迹")
    .onChange((value) => {
        scene.traverse((item) => {
            if (item?.isLine && item.name?.endsWith("-轨迹")) {
                item.visible = value;
            }
        });
    });
