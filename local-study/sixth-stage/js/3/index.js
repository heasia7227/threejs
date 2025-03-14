import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { earthMesh } from "./earthModel.js";
import { moonMesh } from "./moonModel.js";

// 画布 Canvas 大小
const width = window.innerWidth;
const height = window.innerHeight;

// 3D场景
const scene = new THREE.Scene();

const group = new THREE.Group();
group.add(earthMesh);
group.add(moonMesh);
// 旋转矩形平面
group.rotateX(-Math.PI / 7.6);

scene.add(group);

// 辅助坐标系
const axesHelper = new THREE.AxesHelper(150);
// 把坐标系加入到场景中
scene.add(axesHelper);

// 环境光: 没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
// 把环境光加入到场景中
scene.add(ambient);

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
directionalLight.position.set(200, 100, 150);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
directionalLight.target = earthMesh;
directionalLight.layers.enableAll();
// 把平行光加入到场景中
scene.add(directionalLight);

// 透视相机
const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 8000);
// 设置相机位置
camera.position.set(1000, 1000, 1000);
// 设置相机观察点或对象
camera.lookAt(earthMesh.position);
camera.layers.enableAll();

// 渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器大小
renderer.setSize(width, height);
// 执行渲染
renderer.render(scene, camera);
// 把渲染结果显示到浏览器，结果是个canvas
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
document.body.appendChild(labelRenderer.domElement);

// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, labelRenderer.domElement);

const clock = new THREE.Clock();

// 渲染函数
function render() {
    earthMesh.material.map.offset.x -= 0.001;

    const elapsed = clock.getElapsedTime();
    moonMesh.position.set(Math.sin(elapsed) * 250, 0, Math.cos(elapsed) * 250);

    renderer.render(scene, camera); //执行渲染操作
    labelRenderer.render(scene, camera);
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
render();

// onresize 事件会在窗口被调整大小时发生
window.onresize = function () {
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
};
