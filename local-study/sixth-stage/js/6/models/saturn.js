import * as THREE from "three";

const radius = 1.8;

// 轨迹线上的点数
const numPoints = 100;
// 椭圆轨道参数
const semiMajorAxis = 88; // 半长轴 (a)
const semiMinorAxis = 83; // 半短轴 (b)

const saturnGroup = (sunModel) => {
    const group = new THREE.Group();

    // 土星球体
    const saturn = saturnModel();
    saturn.rotateX(-26.73 * (Math.PI / 180));
    // 设置土星倾斜角度26.73°
    saturn.rotation.x = THREE.MathUtils.degToRad(26.73);
    saturn.position.set(
        sunModel.sunPosition.x + semiMajorAxis,
        sunModel.sunPosition.y,
        sunModel.sunPosition.z + semiMinorAxis
    );
    group.add(saturn);

    // 土星轨迹
    const track = saturnTrack(sunModel.sunPosition);
    group.add(track);

    group.rotation.z = 7 * (Math.PI / 180);

    const animate = () => {
        saturnAutoroatation(saturn);
        saturnRevolution(saturn, sunModel);
    };

    return { group, animate };
};

// 土星模型
const saturnModel = () => {
    const group = new THREE.Group();

    // 创建土星几何体
    const saturnGeometry = new THREE.SphereGeometry(radius, 64, 64); // 土星半径为1.5

    // 纹理加载器
    const saturnTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // 创建土星材质
    const saturnTexture = saturnTextureLoader.load("saturn_bg.jpg");
    saturnTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    saturnTexture.wrapS = THREE.RepeatWrapping;
    const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });

    // 创建土星网格
    const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
    saturn.castShadow = true;
    group.add(saturn);

    //土星环
    const rings = saturnRings();
    group.add(rings);

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
    axisLine.name = "土星-地轴";
    group.add(axisLine);

    return group;
};

// 土星环
const saturnRings = () => {
    const group = new THREE.Group();

    let innerRadius = radius * 1.2;

    [0.5, 0.3, 0.1].forEach((ringRadius) => {
        const outerRadius = innerRadius + ringRadius;
        const saturnRingGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64, 1);
        const saturnRingMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3 + ringRadius,
        });
        const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
        saturnRing.receiveShadow = true; // 平面接收阴影
        saturnRing.rotation.x = -Math.PI / 2;

        group.add(saturnRing);

        innerRadius = outerRadius + 0.03;
    });

    return group;
};

// 土星轨迹
const saturnTrack = (sunPosition) => {
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
    orbitLine.name = "土星-轨迹";

    orbitLine.position.x += sunPosition.x;
    orbitLine.position.z += sunPosition.z;

    return orbitLine;
};

// 土星自转
const saturnAutoroatation = (saturn) => {
    saturn.rotation.y += 0.029;
};

// 土星公转
const saturnRevolution = (saturn, sunModel) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * 0.032; // 公转角度（控制速度）

    // 计算土星在椭圆轨道上的位置
    saturn.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
    saturn.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;
};

export { saturnGroup };
