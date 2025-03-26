import * as THREE from "three";

// 轨迹线上的点数
const numPoints = 100;
const satelliteData = [
    {
        name: "土卫一",
        radius: 0.029, // 球体半径
        semiMajorAxis: 3.79, // 半长轴
        semiMinorAxis: 3.62, // 半短轴
        autoroatationDip: 0.005, // 自转轴倾斜角度
        autoroatationAngle: 0.004, // 自转角度
        revolutionSpeed: 0.0183, // 公转速度
        trackDip: 1.573, // 公转轨道倾角
    },
    {
        name: "土卫二",
        radius: 0.04, // 球体半径
        semiMajorAxis: 3.88, // 半长轴
        semiMinorAxis: 3.6, // 半短轴
        autoroatationDip: 27, // 自转轴倾斜角度
        autoroatationAngle: 0.003, // 自转角度
        revolutionSpeed: 0.0183, // 公转速度
        trackDip: 4.978, // 公转轨道倾角
    },
    {
        name: "土卫三",
        radius: 0.083, // 球体半径
        semiMajorAxis: 3.77, // 半长轴
        semiMinorAxis: 3.6, // 半短轴
        autoroatationDip: 32.9, // 自转轴倾斜角度
        autoroatationAngle: 0.004, // 自转角度
        revolutionSpeed: 0.0182, // 公转速度
        trackDip: 10.055, // 公转轨道倾角
    },
    {
        name: "土卫四",
        radius: 0.083, // 球体半径
        semiMajorAxis: 4.26, // 半长轴
        semiMinorAxis: 4.26, // 半短轴
        autoroatationDip: 12.75, // 自转轴倾斜角度
        autoroatationAngle: 0.003, // 自转角度
        revolutionSpeed: 0.018, // 公转速度
        trackDip: 14.222, // 公转轨道倾角
    },
    {
        name: "土卫五",
        radius: 0.12, // 球体半径
        semiMajorAxis: 4.76, // 半长轴
        semiMinorAxis: 4.76, // 半短轴
        autoroatationDip: 26.33, // 自转轴倾斜角度
        autoroatationAngle: 0.003, // 自转角度
        revolutionSpeed: 0.0179, // 公转速度
        trackDip: 26.931, // 公转轨道倾角
    },
    {
        name: "土卫六",
        radius: 0.4, // 球体半径
        semiMajorAxis: 7.08, // 半长轴
        semiMinorAxis: 7.07, // 半短轴
        autoroatationDip: 26.73, // 自转轴倾斜角度
        autoroatationAngle: 0.0003, // 自转角度
        revolutionSpeed: 0.0175, // 公转速度
        trackDip: 2.04, // 公转轨道倾角
    },
    {
        name: "土卫七",
        radius: 0.022, // 球体半径
        semiMajorAxis: 7.9, // 半长轴
        semiMinorAxis: 7.8, // 半短轴
        autoroatationDip: 176.7, // 自转轴倾斜角度
        autoroatationAngle: 0, // 自转角度
        revolutionSpeed: 0.0187, // 公转速度
        trackDip: 153.2, // 公转轨道倾角
    },
    {
        name: "土卫八",
        radius: 0.175, // 球体半径
        semiMajorAxis: 8, // 半长轴
        semiMinorAxis: 8, // 半短轴
        autoroatationDip: 26.9, // 自转轴倾斜角度
        autoroatationAngle: 0.0004, // 自转角度
        revolutionSpeed: 0.016, // 公转速度
        trackDip: 39.8, // 公转轨道倾角
    },
    {
        name: "土卫九",
        radius: 0.036, // 球体半径
        semiMajorAxis: 9, // 半长轴
        semiMinorAxis: 8.5, // 半短轴
        autoroatationDip: 138, // 自转轴倾斜角度
        autoroatationAngle: 0.002, // 自转角度
        revolutionSpeed: 0.0184, // 公转速度
        trackDip: 151.4, // 公转轨道倾角
    },
    {
        name: "土卫十",
        radius: 0.029, // 球体半径
        semiMajorAxis: 3.53, // 半长轴
        semiMinorAxis: 3.53, // 半短轴
        autoroatationDip: 0, // 自转轴倾斜角度
        autoroatationAngle: 0, // 自转角度
        revolutionSpeed: 0.0166, // 公转速度
        trackDip: 15.5, // 公转轨道倾角
    },
    {
        name: "土卫十一",
        radius: 0.028, // 球体半径
        semiMajorAxis: 3.5, // 半长轴
        semiMinorAxis: 3.5, // 半短轴
        autoroatationDip: 151, // 自转轴倾斜角度
        autoroatationAngle: 0, // 自转角度
        revolutionSpeed: 0.0147, // 公转速度
        trackDip: 150.3, // 公转轨道倾角
    },
    {
        name: "土卫十二",
        radius: 0.024, // 球体半径
        semiMajorAxis: 4.26, // 半长轴
        semiMinorAxis: 4.26, // 半短轴
        autoroatationDip: 0, // 自转轴倾斜角度
        autoroatationAngle: 0, // 自转角度
        revolutionSpeed: 0.0138, // 公转速度
        trackDip: 14.6, // 公转轨道倾角
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

// 卫星轨迹
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

// 卫星自转
const satelliteAutoroatation = (item) => {
    item.sphere.rotation.y += item.autoroatationAngle;
};

// 卫星公转
const satelliteRevolution = (item) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * item.revolutionSpeed * 10; // 公转角度（控制速度）

    // 计算卫星在椭圆轨道上的位置
    item.sphere.position.x = item.semiMajorAxis * Math.sin(angle);
    item.sphere.position.z = item.semiMinorAxis * Math.cos(angle);
};

export { satelliteGroup };
