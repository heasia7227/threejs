import * as THREE from "three";

const sunModel = () => {
    // 太阳位置
    const sunPosition = new THREE.Vector3(0, 0, 10);

    // 太阳照射, 使用点光源模拟
    const sunLight = new THREE.PointLight("#ffffff", 5, 10000, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024; // 阴影贴图宽度
    sunLight.shadow.mapSize.height = 1024; // 阴影贴图高度
    sunLight.shadow.camera.near = 0.5; // 阴影相机近裁剪面
    sunLight.shadow.camera.far = 10000; // 阴影相机远裁剪面
    sunLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);

    // 纹理加载器
    const sunTextureLoader = new THREE.TextureLoader().setPath("./textures/");

    const noiseTexture = sunTextureLoader.load("waternormals.jpg");
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

    // 自定义着色器材质
    const lavaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            noiseTex: { value: noiseTexture },
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            
            void main() {
                vUv = uv;
                vec3 pos = position;
                // 顶点动画
                vPosition = pos;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform sampler2D noiseTex;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                // 噪声混合
                vec2 uv1 = vUv * 2.0 + time * 0.02;
                vec2 uv2 = vUv * 3.0 - time * 0.02;
                
                float noise1 = texture2D(noiseTex, uv1).r;
                float noise2 = texture2D(noiseTex, uv2).g;
                float finalNoise = mix(noise1, noise2, 0.5);
                
                // 颜色渐变
                vec3 hotColor = vec3(2.5, 0.3, 0.0);
                vec3 darkColor = vec3(0.1, 0.1, 0.0);
                vec3 color = mix(hotColor, darkColor, finalNoise);
                
                // 边缘发光
                float edge = 1.0 - smoothstep(0.4, 0.6, finalNoise);
                color += edge * vec3(1.0, 0.6, 0.2);
                
                // 动态高光
                float highlight = sin(time + vPosition.x * 5.0) * 0.5 + 0.5;
                color += highlight * 0.01;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `,
    });

    // 创建太阳
    const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
    const sunMesh = new THREE.Mesh(sunGeometry, lavaMaterial);
    sunMesh.position.set(sunPosition.x, sunPosition.y + 1, sunPosition.z);

    return { sunMesh, sunLight, sunPosition };
};

export { sunModel };
