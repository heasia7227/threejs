import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 画布 Canvas 大小
const width = 800;
const height = 500;

// 3D场景
const scene = new THREE.Scene();

// 几何体 - 长方体
const geometry = new THREE.BoxGeometry(20, 60, 10);
// 几何体材质，漫反射网格材质
const material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
});

// 批量创建多个长方体表示高层楼
const group1 = new THREE.Group(); //所有高层楼的父对象
group1.name = "高层";
for (let i = 0; i < 5; i++) {
    const mesh = new THREE.Mesh(geometry.clone(), material.clone());
    mesh.position.x = i * 30; // 网格模型mesh沿着x轴方向阵列
    mesh.name = i + 1 + "号楼";
    group1.add(mesh); //添加到组对象group1
}
group1.position.y = 30;

const geometry2 = new THREE.BoxGeometry(20, 30, 10);
const material2 = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
});
const group2 = new THREE.Group();
group2.name = "洋房";
// 批量创建多个长方体表示洋房
for (let i = 0; i < 5; i++) {
    const mesh = new THREE.Mesh(geometry2.clone(), material2.clone());
    mesh.position.x = i * 30;
    mesh.name = i + 6 + "号楼";
    group2.add(mesh); //添加到组对象group2
}
group2.position.z = 50;
group2.position.y = 15;

const model = new THREE.Group();
model.name = "小区房子";
model.add(group1, group2);
model.position.x = 10;
model.position.z = 5;

// 递归遍历model包含所有的模型节点
// model.traverse(function (obj) {
//     console.log("所有模型节点的名称", obj.name, obj.isMesh);
//     // obj.isMesh：if判断模型对象obj是不是网格模型'Mesh'
//     if (obj.isMesh) {
//         //判断条件也可以是obj.type === 'Mesh'
//         obj.material.color.set(0xffff00);
//     }
// });

// 返回名.name为"4号楼"对应的对象
const nameNode = model.getObjectByName("4号楼");
console.log("nameNode: ", nameNode);
nameNode.material.color.set(0xff0000);

scene.add(model);

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
// directionalLight.target = boxMesh;
// 把平行光加入到场景中
scene.add(directionalLight);

// 透视相机
const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 3000);
// 设置相机位置
camera.position.set(200, 200, 200);
// 设置相机观察点或对象
camera.lookAt(0, 0, 0);
// camera.lookAt(boxMesh.position);

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
