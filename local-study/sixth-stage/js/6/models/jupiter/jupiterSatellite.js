import * as THREE from "three";

// 轨迹线上的点数
const numPoints = 100;
const satelliteData = [
    {
        name: "木卫一",
        radius: 0.29, // 球体半径
        semiMajorAxis: 3.41, // 半长轴
        semiMinorAxis: 3.4, // 半短轴
        autoroatationDip: 90, // 自转轴倾斜角度
        autoroatationAngle: 0.0024, // 自转角度
        revolutionSpeed: 0.0577, // 公转速度
        trackDip: 2.214, // 公转轨道倾角
    },
    {
        name: "木卫二",
        radius: 0.245, // 球体半径
        semiMajorAxis: 4.26, // 半长轴
        semiMinorAxis: 4.22, // 半短轴
        autoroatationDip: 2, // 自转轴倾斜角度
        autoroatationAngle: 0.0002, // 自转角度
        revolutionSpeed: 0.0457, // 公转速度
        trackDip: 0.34, // 公转轨道倾角
    },
    {
        name: "木卫三",
        radius: 0.413, // 球体半径
        semiMajorAxis: 5.57, // 半长轴
        semiMinorAxis: 5.56, // 半短轴
        autoroatationDip: 0.3, // 自转轴倾斜角度
        autoroatationAngle: 0.0006, // 自转角度
        revolutionSpeed: 0.0363, // 公转速度
        trackDip: 0.2, // 公转轨道倾角
    },
    {
        name: "木卫四",
        radius: 0.378, // 球体半径
        semiMajorAxis: 8.32, // 半长轴
        semiMinorAxis: 8.23, // 半短轴
        autoroatationDip: 0, // 自转轴倾斜角度
        autoroatationAngle: 0.0012, // 自转角度
        revolutionSpeed: 0.0323, // 公转速度
        trackDip: 0.02, // 公转轨道倾角
    },
];

const satelliteGroup = () => {
    const group = new THREE.Group();

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    // 纹理加载器
    const textureLoader = new THREE.TextureLoader().setPath("./textures/");
    // 暂时统一使用月球纹理
    const texture = textureLoader.load("moon.jpg");
    texture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    texture.wrapS = THREE.RepeatWrapping;

    const material = new THREE.MeshStandardMaterial({
        map: texture,
    });

    satelliteData.forEach((item) => {
        const satelliteGroup = new THREE.Group();
        const satellite = new THREE.Mesh(geometry, material);
        satellite.scale.set(item.radius, item.radius, item.radius);
        satellite.position.set(item.semiMajorAxis, 0, item.semiMinorAxis);

        // 自转轴倾斜角度
        if (item.autoroatationDip != 0) {
            satellite.rotation.x = THREE.MathUtils.degToRad(item.autoroatationDip);
        }

        item.sphere = satellite;
        satelliteGroup.add(satellite);

        const track = satelliteTrack(item);
        satelliteGroup.add(track);
        satelliteGroup.rotation.z = THREE.MathUtils.degToRad(item.trackDip);

        group.add(satelliteGroup);
    });

    const animate = () => {
        satelliteData.forEach((item) => {
            satelliteAutoroatation(item);
            satelliteRevolution(item);
        });
    };

    return { group, animate };
};

// 木星轨迹
const satelliteTrack = (item) => {
    const orbitPoints = [];
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        orbitPoints.push(
            item.semiMajorAxis * Math.cos(angle), // x
            0, // y
            item.semiMinorAxis * Math.sin(angle) // z
        );
    }

    const orbitGeometry = new THREE.BufferGeometry();
    orbitGeometry.setAttribute("position", new THREE.Float32BufferAttribute(orbitPoints, 3));

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.name = `${item.name}-轨迹`;

    return orbitLine;
};

// 木星自转
const satelliteAutoroatation = (item) => {
    item.sphere.rotation.y += item.autoroatationAngle;
};

// 木星公转
const satelliteRevolution = (item) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * item.revolutionSpeed * 10; // 公转角度（控制速度）

    // 计算木星在椭圆轨道上的位置
    item.sphere.position.x = item.semiMajorAxis * Math.sin(angle);
    item.sphere.position.z = item.semiMinorAxis * Math.cos(angle);
};

export { satelliteGroup };
