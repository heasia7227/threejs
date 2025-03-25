import * as THREE from "three";

// 月球轨迹线上的点数
const numPoints = 100;
const semiMajorAxis = 4.5; // 半长轴 (a)
const semiMinorAxis = 4; // 半短轴 (b)
const eccentricity = Math.sqrt(1 - semiMinorAxis ** 2 / semiMajorAxis ** 2); // 偏心率 (e)
const focusDistance = semiMajorAxis * eccentricity; // 焦点到椭圆中心的距离 (c)

const moonGroup = (earth) => {
    const group = new THREE.Group();

    // 月亮球体
    const moon = moonModel(earth);
    group.add(moon);

    // 月亮轨迹
    const track = moonTrack();
    group.add(track);

    group.rotation.z = THREE.MathUtils.degToRad(5.145);

    // 月亮公转和自转
    const animate = () => {
        moonRevolution(earth, moon);
    };

    return { group, animate };
};

// 月球模型
const moonModel = (earth) => {
    // 月球
    const moonGeometry = new THREE.SphereGeometry(0.27, 64, 64);
    // 纹理加载器
    const moonTextureLoader = new THREE.TextureLoader().setPath("./textures/");
    // .load()方法加载图像，返回一个纹理对象Texture
    const moonTexture = moonTextureLoader.load("moon.jpg");
    // 注意最新版本，webgl渲染器默认编码方式已经改变，为了避免色差，纹理对象编码方式要修改为THREE.SRGBColorSpace
    moonTexture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
    moonTexture.wrapS = THREE.RepeatWrapping;

    const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture,
    });
    // 网格模型
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    // 设置月球的初始位置
    earth.position.copy(moonMesh.position);
    moonMesh.position.x += semiMajorAxis;

    return moonMesh;
};

// 月球公转
const moonRevolution = (earth, moon) => {
    const time = Date.now() * 0.001; // 获取当前时间（秒）
    const angle = time * 0.34; // 公转角度（控制速度）

    // 计算月球在椭圆轨道上的位置
    moon.position.x = semiMajorAxis * Math.sin(angle) + focusDistance;
    moon.position.z = semiMinorAxis * Math.cos(angle);

    // 因为潮汐锁定，月球公转周期和自转周期一样。有一面永远对着地球
    moon.lookAt(earth.position);
};

// 月球轨迹
const moonTrack = () => {
    const orbitPoints = [];
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        orbitPoints.push(
            semiMajorAxis * Math.sin(angle) + focusDistance, // x
            0, // y
            semiMinorAxis * Math.cos(angle) // z
        );
    }

    const orbitGeometry = new THREE.BufferGeometry();
    orbitGeometry.setAttribute("position", new THREE.Float32BufferAttribute(orbitPoints, 3));

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.name = "月球-轨迹";

    return orbitLine;
};

export { moonGroup };
