import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 画布 Canvas 大小
const width = window.innerWidth;
const height = window.innerHeight;

// 3D场景
const scene = new THREE.Scene();

// 几何体 - 平面长方形
const boxGeometry = new THREE.PlaneGeometry(200, 200);

// 纹理加载器
const textureLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = textureLoader.load("./textures/decal-diffuse.png");
// 注意最新版本，webgl渲染器默认编码方式已经改变，为了避免色差，纹理对象编码方式要修改为THREE.SRGBColorSpace
texture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间

// 几何体材质，漫反射网格材质
const boxMaterial = new THREE.MeshLambertMaterial({
    // color: 0xff0000,
    map: texture,
    transparent: true,
});
// 网格模型
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// 旋转矩形平面
boxMesh.rotateX(-Math.PI / 2);
// 设置网格模型位置
// boxMesh.position.set(25, 25, 25);
// 把网格模型加入到场景中, 默认位置几何体的中心在原点 (0,0,0)
scene.add(boxMesh);

// 添加一个辅助网格地面
const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
gridHelper.position.y = -1;
scene.add(gridHelper);

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
const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 8000);
// 设置相机位置
camera.position.set(500, 500, 500);
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

// 渲染函数
function render() {
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
