import * as THREE from "three";
import * as ThreeWebgpu from "three/webgpu";
import {
    mix,
    max,
    step,
    vec3,
    vec4,
    texture,
    uv,
    output,
    uniform,
    color,
    normalWorld,
    positionWorld,
    cameraPosition,
    bumpMap,
    normalize,
} from "three/tsl";
import { moonGroup } from "./moonModel.js";

// 大气层白天颜色
const atmosphereDayColor = uniform(color("#4db2ff"));
// 大气层夜晚颜色（暮色）
const atmosphereTwilightColor = uniform(color("#bc490b"));
const roughnessLow = uniform(0.25);
const roughnessHigh = uniform(0.35);
// 贴图，加载器
const textureLoader = new THREE.TextureLoader().setPath("./textures/");
// 地球轨迹线上的点数
const numPoints = 100;
// 地球公转半长轴 (a)
const semiMajorAxis = 28;
// 地球公转半短轴 (b)
const semiMinorAxis = 20;

const earthGroup = (sunModel) => {
    // 计算太阳照射地球的方向
    const sunOrientation = normalWorld.dot(normalize(sunModel.sunLights.sunShineEarth.position)).toVar();

    const group = new THREE.Group();

    const earthEcology = new THREE.Group();
    const earthGroup = new THREE.Group();
    // 地球
    const earth = earthModel(sunOrientation);
    earthGroup.add(earth);

    // 地球大气层
    const atmosphere = atmosphereModel(sunOrientation, earth);
    earthGroup.add(atmosphere);

    // 设置地球的倾斜角度
    earthGroup.rotateX(-Math.PI / 7.6);
    sunModel.sunLights.sunShineEarth.target = earthGroup; // 设置地球的光源
    // 设置地球的位置
    earthEcology.position.set(sunModel.sunPosition.x + semiMajorAxis, sunModel.sunPosition.y, sunModel.sunPosition.z);
    earthEcology.add(earthGroup);

    // 月亮
    const { group: moonG, moonRevolution } = moonGroup(earth);
    sunModel.sunLights.sunShineMoon.target = moonG; // 设置月亮的光源
    earthEcology.add(moonG);
    group.add(earthEcology);

    // 地球轨迹
    const track = earthTrack(sunModel.sunPosition);
    group.add(track);

    // 地球自转
    const earthAutoroatation = () => {
        earthGroup.rotation.y += 0.001;
    };

    // 地球公转
    const earthRevolution = () => {
        // 更新地球的位置（绕太阳椭圆公转）
        const time = Date.now() * 0.001; // 获取当前时间（秒）
        const angle = time * 0.1; // 公转角度（控制速度）

        // 计算地球在椭圆轨道上的位置
        earthEcology.position.x = semiMajorAxis * Math.sin(angle) + sunModel.sunPosition.x;
        earthEcology.position.z = semiMinorAxis * Math.cos(angle) + sunModel.sunPosition.z;

        // // 计算太阳照射地球的方向
        // const sunOrientation = normalWorld.dot(normalize(sunModel.sunLights.sunShineEarth.position)).toVar();

        // const bumpRoughnessClouds = getBumpRoughnessClouds();
        // earth.material.colorNode = getTextureDay(bumpRoughnessClouds.cloudsStrength); // 白天的贴图
        // earth.material.outputNode = getTextureNight(sunOrientation); // 夜晚的贴图
        // earth.material.roughnessNode = getTextureRoughness(bumpRoughnessClouds); // 粗糙度的贴图
        // earth.material.normalNode = getTextureNormal(bumpRoughnessClouds); // 法线的贴图

        // const fresnel = getFresnel();
        // let alpha = fresnel.remap(0.73, 1, 1, 0).pow(3);
        // alpha = alpha.mul(sunOrientation.smoothstep(-0.5, 1));

        // // 大气层颜色
        // const atmosphereColor = getAtmosphereColor(sunOrientation);
        // atmosphere.material.outputNode = vec4(atmosphereColor, alpha);
    };

    return { group, earthAutoroatation, earthRevolution, moonRevolution };
};

// 地球模型
const earthModel = (sunOrientation) => {
    // 地球
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

    // 地球材质
    // 在Three.js中，PMREM主要用于环境映射照明。使用标准的HDRI纹理时，可能会遇到周围的照明问题，导致阴影完全黑色。而使用PMREMGenerator可以解决这个问题
    // MeshStandardNodeMaterial 属于 PMREM
    const earthMaterial = new ThreeWebgpu.MeshStandardNodeMaterial();

    const bumpRoughnessClouds = getBumpRoughnessClouds();

    earthMaterial.colorNode = getTextureDay(bumpRoughnessClouds.cloudsStrength); // 白天的贴图
    earthMaterial.outputNode = getTextureNight(sunOrientation); // 夜晚的贴图
    earthMaterial.roughnessNode = getTextureRoughness(bumpRoughnessClouds); // 粗糙度的贴图
    earthMaterial.normalNode = getTextureNormal(bumpRoughnessClouds); // 法线的贴图

    // 地球网格模型
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

    return earthMesh;
};

