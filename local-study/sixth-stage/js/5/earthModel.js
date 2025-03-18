import * as THREE from "three";
import {
    mix,
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
} from "three/tsl";

// 大气层白天颜色
const atmosphereDayColor = uniform(color("#4db2ff"));
// 大气层夜晚颜色（暮色）
const atmosphereTwilightColor = uniform(color("#bc490b"));

// 地球模型
const earthModel = (sunModel) => {
    // 地球
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

    // 地球材质
    // 在Three.js中，PMREM主要用于环境映射照明。使用标准的HDRI纹理时，可能会遇到周围的照明问题，导致阴影完全黑色。而使用PMREMGenerator可以解决这个问题
    // MeshStandardNodeMaterial 属于 PMREM
    const earthMaterial = new THREE.MeshStandardNodeMaterial();
    earthMaterial.colorNode = getTextureDay(); // 白天的贴图
    earthMaterial.outputNode = getTextureNight(sunModel); // 夜晚的贴图

    // 地球网格模型
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

    earthMesh.geometry;

    // 设置地球的倾斜角度
    earthMesh.rotateX(-Math.PI / 7.6);

    return earthMesh;
};

// 大气层模型
const atmosphereModel = (sunModel, earthModel) => {
    const atmosphereMaterial = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide, transparent: true });

    const fresnel = getFresnel();
    let alpha = fresnel.remap(0.73, 1, 1, 0).pow(3);
    alpha = alpha.mul(sunModel.sunOrientation.smoothstep(-0.5, 1));

    // 大气层颜色
    const atmosphereColor = getAtmosphereColor(sunModel);
    atmosphereMaterial.outputNode = vec4(atmosphereColor, alpha);

    const atmosphereMesh = new THREE.Mesh(earthModel.geometry, atmosphereMaterial);
    atmosphereMesh.scale.setScalar(1.04);

    return atmosphereMesh;
};

const getFresnel = () => {
    const viewDirection = positionWorld.sub(cameraPosition).normalize();
    const fresnel = viewDirection.dot(normalWorld).abs().oneMinus().toVar();

    return fresnel;
};

// 大气层颜色
const getAtmosphereColor = (sunModel) => {
    // 太阳光的方向
    const sunOrientation = sunModel.sunOrientation;

    // 大气层颜色
    const atmosphereColor = mix(atmosphereTwilightColor, atmosphereDayColor, sunOrientation.smoothstep(-0.25, 0.75));

    return atmosphereColor;
};

// 白天的贴图
const getTextureDay = () => {
    // 贴图，加载器
    const textureLoader = new THREE.TextureLoader().setPath("./textures/");

    // 贴图, 白天
    const dayTexture = textureLoader.load("earth_day_4096.jpg");
    dayTexture.colorSpace = THREE.SRGBColorSpace; // 设置为SRGB颜色空间
    dayTexture.anisotropy = 8; // 数值越大Map越清晰，默认值1

    // 贴图，云层
    const bumpRoughnessCloudsTexture = textureLoader.load("earth_bump_roughness_clouds_4096.jpg");
    bumpRoughnessCloudsTexture.anisotropy = 8;

    // uv 创建一个UV属性Node
    // texture: 创建一个texture node，返回TextureNode
    // smoothstep: 在两个值之间执行埃尔米特插值，返回Node
    const cloudsStrength = texture(bumpRoughnessCloudsTexture, uv()).b.smoothstep(0.2, 1);

    // colorNode: 设置轮廓颜色，Node<vec3>类型
    // mix: 在两个值之间线性插值，返回Node
    // vec3: ???
    // mul: 返回两个或多个值的乘法
    const colorNode = mix(texture(dayTexture), vec3(1), cloudsStrength.mul(2));

    return colorNode;
};

// 夜晚的贴图
const getTextureNight = (sunModel) => {
    // 贴图，加载器
    const textureLoader = new THREE.TextureLoader().setPath("./textures/");

    // 贴图，夜晚
    const nightTexture = textureLoader.load("earth_night_4096.jpg");
    nightTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.anisotropy = 8;

    // 大气层颜色
    const atmosphereColor = getAtmosphereColor(sunModel);

    const fresnel = getFresnel();
    // 夜晚贴图
    const night = texture(nightTexture);
    // 太阳光白天的影响力
    const sunDayStrength = sunModel.sunOrientation.smoothstep(-0.25, 0.5);

    // 大气层白天的影响力
    const atmosphereDayStrength = sunModel.sunOrientation.smoothstep(-0.5, 1);
    const atmosphereMix = atmosphereDayStrength.mul(fresnel.pow(2)).clamp(0, 1);

    let finalOutput = mix(night.rgb, output.rgb, sunDayStrength);
    finalOutput = mix(finalOutput, atmosphereColor, atmosphereMix);

    // outputNode: 设置最终输出的材质
    // vec4: ???
    const outputNode = vec4(finalOutput, output.a);

    return outputNode;
};

export { earthModel, atmosphereModel };
