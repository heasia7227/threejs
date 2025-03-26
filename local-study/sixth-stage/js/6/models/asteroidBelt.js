import * as THREE from "three";

// 椭圆轨道参数
const semiMajorAxis = [43.3 + 4, 70 - 4]; // 半长轴 (a)
const semiMinorAxis = [35.9 + 4, 67.5 - 4]; // 半短轴 (b)

const asteroidBeltGroup = (sunModel) => {
    const group = new THREE.Group();

    const asteroidGeometry = new THREE.IcosahedronGeometry(1);
    const asteroidMaterials = [
        new THREE.MeshPhongMaterial({ color: 0x555555 }),
        new THREE.MeshPhongMaterial({ color: 0x666666 }),
        new THREE.MeshPhongMaterial({ color: 0x777777 }),
    ];

    for (let i = 0; i < 2000; i++) {
        const material = asteroidMaterials[Math.floor(Math.random() * 3)];
        const asteroid = new THREE.Mesh(asteroidGeometry, material);

        const radiusX = Math.random() * (semiMajorAxis[1] - semiMajorAxis[0]) + semiMajorAxis[0];
        const radiusY = Math.random() * (semiMinorAxis[1] - semiMinorAxis[0]) + semiMinorAxis[0];

        const angle = Math.random() * Math.PI * 2;
        // 设置初始位置
        asteroid.position.x = radiusX * Math.cos(angle) + sunModel.sunPosition.x;
        asteroid.position.z = radiusY * Math.sin(angle) + sunModel.sunPosition.z;
        asteroid.position.y = sunModel.sunPosition.y;

        const scale = Math.random() * 0.3 + 0.1;
        asteroid.scale.set(scale, scale, scale);

        group.add(asteroid);
    }

    group.rotation.z = 7 * (Math.PI / 180);
    return { group };
};

export { asteroidBeltGroup };
