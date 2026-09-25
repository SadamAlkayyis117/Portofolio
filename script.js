// =====================================================
// SADAM ALKAYYIS - INTERACTIVE 3D PORTFOLIO
// STEP 4 - THREE.JS WORLD
// =====================================================

console.log("=== PORTFOLIO SCRIPT START ===");


// =====================================================
// CHECK THREE.JS
// =====================================================

if (typeof THREE === "undefined") {

    console.error(
        "Three.js gagal dimuat."
    );

} else {

    console.log(
        "Three.js berhasil dimuat. Version:",
        THREE.REVISION
    );


    // =================================================
    // CANVAS
    // =================================================

    const canvas =
        document.getElementById("game-canvas");


    // =================================================
    // SCENE
    // =================================================

    const scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(0x87ceeb);


    // =================================================
    // CAMERA
    // =================================================

    const camera =
        new THREE.PerspectiveCamera(
            70,
            window.innerWidth /
            window.innerHeight,
            0.1,
            1000
        );

    camera.position.set(
        0,
        3,
        8
    );


    // =================================================
    // RENDERER
    // =================================================

    const renderer =
        new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.shadowMap.enabled = true;


    // =================================================
    // LIGHT
    // =================================================

    const hemisphereLight =
        new THREE.HemisphereLight(
            0xffffff,
            0x557755,
            2
        );

    scene.add(
        hemisphereLight
    );


    const sunLight =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    sunLight.position.set(
        20,
        40,
        20
    );

    sunLight.castShadow = true;

    scene.add(
        sunLight
    );


    // =================================================
    // GROUND
    // =================================================

    const groundGeometry =
        new THREE.PlaneGeometry(
            100,
            100
        );

    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x4f7d3a
        });

    const ground =
        new THREE.Mesh(
            groundGeometry,
            groundMaterial
        );

    ground.rotation.x =
        -Math.PI / 2;

    ground.receiveShadow = true;

    scene.add(
        ground
    );


    // =================================================
    // PATH
    // =================================================

    const pathGeometry =
        new THREE.PlaneGeometry(
            6,
            60
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

    path.rotation.x =
        -Math.PI / 2;

    path.position.set(
        0,
        0.02,
        -20
    );

    scene.add(
        path
    );


    // =================================================
    // BOX FUNCTION
    // =================================================

    function createBox(
        width,
        height,
        depth,
        color,
        x,
        y,
        z
    ) {

        const geometry =
            new THREE.BoxGeometry(
                width,
                height,
                depth
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: color
            });

        const mesh =
            new THREE.Mesh(
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

        scene.add(
            mesh
        );

        return mesh;
    }


    // =================================================
    // ENVIRONMENT
    // =================================================

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


    // =================================================
    // TREE
    // =================================================

    function createTree(
        x,
        z
    ) {

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

        scene.add(
            trunk
        );


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

        scene.add(
            leaves
        );
    }


    createTree(-10, -5);
    createTree(10, -7);
    createTree(-12, -18);
    createTree(12, -22);
    createTree(4, -25);


    // =================================================
    // RESIZE
    // =================================================

    window.addEventListener(
        "resize",
        function () {

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


    // =================================================
    // START BUTTON
    // =================================================

    const startScreen =
        document.getElementById(
            "start-screen"
        );

    const startButton =
        document.getElementById(
            "start-button"
        );


    if (startButton) {

        startButton.addEventListener(
            "click",
            function () {

                startScreen.classList.add(
                    "hidden"
                );

                console.log(
                    "Portfolio started."
                );
            }
        );
    }


    // =================================================
    // LOADING SCREEN
    // =================================================

    const loadingScreen =
        document.getElementById(
            "loading-screen"
        );

    if (loadingScreen) {

        loadingScreen.classList.add(
            "hidden"
        );
    }


    // =================================================
    // ANIMATION
    // =================================================

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


    console.log(
        "=== 3D WORLD RUNNING ==="
    );
}
