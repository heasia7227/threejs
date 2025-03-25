import * as THREE from "three";
import { moonGroup } from "./moon.js";

// 地球轨迹线上的点数
const numPoints = 100;
// 地球公转半长轴 (a)
const semiMajorAxis = 26.5;
// 地球公转半短轴 (b)
const semiMinorAxis = 25.6;

const earthGroup = (sunModel) => {
    const group = new THREE.Group();

    const earthGroup = new THREE.Group();

    // 地球
    const earth = earthModel();
    // 设置地球的倾斜角度23.5°
    earth.rotation.x = THREE.MathUtils.degToRad(23.5);
    earthGroup.add(earth);

    // 月亮
    const moon = moonGroup(earth);
    earthGroup.add(moon.group);

    // 设置地球的位置
    earthGroup.position.set(
        sunModel.sunPosition.x + semiMajorAxis,
        sunModel.sunPosition.y,
        sunModel.sunPosition.z + semiMinorAxis
    );
    earthGroup.name = "地球-组";

    group.add(earthGroup);

    // 地球轨迹
    const track = earthTrack(sunModel.sunPosition);
    group.add(track);

    group.rotation.z = 7 * (Math.PI / 180);

    const animate = () => {
        earthAutoroatation(earth);
        earthRevolution(earthGroup, sunModel);
        moon.animate(); //月球运动
    };

    return { group, animate };
};

// 地球模型
const earthModel = () => {
    const group = new THREE.Group();

    // 地球
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

    // 纹理加载器
    const earthTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // .load()方法加载图像，返回一个纹理对象Texture
    const earthTexture = earthTextureLoader.load("earth_day_4096.jpg");
    // 注意最新版本，webgl渲染器默认编码方式已经改变，为了避免色差，纹理对象编码方式要修改为THREE.SRGBColorSpace
    earthTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    earthTexture.wrapS = THREE.RepeatWrapping;

    const earthNormalMap = earthTextureLoader.load("earth_normal_2048.jpg");
    const earthSpecularMap = earthTextureLoader.load("earth_specular_2048.jpg");

    const earthMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture,
        normalMap: earthNormalMap,
        specularMap: earthSpecularMap,
        specular: 0x222222,
        shininess: 25,
    });

    // 地球网格模型
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    group.add(earthMesh);

    // 加载云层纹理
    const cloudTexture = earthTextureLoader.load("earth_clouds_1024.png");
    // 创建云层材质
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.8, // 设置云层透明度
    });

    // 创建云层几何体（比地球稍大）
    const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    group.add(clouds);

    // 创建大气层效果
    const atmosphereGeometry = new THREE.SphereGeometry(1.02, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
        fragmentShader: `
        varying vec3 vNormal;
        void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
    `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    group.add(atmosphere);

    // 创建地轴线（红色）
    const axisGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0,
        1.5,
        0, // 顶端（超出地球表面）
        0,
        -1.5,
        0, // 底端
    ]);
    axisGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const axisLine = new THREE.Line(axisGeometry, axisMaterial);
    axisLine.name = "地球-地轴";
    group.add(axisLine);

    return group;
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
    orbitLine.name = "地球-轨迹";

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

// 地球自转
const earthAutoroatation = (earth) => {
    earth.rotation.y += 0.00067; // 地球逆时针转
};

// 地球公转
const earthRevolution = (earthGroup, sunModel) => {
    // 更新地球的位置（绕太阳椭圆公转）
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * 0.1; // 公转角度（控制速度）

    // 计算地球在椭圆轨道上的位置
    earthGroup.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
    earthGroup.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
};

export { earthGroup };
