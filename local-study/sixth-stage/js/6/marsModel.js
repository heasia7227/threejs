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
    mars.position.set(sunModel.sunPosition.x + semiMajorAxis, sunModel.sunPosition.y, sunModel.sunPosition.z);
    group.add(mars);

    // 火星轨迹
    const track = marsTrack(sunModel.sunPosition);
    group.add(track);

    // 火星自转
    const marsAutoroatation = () => {
        mars.rotation.y += 0.001;
    };

    // 火星公转
    const marsRevolution = () => {
        const time = Date.now() * 0.001; // 获取当前时间（秒）
        const angle = time * 0.1; // 公转角度（控制速度）

        // 计算火星在椭圆轨道上的位置
        mars.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
        mars.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
    };

    return { group, marsRevolution, marsAutoroatation };
};

// 火星模型
const marsModel = () => {
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

    return mars;
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

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

export { marsGroup };
