import * as THREE from "three";

// 画布 Canvas 大小
const width = 800;
const height = 500;

// 3D场景
const scene = new THREE.Scene();

//创建一个空的几何体对象
const geometry = new THREE.BufferGeometry();
//类型化数组创建顶点数据
const vertices = new Float32Array([
    0,
    0,
    0, //顶点1坐标
    50,
    0,
    0, //顶点2坐标
    0,
    100,
    0, //顶点3坐标
    0,
    0,
    10, //顶点4坐标
    0,
    0,
    100, //顶点5坐标
    50,
    0,
    10, //顶点6坐标
]);
// 创建属性缓冲区对象
//3个为一组，表示一个顶点的xyz坐标
const attribue = new THREE.BufferAttribute(vertices, 3);
// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;

// 线材质对象
const material = new THREE.LineBasicMaterial({
    color: 0xff0000, //线条颜色
});
// 创建线模型对象
const line = new THREE.Line(geometry, material);
// 闭合线条
// const line = new THREE.LineLoop(geometry, material);
// 非连续的线条
// const line = new THREE.LineSegments(geometry, material);
scene.add(line);

// 透视相机
const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 3000);
// 设置相机位置
camera.position.set(200, 200, 200);
// 设置相机观察点或对象
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器大小
renderer.setSize(width, height);
// 执行渲染
renderer.render(scene, camera);
// 把渲染结果显示到浏览器，结果是个canvas
document.body.appendChild(renderer.domElement);
