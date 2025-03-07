import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// 实例化一个gui对象
const gui = new GUI();
const obj = {
    isRotate: false,
    position: 0,
};

// 画布 Canvas 大小
const width = window.innerWidth;
const height = window.innerHeight;

// 3D场景
const scene = new THREE.Scene();

// 几何体 - 长方体
const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
// 几何体材质，漫反射网格材质
const boxMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
});
// 网格模型
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// 设置网格模型位置
boxMesh.position.set(25, 25, 25);
// 把网格模型加入到场景中, 默认位置几何体的中心在原点 (0,0,0)
scene.add(boxMesh);

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
camera.position.set(200, 200, 200);
// 设置相机观察点或对象
// camera.lookAt(0, 0, 0);
camera.lookAt(boxMesh.position);

// 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
// 设置渲染器大小
renderer.setSize(width, height);
// 执行渲染
renderer.render(scene, camera);
// 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
renderer.setPixelRatio(window.devicePixelRatio);
// 把渲染结果显示到浏览器，结果是个canvas
document.body.appendChild(renderer.domElement);

// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// 渲染函数
function render() {
    obj.isRotate && boxMesh.rotateY(0.01); //每次绕y轴旋转0.01弧度
    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
render();

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

const guiPosition = gui.addFolder("位置");
guiPosition.add(boxMesh.position, "x", 0, 180).name("立方体x轴");
guiPosition.add(boxMesh.position, "y", 0, 180).name("立方体y轴");
guiPosition.add(boxMesh.position, "z", 0, 180).name("立方体z轴");
guiPosition
    .add(obj, "position", [50, 100, 150])
    .name("立方体位置")
    .onChange((value) => {
        boxMesh.position.x = value;
        boxMesh.position.y = value;
        boxMesh.position.z = value;
    });

const guiColor = gui.addFolder("颜色");
guiColor.addColor(boxMaterial, "color").name("立方体颜色");

const guiRotate = gui.addFolder("旋转");
guiRotate.add(obj, "isRotate").name("旋转立方体");
