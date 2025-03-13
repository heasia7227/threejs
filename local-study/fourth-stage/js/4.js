import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 画布 Canvas 大小
const width = 800;
const height = 500;

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

const group = new THREE.Group();
group.add(boxMesh);

const mesh2 = boxMesh.clone();
mesh2.position.x = 100;
group.add(mesh2);

const mesh3 = boxMesh.clone();
mesh3.position.x = 200;
group.add(mesh3);

scene.add(group);

group.remove(mesh2);

// 声明一个三维向量用来表示某个坐标
const worldPosition = new THREE.Vector3();
// 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
boxMesh.getWorldPosition(worldPosition);
console.log("世界坐标", worldPosition);
console.log("本地坐标", boxMesh.position);

// 辅助坐标系
const axesHelper = new THREE.AxesHelper(150);
// 把坐标系加入到场景中
scene.add(axesHelper);

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