// 大气层模型
const atmosphereModel = (sunOrientation, earthModel) => {
    const atmosphereMaterial = new ThreeWebgpu.MeshBasicNodeMaterial({ side: THREE.BackSide, transparent: true });

    const fresnel = getFresnel();
    let alpha = fresnel.remap(0.73, 1, 1, 0).pow(3);
    alpha = alpha.mul(sunOrientation.smoothstep(-0.5, 1));

    // 大气层颜色
    const atmosphereColor = getAtmosphereColor(sunOrientation);
    atmosphereMaterial.outputNode = vec4(atmosphereColor, alpha);

    const atmosphereMesh = new THREE.Mesh(earthModel.geometry, atmosphereMaterial);
    atmosphereMesh.scale.setScalar(1.04);

    return atmosphereMesh;
};

// 地球轨迹
const earthTrack = (sunPosition) => {
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

const getFresnel = () => {
    const viewDirection = positionWorld.sub(cameraPosition).normalize();
    const fresnel = viewDirection.dot(normalWorld).abs().oneMinus().toVar();

    return fresnel;
};

// 大气层颜色
const getAtmosphereColor = (sunOrientation) => {
    // 大气层颜色
    const atmosphereColor = mix(atmosphereTwilightColor, atmosphereDayColor, sunOrientation.smoothstep(-0.25, 0.75));

    return atmosphereColor;
};

const getTextureDayJpg = () => {
    // 贴图, 白天
    const dayTexture = textureLoader.load("earth_day_4096.jpg");
    dayTexture.colorSpace = THREE.SRGBColorSpace; // 设置为SRGB颜色空间
    dayTexture.anisotropy = 8; // 数值越大Map越清晰，默认值1

    return dayTexture;
};

const getTextureNightJpg = () => {
    const nightTexture = textureLoader.load("earth_night_4096.jpg");
    nightTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.anisotropy = 8;

    return nightTexture;
};

const getTextureBumpRoughnessCloudsJpg = () => {
    const bumpRoughnessCloudsTexture = textureLoader.load("earth_bump_roughness_clouds_4096.jpg");
    bumpRoughnessCloudsTexture.anisotropy = 8;

    return bumpRoughnessCloudsTexture;
};

// 云层的影响力和贴图
const getBumpRoughnessClouds = () => {
    // 贴图，云层
    const bumpRoughnessCloudsTexture = getTextureBumpRoughnessCloudsJpg();

    // uv 创建一个UV属性Node
    // texture: 创建一个texture node，返回TextureNode
    // smoothstep: 在两个值之间执行埃尔米特插值，返回Node
    const cloudsStrength = texture(bumpRoughnessCloudsTexture, uv()).b.smoothstep(0.2, 1);
    return { cloudsStrength, bumpRoughnessCloudsTexture };
};

// 白天的贴图
const getTextureDay = (cloudsStrength) => {
    // 贴图, 白天
    const dayTexture = getTextureDayJpg();

    // colorNode: 设置轮廓颜色，Node<vec3>类型
    // mix: 在两个值之间线性插值，返回Node
    // vec3: ???
    // mul: 返回两个或多个值的乘法
    const colorNode = mix(texture(dayTexture), vec3(1), cloudsStrength.mul(2));

    return colorNode;
};

// 夜晚的贴图
const getTextureNight = (sunOrientation) => {
    // 贴图，夜晚
    const nightTexture = getTextureNightJpg();

    // 大气层颜色
    const atmosphereColor = getAtmosphereColor(sunOrientation);

    const fresnel = getFresnel();
    // 夜晚贴图
    const night = texture(nightTexture);
    // 太阳光白天的影响力
    const sunDayStrength = sunOrientation.smoothstep(-0.25, 0.5);

    // 大气层白天的影响力
    const atmosphereDayStrength = sunOrientation.smoothstep(-0.5, 1);
    const atmosphereMix = atmosphereDayStrength.mul(fresnel.pow(2)).clamp(0, 1);

    let finalOutput = mix(night.rgb, output.rgb, sunDayStrength);
    finalOutput = mix(finalOutput, atmosphereColor, atmosphereMix);

    // outputNode: 设置最终输出的材质
    // vec4: ???
    const outputNode = vec4(finalOutput, output.a);

    return outputNode;
};

// 粗糙度的贴图
const getTextureRoughness = (bumpRoughnessClouds) => {
    const roughness = max(
        texture(bumpRoughnessClouds.bumpRoughnessCloudsTexture).g,
        step(0.01, bumpRoughnessClouds.cloudsStrength)
    );
    const roughnessNode = roughness.remap(0, 1, roughnessLow, roughnessHigh);
    return roughnessNode;
};

// 法线的贴图
const getTextureNormal = (bumpRoughnessClouds) => {
    const bumpElevation = max(
        texture(bumpRoughnessClouds.bumpRoughnessCloudsTexture).r,
        bumpRoughnessClouds.cloudsStrength
    );
    const normalNode = bumpMap(bumpElevation);

    return normalNode;
};

export { earthGroup };
