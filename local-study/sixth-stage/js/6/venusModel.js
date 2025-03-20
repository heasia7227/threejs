import * as THREE from "three";

// 地球轨迹线上的点数
const numPoints = 100;
// 椭圆轨道参数
const semiMajorAxis = 10.2; // 半长轴 (a)
const semiMinorAxis = 7.2; // 半短轴 (b)

const venusGroup = (sunModel) => {
    const group = new THREE.Group();

    const venusGroup = new THREE.Group();
    // 金星球体
    const venus = venusModel();
    venusGroup.add(venus);

    // 金星大气层
    const venusA = venusAtmosphere();
    venusGroup.add(venusA);
    venusGroup.position.set(sunModel.sunPosition.x + semiMajorAxis, sunModel.sunPosition.y, sunModel.sunPosition.z);

    group.add(venusGroup);

    // 金星轨迹
    const track = venusTrack(sunModel.sunPosition);
    group.add(track);

    sunModel.sunLights.sunShineVenus.target = venus; // 设置金星的光源

    // 金星自转
    const venusAutoroatation = () => {
        venusGroup.rotation.y -= 0.001; // 金星顺时针转
    };

    // 金星公转
    const venusRevolution = () => {
        const time = Date.now() * 0.001; // 获取当前时间（秒）
        const angle = time * 0.1; // 公转角度（控制速度）

        // 计算金星在椭圆轨道上的位置
        venusGroup.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
        venusGroup.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
    };

    return { group, venusRevolution, venusAutoroatation };
};

// 金星模型
const venusModel = () => {
    // 创建金星几何体
    const venusGeometry = new THREE.SphereGeometry(0.95, 32, 32); // 金星半径为0.95

    // 纹理加载器
    const venusTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // 创建金星材质
    const venusTexture = venusTextureLoader.load("venus_surface.jpg"); // 加载金星纹理
    const venusMaterial = new THREE.MeshPhongMaterial({ map: venusTexture });

    // 创建金星网格
    const venus = new THREE.Mesh(venusGeometry, venusMaterial);

    return venus;
};

// 金星大气层
const venusAtmosphere = () => {
    const venusGeometry = new THREE.SphereGeometry(0.96, 32, 32); // 金星半径为0.95

    // 纹理加载器
    const venusTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    const venusTexture = venusTextureLoader.load("venus_atmosphere.jpg"); // 加载金星纹理
    const venusMaterial = new THREE.MeshPhongMaterial({
        map: venusTexture,
        transparent: true,
        opacity: 0.3, // 设置云层透明度
    });

    const venusAtmosphereMesh = new THREE.Mesh(venusGeometry, venusMaterial);

    return venusAtmosphereMesh;
};

// 金星轨迹
const venusTrack = (sunPosition) => {
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

export { venusGroup };
