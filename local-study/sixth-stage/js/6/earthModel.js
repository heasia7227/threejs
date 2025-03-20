import * as THREE from "three";
import { moonGroup } from "./moonModel.js";

// 地球轨迹线上的点数
const numPoints = 100;
// 地球公转半长轴 (a)
const semiMajorAxis = 28;
// 地球公转半短轴 (b)
const semiMinorAxis = 20;

const earthGroup = (sunModel) => {
    const group = new THREE.Group();

    const earthGroup = new THREE.Group();

    // 地球
    const earth = earthModel();
    // 设置地球的倾斜角度
    earth.rotateX(-Math.PI / 7.6);
    sunModel.sunLights.sunShineEarth.target = earth; // 设置地球的光源
    // 设置地球的位置
    earth.position.set(sunModel.sunPosition.x + semiMajorAxis, sunModel.sunPosition.y, sunModel.sunPosition.z);
    earthGroup.add(earth);

    // 月亮
    const { group: moonG, moonRevolution } = moonGroup(earth);
    sunModel.sunLights.sunShineMoon.target = moonG; // 设置月亮的光源
    earthGroup.add(moonG);

    group.add(earthGroup);

    // 地球轨迹
    const track = earthTrack(sunModel.sunPosition);
    group.add(track);

    // 地球自转
    const earthAutoroatation = () => {
        earth.rotation.y += 0.001;
    };

    // 地球公转
    const earthRevolution = () => {
        // 更新地球的位置（绕太阳椭圆公转）
        const time = Date.now() * 0.001; // 获取当前时间（秒）
        const angle = time * 0.1; // 公转角度（控制速度）

        // 计算地球在椭圆轨道上的位置
        earthGroup.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
        earthGroup.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
    };

    return { group, earthAutoroatation, earthRevolution, moonRevolution };
};

// 地球模型
const earthModel = () => {
    // 地球
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

    // 纹理加载器
    const earthTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // .load()方法加载图像，返回一个纹理对象Texture
    const earthTexture = earthTextureLoader.load("earth_day_4096.jpg");
    // 注意最新版本，webgl渲染器默认编码方式已经改变，为了避免色差，纹理对象编码方式要修改为THREE.SRGBColorSpace
    earthTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    earthTexture.wrapS = THREE.RepeatWrapping;

    const earthMaterial = new THREE.MeshLambertMaterial({
        map: earthTexture,
    });

    // 地球网格模型
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

    return earthMesh;
};

// 地球轨迹
const earthTrack = (sunPosition) => {
    const orbitPoints = [];
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        orbitPoints.push(
            semiMajorAxis * Math.cos(angle), // x
            0, // y
            semiMinorAxis * Math.sin(angle) // z
        );
    }

    const orbitGeometry = new THREE.BufferGeometry();
    orbitGeometry.setAttribute("position", new THREE.Float32BufferAttribute(orbitPoints, 3));

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

export { earthGroup };
