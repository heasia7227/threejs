import * as THREE from "three";

// 轨迹线上的点数
const numPoints = 100;
// 椭圆轨道参数
const semiMajorAxis = 56; // 半长轴 (a)
const semiMinorAxis = 45; // 半短轴 (b)

const jupiterGroup = (sunModel) => {
    const group = new THREE.Group();

    // 木星球体
    const jupiter = jupiterModel();
    jupiter.position.set(sunModel.sunPosition.x + semiMajorAxis, sunModel.sunPosition.y, sunModel.sunPosition.z);
    group.add(jupiter);

    // 木星轨迹
    const track = jupiterTrack(sunModel.sunPosition);
    group.add(track);

    // 木星自转
    const jupiterAutoroatation = () => {
        jupiter.rotation.y += 0.001;
    };

    // 木星公转
    const jupiterRevolution = () => {
        const time = Date.now() * 0.001; // 获取当前时间（秒）
        const angle = time * 0.1; // 公转角度（控制速度）

        // 计算木星在椭圆轨道上的位置
        jupiter.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
        jupiter.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
    };

    return { group, jupiterRevolution, jupiterAutoroatation };
};

// 木星模型
const jupiterModel = () => {
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

    return jupiter;
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

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

export { jupiterGroup };
