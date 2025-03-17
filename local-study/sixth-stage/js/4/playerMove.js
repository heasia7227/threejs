import * as THREE from "three";
import { Capsule } from "three/addons/math/Capsule.js";

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();
const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);

const keyStates = {};
let playerOnFloor = false;

document.addEventListener("keydown", (event) => {
    keyStates[event.code] = true;
});

document.addEventListener("keyup", (event) => {
    keyStates[event.code] = false;
});

function getForwardVector(camera) {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();

    return playerDirection;
}

function getSideVector(camera) {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(camera.up);

    return playerDirection;
}

function playerControls(camera, deltaTime) {
    // gives a bit of air control
    const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);

    if (keyStates["KeyW"]) {
        playerVelocity.add(getForwardVector(camera).multiplyScalar(speedDelta));
    }

    if (keyStates["KeyS"]) {
        playerVelocity.add(getForwardVector(camera).multiplyScalar(-speedDelta));
    }

    if (keyStates["KeyA"]) {
        playerVelocity.add(getSideVector(camera).multiplyScalar(-speedDelta));
    }

    if (keyStates["KeyD"]) {
        playerVelocity.add(getSideVector(camera).multiplyScalar(speedDelta));
    }

    if (playerOnFloor) {
        if (keyStates["Space"]) {
            playerVelocity.y = 15;
        }
    }
}

function updatePlayer(camera, deltaTime, octree, GRAVITY) {
    let damping = Math.exp(-4 * deltaTime) - 1;

    if (!playerOnFloor) {
        playerVelocity.y -= GRAVITY * deltaTime;

        // small air resistance
        damping *= 0.1;
    }

    playerVelocity.addScaledVector(playerVelocity, damping);

    const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
    playerCollider.translate(deltaPosition);

    playerCollisions(octree);

    camera.position.copy(playerCollider.end);
}

function playerCollisions(octree) {
    const result = octree.capsuleIntersect(playerCollider);

    playerOnFloor = false;

    if (result) {
        playerOnFloor = result.normal.y > 0;

        if (!playerOnFloor) {
            playerVelocity.addScaledVector(result.normal, -result.normal.dot(playerVelocity));
        }

        if (result.depth >= 1e-10) {
            playerCollider.translate(result.normal.multiplyScalar(result.depth));
        }
    }
}

function teleportPlayerIfOob(camera) {
    if (camera.position.y <= -25) {
        playerCollider.start.set(0, 0.35, 0);
        playerCollider.end.set(0, 1, 0);
        playerCollider.radius = 0.35;
        camera.position.copy(playerCollider.end);
        camera.rotation.set(0, 0, 0);
    }
}

export { playerControls, updatePlayer, teleportPlayerIfOob, playerDirection, playerCollider, playerVelocity };
