import * as THREE from "three";

// 轨迹线上的点数
const numPoints = 100;
// 椭圆轨道参数
const semiMajorAxis = 42; // 半长轴 (a)
const semiMinorAxis = 30; // 半短轴 (b)

const marsGroup = (sunModel) => {
    const group = new THREE.Group();

    // 火星球体
    const mars = marsModel();
    mars.rotateX(-25.19 * (Math.PI / 180));
    mars.position.set(sunModel.sunPosition.x + semiMajorAxis, sunModel.sunPosition.y, sunModel.sunPosition.z);
    group.add(mars);

    // 火星轨迹
    const track = marsTrack(sunModel.sunPosition);
    group.add(track);

    const animate = () => {
        marsAutoroatation(mars);
        marsRevolution(mars, sunModel);
    };

    return { group, animate };
};

// 火星模型
const marsModel = () => {
    const group = new THREE.Group();
    // 创建火星几何体
    const marsGeometry = new THREE.SphereGeometry(0.53, 64, 64); // 火星半径为0.53

    // 纹理加载器
    const marsTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // 创建火星材质
    const marsTexture = marsTextureLoader.load("mars_bg.jpg");
    marsTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    marsTexture.wrapS = THREE.RepeatWrapping;
    const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });

    // 创建火星网格
    const mars = new THREE.Mesh(marsGeometry, marsMaterial);
    group.add(mars);

    // 创建地轴线（红色）
    const axisGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0,
        1,
        0, // 顶端（超出星球表面）
        0,
        -1,
        0, // 底端
    ]);
    axisGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const axisLine = new THREE.Line(axisGeometry, axisMaterial);
    axisLine.name = "火星-地轴";
    group.add(axisLine);

    return group;
};

// 火星轨迹
const marsTrack = (sunPosition) => {
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
    orbitLine.name = "火星-轨迹";

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

// 火星自转
const marsAutoroatation = (mars) => {
    mars.rotation.y += 0.0041;
};

// 火星公转
const marsRevolution = (mars, sunModel) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * 0.08; // 公转角度（控制速度）

    // 计算火星在椭圆轨道上的位置
    mars.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
    mars.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
};

export { marsGroup };
