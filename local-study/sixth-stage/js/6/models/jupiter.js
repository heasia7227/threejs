import * as THREE from "three";

// 轨迹线上的点数
const numPoints = 100;
// 椭圆轨道参数
const semiMajorAxis = 70; // 半长轴 (a)
const semiMinorAxis = 67.5; // 半短轴 (b)

const jupiterGroup = (sunModel) => {
    const group = new THREE.Group();

    // 木星球体
    const jupiter = jupiterModel();
    // 木星自转轴倾斜角度 3.13°
    jupiter.rotation.x = THREE.MathUtils.degToRad(3.13);
    jupiter.position.set(
        sunModel.sunPosition.x + semiMajorAxis,
        sunModel.sunPosition.y,
        sunModel.sunPosition.z + semiMinorAxis
    );
    group.add(jupiter);

    // 木星轨迹
    const track = jupiterTrack(sunModel.sunPosition);
    group.add(track);

    group.rotation.z = 7 * (Math.PI / 180);

    const animate = () => {
        jupiterAutoroatation(jupiter);
        jupiterRevolution(jupiter, sunModel);
    };

    return { group, animate };
};

// 木星模型
const jupiterModel = () => {
    const group = new THREE.Group();
    // 创建木星几何体
    const jupiterGeometry = new THREE.SphereGeometry(2, 64, 64); // 木星半径为2

    // 纹理加载器
    const jupiterTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // 创建木星材质
    const jupiterTexture = jupiterTextureLoader.load("jupiter_bg.jpg");
    jupiterTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    jupiterTexture.wrapS = THREE.RepeatWrapping;
    const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });

    // 创建木星网格
    const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
    group.add(jupiter);

    // 创建地轴线（红色）
    const axisGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0,
        2.5,
        0, // 顶端（超出星球表面）
        0,
        -2.5,
        0, // 底端
    ]);
    axisGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const axisLine = new THREE.Line(axisGeometry, axisMaterial);
    axisLine.name = "木星-地轴";
    group.add(axisLine);

    return group;
};

// 木星轨迹
const jupiterTrack = (sunPosition) => {
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
    orbitLine.name = "木星-轨迹";

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

// 木星自转
const jupiterAutoroatation = (jupiter) => {
    jupiter.rotation.y += 0.033;
};

// 木星公转
const jupiterRevolution = (jupiter, sunModel) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * 0.043; // 公转角度（控制速度）

    // 计算木星在椭圆轨道上的位置
    jupiter.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
    jupiter.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
};

export { jupiterGroup };
