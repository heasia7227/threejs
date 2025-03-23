import * as THREE from "three";

// 轨迹线上的点数
const numPoints = 100;
// 椭圆轨道参数
const semiMajorAxis = 100; // 半长轴 (a)
const semiMinorAxis = 80; // 半短轴 (b)

const neptuneGroup = (sunModel) => {
    const group = new THREE.Group();

    // 海王星球体
    const neptune = neptuneModel();
    neptune.position.set(sunModel.sunPosition.x + semiMajorAxis, sunModel.sunPosition.y, sunModel.sunPosition.z);
    group.add(neptune);

    // 海王星轨迹
    const track = neptuneTrack(sunModel.sunPosition);
    group.add(track);

    // 海王星运动
    const animate = () => {
        neptuneAutoroatation(neptune);
        neptuneRevolution(neptune, sunModel);
    };

    return { group, animate };
};

// 海王星模型
const neptuneModel = () => {
    // 创建海王星几何体
    const neptuneGeometry = new THREE.SphereGeometry(1.5, 64, 64); // 海王星半径为1.5

    // 纹理加载器
    const neptuneTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // 创建海王星材质
    const neptuneTexture = neptuneTextureLoader.load("neptune_bg.jpg");
    neptuneTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    neptuneTexture.wrapS = THREE.RepeatWrapping;
    const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });

    // 创建海王星网格
    const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);

    return neptune;
};

// 天王星轨迹
const neptuneTrack = (sunPosition) => {
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

// 海王星自转
const neptuneAutoroatation = (neptune) => {
    neptune.rotation.y += 0.001;
};

// 海王星公转
const neptuneRevolution = (neptune, sunModel) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * 0.05; // 公转角度（控制速度）

    // 计算海王星在椭圆轨道上的位置
    neptune.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
    neptune.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
};

export { neptuneGroup };
