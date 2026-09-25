// =====================================================
// SADAM ALKAYYIS - 3D PORTFOLIO
// STEP 4 - THREE.JS WORLD
// =====================================================


// =====================================================
// THREE.JS IMPORT
// =====================================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// =====================================================
// BASIC SETUP
// =====================================================

const canvas = document.getElementById("game-canvas");


// Scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);


// Camera
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(
    0,
    3,
    8
);


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;


// =====================================================
// LIGHTING
// =====================================================

// Ambient light
const ambientLight = new THREE.HemisphereLight(
    0xffffff,
    0x668866,
    2
);

scene.add(ambientLight);


// Sun
const sunLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

sunLight.position.set(
    30,
    50,
    20
);

sunLight.castShadow = true;

scene.add(sunLight);


// =====================================================
// GROUND
// =====================================================

const groundGeometry = new THREE.PlaneGeometry(
    100,
    100
);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x4f7d3a
});

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


// =====================================================
// SIMPLE ENVIRONMENT OBJECTS
// =====================================================


// Function to create a simple box
function createBox(
    width,
    height,
    depth,
    color,
    x,
    y,
    z
) {

    const geometry = new THREE.BoxGeometry(
        width,
        height,
        depth
    );

    const material = new THREE.MeshStandardMaterial({
        color: color
    });

    const mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.position.set(
        x,
        y,
        z
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);

    return mesh;
}


// Some environment blocks

createBox(
    4,
    2,
    4,
    0x8b6f47,
    -6,
    1,
    -8
);

createBox(
    3,
    3,
    3,
    0x6d8f52,
    6,
    1.5,
    -12
);

createBox(
    5,
    1,
    5,
    0x77624a,
    0,
    0.5,
    -18
);


// =====================================================
// TREES
// =====================================================

function createTree(x, z) {

    // Trunk

    const trunkGeometry =
        new THREE.CylinderGeometry(
            0.35,
            0.45,
            3,
            8
        );

    const trunkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x6b4423
        });

    const trunk =
        new THREE.Mesh(
            trunkGeometry,
            trunkMaterial
        );

    trunk.position.set(
        x,
        1.5,
        z
    );

    trunk.castShadow = true;

    scene.add(trunk);


    // Leaves

    const leavesGeometry =
        new THREE.SphereGeometry(
            1.7,
            12,
            12
        );

    const leavesMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2f6b32
        });

    const leaves =
        new THREE.Mesh(
            leavesGeometry,
            leavesMaterial
        );

    leaves.position.set(
        x,
        4,
        z
    );

    leaves.castShadow = true;

    scene.add(leaves);
}


// Trees

createTree(-10, -5);
createTree(10, -7);
createTree(-12, -18);
createTree(12, -22);
createTree(4, -25);


// =====================================================
// SIMPLE PATH
// =====================================================

const pathGeometry =
    new THREE.PlaneGeometry(
        6,
        50
    );

const pathMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xb89b6a
    });

const path =
    new THREE.Mesh(
        pathGeometry,
        pathMaterial
    );

path.rotation.x = -Math.PI / 2;

path.position.set(
    0,
    0.01,
    -15
);

scene.add(path);


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


// =====================================================
// ANIMATION LOOP
// =====================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    renderer.render(
        scene,
        camera
    );

}

animate();


// =====================================================
// LOADING SCREEN
// =====================================================

const loadingScreen =
    document.getElementById(
        "loading-screen"
    );

if (loadingScreen) {

    loadingScreen.style.display =
        "none";

}
