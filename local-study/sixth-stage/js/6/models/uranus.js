import * as THREE from "three";

// 轨迹线上的点数
const numPoints = 100;
// 椭圆轨道参数
const semiMajorAxis = 91; // 半长轴 (a) 7
const semiMinorAxis = 65; // 半短轴 (b) 5

const uranusGroup = (sunModel) => {
    const group = new THREE.Group();

    // 天王星球体
    const uranus = uranusModel();
    uranus.rotateX(-97.77 * (Math.PI / 180));
    uranus.position.set(sunModel.sunPosition.x + semiMajorAxis, sunModel.sunPosition.y, sunModel.sunPosition.z);
    group.add(uranus);

    // 天王星轨迹
    const track = uranusTrack(sunModel.sunPosition);
    group.add(track);

    group.rotation.z = 7 * (Math.PI / 180);

    // 天王星运动
    const animate = () => {
        uranusAutoroatation(uranus);
        uranusRevolution(uranus, sunModel);
    };

    return { group, animate };
};

// 天王星模型
const uranusModel = () => {
    const group = new THREE.Group();
    // 创建天王星几何体
    const uranusGeometry = new THREE.SphereGeometry(1.3, 64, 64); // 天王星半径为1.3

    // 纹理加载器
    const uranusTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // 创建天王星材质
    const uranusTexture = uranusTextureLoader.load("uranus_bg.jpg");
    uranusTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    uranusTexture.wrapS = THREE.RepeatWrapping;
    const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });

    // 创建天王星网格
    const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
    group.add(uranus);

    // 创建地轴线（红色）
    const axisGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0,
        3,
        0, // 顶端（超出地球表面）
        0,
        -3,
        0, // 底端
    ]);
    axisGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const axisLine = new THREE.Line(axisGeometry, axisMaterial);
    axisLine.name = "天王星-地轴";
    group.add(axisLine);

    return group;
};

// 天王星轨迹
const uranusTrack = (sunPosition) => {
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
    orbitLine.name = "天王星-轨迹";

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

// 天王星自转
const uranusAutoroatation = (uranus) => {
    uranus.rotation.y += 0.015;
};

// 天王星公转
const uranusRevolution = (uranus, sunModel) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * 0.0277; // 公转角度（控制速度）

    // 计算天王星在椭圆轨道上的位置
    uranus.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
    uranus.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
};

export { uranusGroup };
