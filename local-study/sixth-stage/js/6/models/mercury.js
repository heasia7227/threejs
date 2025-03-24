import * as THREE from "three";

// 轨迹线上的点数
const numPoints = 100;
// 椭圆轨道参数
const semiMajorAxis = 12; // 半长轴 (a)
const semiMinorAxis = 8; // 半短轴 (b)

const mercuryGroup = (sunModel) => {
    const group = new THREE.Group();

    // 水星球体
    const mercury = mercuryModel();
    // 水星自转轴倾斜角度 2.03°
    mercury.rotation.x = THREE.MathUtils.degToRad(2.03);
    mercury.position.set(
        sunModel.sunPosition.x + semiMajorAxis,
        sunModel.sunPosition.y,
        sunModel.sunPosition.z + semiMajorAxis
    );
    group.add(mercury);

    // 水星轨迹
    const track = mercuryTrack(sunModel.sunPosition);
    group.add(track);

    group.rotation.z = 7 * (Math.PI / 180);

    const animate = () => {
        mercuryAutoroatation(mercury);
        mercuryRevolution(mercury, sunModel);
    };

    return { group, animate };
};

// 水星模型
const mercuryModel = () => {
    const group = new THREE.Group();

    // 创建水星几何体
    const mercuryGeometry = new THREE.SphereGeometry(0.38, 64, 64); // 水星半径为0.38

    // 纹理加载器
    const mercuryTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // 创建水星材质
    const mercuryTexture = mercuryTextureLoader.load("mercury_bg.jpg");
    mercuryTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    mercuryTexture.wrapS = THREE.RepeatWrapping;
    const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });

    // 创建水星网格
    const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    group.add(mercury);

    // 创建地轴线（红色）
    const axisGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0,
        1,
        0, // 顶端（超出地球表面）
        0,
        -1,
        0, // 底端
    ]);
    axisGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const axisLine = new THREE.Line(axisGeometry, axisMaterial);
    axisLine.name = "水星-地轴";
    group.add(axisLine);

    return group;
};

// 水星轨迹
const mercuryTrack = (sunPosition) => {
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
    orbitLine.name = "水星-轨迹";

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

// 水星自转
const mercuryAutoroatation = (mercury) => {
    mercury.rotation.y += 0.005;
};

// 水星公转
const mercuryRevolution = (mercury, sunModel) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * 0.157; // 公转角度（控制速度）

    // 计算水星在椭圆轨道上的位置
    mercury.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
    mercury.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
};

export { mercuryGroup };
