import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OctreeHelper } from "three/addons/helpers/OctreeHelper.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const loadMap = (scene, octree) => {
    const loader = new GLTFLoader().setPath("./gltf/");

    loader.load("collision-world.glb", (gltf) => {
        scene.add(gltf.scene);

        octree.fromGraphNode(gltf.scene);

        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true; // 对象是否被渲染到阴影贴图中。默认值为false。
                child.receiveShadow = true; // 材质是否接收阴影。默认值为false。

                if (child.material.map) {
                    child.material.map.anisotropy = 4; // 数值越大Map越清晰，默认值1
                }
            }
        });

        const helper = new OctreeHelper(octree);
        helper.visible = false;
        scene.add(helper);

        const gui = new GUI();
        gui.add({ debug: false }, "debug").onChange(function (value) {
            helper.visible = value;
        });
    });
};

export { loadMap };
