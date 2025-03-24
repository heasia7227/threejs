import * as THREE from "three";

// 轨迹线上的点数
const numPoints = 100;
// 椭圆轨道参数
const semiMajorAxis = 120; // 半长轴 (a)
const semiMinorAxis = 90; // 半短轴 (b)

const plutoGroup = (sunModel) => {
    const group = new THREE.Group();

    // 海王星球体
    const pluto = plutoModel();
    pluto.rotateX(-119.59 * (Math.PI / 180));
    pluto.position.set(sunModel.sunPosition.x + semiMajorAxis, sunModel.sunPosition.y, sunModel.sunPosition.z);
    group.add(pluto);

    // 海王星轨迹
    const track = plutoTrack(sunModel.sunPosition);
    group.add(track);

    group.rotation.z = 17 * (Math.PI / 180);

    // 海王星运动
    const animate = () => {
        plutoAutoroatation(pluto);
        plutoRevolution(pluto, sunModel);
    };

    return { group, animate };
};

// 冥王星模型
const plutoModel = () => {
    const group = new THREE.Group();
    // 创建冥王星几何体
    const plutoGeometry = new THREE.SphereGeometry(0.37, 64, 64); // 冥王星半径为0.37

    // 纹理加载器
    const plutoTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // 创建冥王星材质
    const plutoTexture = plutoTextureLoader.load("pluto_bg.jpg");
    plutoTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    plutoTexture.wrapS = THREE.RepeatWrapping;
    const plutoMaterial = new THREE.MeshStandardMaterial({ map: plutoTexture });

    // 创建冥王星网格
    const pluto = new THREE.Mesh(plutoGeometry, plutoMaterial);
    group.add(pluto);

    // 创建地轴线（红色）
    const axisGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0,
        2,
        0, // 顶端（超出地球表面）
        0,
        -2,
        0, // 底端
    ]);
    axisGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const axisLine = new THREE.Line(axisGeometry, axisMaterial);
    axisLine.name = "冥王星-地轴";
    group.add(axisLine);

    return group;
};

// 冥王星轨迹
const plutoTrack = (sunPosition) => {
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
    orbitLine.name = "冥王星-轨迹";

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

// 冥王星自转
const plutoAutoroatation = (pluto) => {
    pluto.rotation.y += 0.00023;
};

// 冥王星公转
const plutoRevolution = (pluto, sunModel) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * 0.0149; // 公转角度（控制速度）

    // 计算冥王星在椭圆轨道上的位置
    pluto.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
    pluto.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
};

export { plutoGroup };
