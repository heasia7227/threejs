import * as THREE from "three";

// 轨迹线上的点数
const numPoints = 100;
// 椭圆轨道参数
const semiMajorAxis = 18.9; // 半长轴 (a)
const semiMinorAxis = 18.7; // 半短轴 (b)

const venusGroup = (sunModel) => {
    const group = new THREE.Group();

    const venusG = new THREE.Group();
    // 金星球体
    const venus = venusModel();
    venusG.add(venus);

    // 金星大气层
    const venusA = venusAtmosphere();
    venusG.add(venusA);
    venusG.position.set(sunModel.sunPosition.x + semiMajorAxis, sunModel.sunPosition.y, sunModel.sunPosition.z);

    venusG.rotateX(-177.36 * (Math.PI / 180));
    group.add(venusG);

    // 金星轨迹
    const track = venusTrack(sunModel.sunPosition);
    group.add(track);

    group.rotation.z = 7 * (Math.PI / 180);

    const animate = () => {
        venusAutoroatation(venusG);
        venusRevolution(venusG, sunModel);
    };

    return { group, animate };
};

// 金星模型
const venusModel = () => {
    const group = new THREE.Group();
    // 创建金星几何体
    const venusGeometry = new THREE.SphereGeometry(0.95, 64, 64); // 金星半径为0.95

    // 纹理加载器
    const venusTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // 创建金星材质
    const venusTexture = venusTextureLoader.load("venus_surface.jpg"); // 加载金星纹理
    venusTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    venusTexture.wrapS = THREE.RepeatWrapping;
    const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });

    // 创建金星网格
    const venus = new THREE.Mesh(venusGeometry, venusMaterial);
    group.add(venus);

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
    axisLine.name = "金星-地轴";
    group.add(axisLine);

    return group;
};

// 金星大气层
const venusAtmosphere = () => {
    const venusGeometry = new THREE.SphereGeometry(0.96, 64, 64); // 金星半径为0.95

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
    orbitLine.name = "金星-轨迹";

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

// 金星自转
const venusAutoroatation = (venusG) => {
    venusG.rotation.y -= 0.0068; // 金星顺时针转
};

// 金星公转
const venusRevolution = (venusG, sunModel) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * 0.116; // 公转角度（控制速度）

    // 计算金星在椭圆轨道上的位置
    venusG.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
    venusG.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
};

export { venusGroup };
