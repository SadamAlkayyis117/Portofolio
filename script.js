// =====================================================
// SADAM ALKAYYIS - INTERACTIVE 3D PORTFOLIO
// THIRD PERSON CONTROLLER - SMARTVOC STYLE
// =====================================================

console.log("=== PORTFOLIO SCRIPT START ===");

if (typeof THREE === "undefined") {

    console.error("Three.js gagal dimuat.");

} else {

    console.log(
        "Three.js berhasil dimuat. Version:",
        THREE.REVISION
    );

    // =================================================
    // CANVAS
    // =================================================

    const canvas = document.getElementById("game-canvas");

    if (!canvas) {
        console.error("Canvas #game-canvas tidak ditemukan.");
        return;
    }


    // =================================================
    // SCENE
    // =================================================

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x87ceeb);

    scene.fog = new THREE.Fog(
        0x87ceeb,
        30,
        100
    );


    // =================================================
    // CAMERA
    // =================================================

    const camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );


    // =================================================
    // RENDERER
    // =================================================

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
    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;


    // =================================================
    // LIGHTING
    // =================================================

    const hemisphereLight =
        new THREE.HemisphereLight(
            0xffffff,
            0x557755,
            2
        );

    scene.add(hemisphereLight);


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

    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;

    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;

    scene.add(sunLight);


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

    scene.add(ground);


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

    path.receiveShadow = true;

    scene.add(path);


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

        scene.add(mesh);

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


    createTree(-10, -5);
    createTree(10, -7);
    createTree(-12, -18);
    createTree(12, -22);
    createTree(4, -25);


    // =================================================
    // PLAYER
    // =================================================

    const player =
        new THREE.Group();

    player.position.set(
        0,
        0,
        6
    );

    scene.add(player);


    // =================================================
    // PLAYER BODY
    // =================================================

    const bodyGeometry =
        new THREE.BoxGeometry(
            0.8,
            1.2,
            0.45
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2d5bff
        });

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y = 1.15;

    body.castShadow = true;

    player.add(body);


    // =================================================
    // PLAYER HEAD
    // =================================================

    const headGeometry =
        new THREE.SphereGeometry(
            0.35,
            16,
            16
        );

    const headMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xf0c8a0
        });

    const head =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        );

    head.position.y = 2.0;

    head.castShadow = true;

    player.add(head);


    // =================================================
    // PLAYER LEGS
    // =================================================

    const legGeometry =
        new THREE.BoxGeometry(
            0.25,
            0.8,
            0.3
        );

    const legMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x202020
        });


    const leftLeg =
        new THREE.Mesh(
            legGeometry,
            legMaterial
        );

    leftLeg.position.set(
        -0.2,
        0.4,
        0
    );

    leftLeg.castShadow = true;

    player.add(leftLeg);


    const rightLeg =
        new THREE.Mesh(
            legGeometry,
            legMaterial
        );

    rightLeg.position.set(
        0.2,
        0.4,
        0
    );

    rightLeg.castShadow = true;

    player.add(rightLeg);


    // =================================================
    // PLAYER ARMS
    // =================================================

    const armGeometry =
        new THREE.BoxGeometry(
            0.2,
            0.9,
            0.25
        );


    const leftArm =
        new THREE.Mesh(
            armGeometry,
            bodyMaterial
        );

    leftArm.position.set(
        -0.55,
        1.2,
        0
    );

    leftArm.castShadow = true;

    player.add(leftArm);


    const rightArm =
        new THREE.Mesh(
            armGeometry,
            bodyMaterial
        );

    rightArm.position.set(
        0.55,
        1.2,
        0
    );

    rightArm.castShadow = true;

    player.add(rightArm);


    // =================================================
    // THIRD PERSON CAMERA
    // SMARTVOC STYLE
    // =================================================

    let cameraYaw = 0;
    let cameraPitch = 0.18;

    let cameraDistance = 6.0;

    const CAMERA_MIN_DISTANCE = 3.5;
    const CAMERA_MAX_DISTANCE = 9.0;

    const CAMERA_HEIGHT = 2.8;

    const CAMERA_LOOK_HEIGHT = 1.15;

    const cameraTarget =
        new THREE.Vector3();

    const cameraDesiredPosition =
        new THREE.Vector3();

    const cameraOffset =
        new THREE.Vector3();


    // =================================================
    // CAMERA SMOOTHING
    // =================================================

    const cameraFollowSpeed = 12;

    const cameraLookSpeed = 14;


    // =================================================
    // INPUT
    // =================================================

    const keys = {};


    window.addEventListener(
        "keydown",
        function(event) {

            keys[event.code] = true;

        }
    );


    window.addEventListener(
        "keyup",
        function(event) {

            keys[event.code] = false;

        }
    );


    // =================================================
    // MOUSE / POINTER LOCK
    // =================================================

    let mouseLocked = false;

    document.addEventListener(
        "pointerlockchange",
        function() {

            mouseLocked =
                document.pointerLockElement === canvas;

        }
    );


    document.addEventListener(
        "mousemove",
        function(event) {

            if (!mouseLocked) {
                return;
            }


            // =========================================
            // CAMERA ORBIT
            // =========================================

            const sensitivity = 0.0025;


            cameraYaw -=
                event.movementX *
                sensitivity;


            cameraPitch -=
                event.movementY *
                sensitivity;


            // =========================================
            // SMARTVOC-LIKE CAMERA LIMIT
            // =========================================

            cameraPitch =
                THREE.MathUtils.clamp(
                    cameraPitch,
                    -0.65,
                    0.85
                );

        }
    );


    // =================================================
    // CAMERA ZOOM
    // =================================================

    canvas.addEventListener(
        "wheel",
        function(event) {

            event.preventDefault();

            cameraDistance +=
                event.deltaY * 0.005;

            cameraDistance =
                THREE.MathUtils.clamp(
                    cameraDistance,
                    CAMERA_MIN_DISTANCE,
                    CAMERA_MAX_DISTANCE
                );

        },
        {
            passive: false
        }
    );


    // =================================================
    // START SCREEN
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
            function() {

                if (startScreen) {

                    startScreen.classList.add(
                        "hidden"
                    );

                }


                // =====================================
                // POINTER LOCK
                // =====================================

                canvas.requestPointerLock();


                console.log(
                    "Portfolio started."
                );

                console.log(
                    "Third-person SmartVoc-style controller active."
                );

            }
        );

    }


    // =================================================
    // PLAYER MOVEMENT
    // =================================================

    const moveDirection =
        new THREE.Vector3();

    const cameraForward =
        new THREE.Vector3();

    const cameraRight =
        new THREE.Vector3();

    const velocity =
        new THREE.Vector3();


    const moveSpeed = 6;

    const rotationSpeed = 10;


    // =================================================
    // PLAYER MOVEMENT
    // SMARTVOC STYLE
    // =================================================

    function updatePlayer(delta) {

        moveDirection.set(
            0,
            0,
            0
        );


        // =================================================
        // CAMERA BASIS
        // Sama konsepnya dengan:
        //
        // cam_basis.x
        // -cam_basis.z
        //
        // pada SmartVoc.
        // =================================================


        cameraForward.set(
            Math.sin(cameraYaw),
            0,
            Math.cos(cameraYaw)
        );

        cameraForward.normalize();


        cameraRight.set(
            Math.cos(cameraYaw),
            0,
            -Math.sin(cameraYaw)
        );

        cameraRight.normalize();


        // =================================================
        // W = MAJU SESUAI ARAH CAMERA
        // =================================================

        if (
            keys["KeyW"] ||
            keys["ArrowUp"]
        ) {

            moveDirection.add(
                cameraForward
            );

        }


        // =================================================
        // S = MUNDUR
        // =================================================

        if (
            keys["KeyS"] ||
            keys["ArrowDown"]
        ) {

            moveDirection.sub(
                cameraForward
            );

        }


        // =================================================
        // A = KIRI RELATIF CAMERA
        // =================================================

        if (
            keys["KeyA"] ||
            keys["ArrowLeft"]
        ) {

            moveDirection.sub(
                cameraRight
            );

        }


        // =================================================
        // D = KANAN RELATIF CAMERA
        // =================================================

        if (
            keys["KeyD"] ||
            keys["ArrowRight"]
        ) {

            moveDirection.add(
                cameraRight
            );

        }


        // =================================================
        // NORMALIZE
        // =================================================

        const isMoving =
            moveDirection.lengthSq() > 0;


        if (isMoving) {

            moveDirection.normalize();


            // =============================================
            // MOVEMENT
            // =============================================

            velocity.copy(
                moveDirection
            );

            velocity.multiplyScalar(
                moveSpeed * delta
            );

            player.position.add(
                velocity
            );


            // =============================================
            // CHARACTER ROTATION
            //
            // Sama konsep:
            // atan2(dir.x, dir.z)
            // =============================================

            const targetRotation =
                Math.atan2(
                    moveDirection.x,
                    moveDirection.z
                );


            let rotationDifference =
                targetRotation -
                player.rotation.y;


            // Normalize rotation difference
            while (
                rotationDifference > Math.PI
            ) {

                rotationDifference -=
                    Math.PI * 2;

            }


            while (
                rotationDifference < -Math.PI
            ) {

                rotationDifference +=
                    Math.PI * 2;

            }


            // Smooth rotation
            player.rotation.y +=
                rotationDifference *
                Math.min(
                    1,
                    delta * rotationSpeed
                );

        }


        // =================================================
        // WORLD BOUNDS
        // =================================================

        player.position.x =
            THREE.MathUtils.clamp(
                player.position.x,
                -45,
                45
            );


        player.position.z =
            THREE.MathUtils.clamp(
                player.position.z,
                -45,
                45
            );

    }


    // =================================================
    // PLAYER WALK ANIMATION
    // =================================================

    let walkTime = 0;


    function updatePlayerAnimation(delta) {

        const isMoving =
            moveDirection.lengthSq() > 0;


        if (isMoving) {

            walkTime +=
                delta * 10;


            const swing =
                Math.sin(
                    walkTime
                ) * 0.5;


            leftLeg.rotation.x =
                swing;

            rightLeg.rotation.x =
                -swing;


            leftArm.rotation.x =
                -swing;

            rightArm.rotation.x =
                swing;

        } else {

            leftLeg.rotation.x = 0;
            rightLeg.rotation.x = 0;

            leftArm.rotation.x = 0;
            rightArm.rotation.x = 0;

        }

    }


    // =================================================
    // THIRD PERSON CAMERA FOLLOW
    // =================================================

    function updateCamera(delta) {

        // =============================================
        // TARGET
        // =============================================

        cameraTarget.set(
            player.position.x,
            player.position.y +
            CAMERA_LOOK_HEIGHT,
            player.position.z
        );


        // =============================================
        // ORBIT POSITION
        //
        // Kamera berada DI BELAKANG player
        // relatif terhadap cameraYaw.
        // =============================================

        const horizontalDistance =
            cameraDistance *
            Math.cos(cameraPitch);


        const verticalDistance =
            cameraDistance *
            Math.sin(cameraPitch);


        cameraDesiredPosition.set(

            player.position.x -
            Math.sin(cameraYaw) *
            horizontalDistance,

            player.position.y +
            CAMERA_HEIGHT -
            verticalDistance,

            player.position.z -
            Math.cos(cameraYaw) *
            horizontalDistance

        );


        // =============================================
        // CAMERA FOLLOW SMOOTH
        // =============================================

        const followAlpha =
            1 -
            Math.pow(
                0.001,
                delta *
                cameraFollowSpeed
            );


        camera.position.lerp(
            cameraDesiredPosition,
            followAlpha
        );


        // =============================================
        // CAMERA LOOK AT
        // =============================================

        camera.lookAt(
            cameraTarget
        );

    }


    // =================================================
    // NPC CREATION
    // =================================================

    function createNPC(
        x,
        z,
        color,
        pathLength
    ) {

        const npc =
            new THREE.Group();


        npc.position.set(
            x,
            0,
            z
        );


        scene.add(npc);


        // =============================================
        // BODY
        // =============================================

        const npcBody =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.75,
                    1.1,
                    0.45
                ),
                new THREE.MeshStandardMaterial({
                    color: color
                })
            );

        npcBody.position.y =
            1.1;

        npcBody.castShadow = true;

        npc.add(npcBody);


        // =============================================
        // HEAD
        // =============================================

        const npcHead =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.33,
                    12,
                    12
                ),
                new THREE.MeshStandardMaterial({
                    color: 0xe8bd96
                })
            );

        npcHead.position.y =
            1.9;

        npcHead.castShadow = true;

        npc.add(npcHead);


        // =============================================
        // LEGS
        // =============================================

        const npcLegGeometry =
            new THREE.BoxGeometry(
                0.23,
                0.75,
                0.28
            );

        const npcLegMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x222222
            });


        const npcLeftLeg =
            new THREE.Mesh(
                npcLegGeometry,
                npcLegMaterial
            );

        npcLeftLeg.position.set(
            -0.19,
            0.38,
            0
        );

        npcLeftLeg.castShadow = true;

        npc.add(npcLeftLeg);


        const npcRightLeg =
            new THREE.Mesh(
                npcLegGeometry,
                npcLegMaterial
            );

        npcRightLeg.position.set(
            0.19,
            0.38,
            0
        );

        npcRightLeg.castShadow = true;

        npc.add(npcRightLeg);


        // =============================================
        // NPC MOVEMENT DATA
        // =============================================

        npc.userData.startX = x;

        npc.userData.startZ = z;

        npc.userData.pathLength =
            pathLength;

        npc.userData.speed =
            1.2 +
            Math.random() * 0.6;

        npc.userData.direction = 1;

        npc.userData.walkTime = 0;


        // Face initial direction
        npc.rotation.y =
            Math.PI / 2;


        return npc;

    }


    // =================================================
    // CREATE NPCS
    // =================================================

    const npc1 =
        createNPC(
            -5,
            -10,
            0xd94c4c,
            5
        );


    const npc2 =
        createNPC(
            5,
            -17,
            0xf0a83c,
            4
        );


    const npc3 =
        createNPC(
            -4,
            -25,
            0x8e5bd9,
            6
        );


    const npcs = [
        npc1,
        npc2,
        npc3
    ];


    // =================================================
    // NPC UPDATE
    // =================================================

    function updateNPCs(delta) {

        npcs.forEach(
            function(npc) {

                npc.userData.walkTime +=
                    delta * 8;


                const offset =
                    npc.userData.direction *
                    npc.userData.speed *
                    delta;


                npc.position.x +=
                    offset;


                const distance =
                    npc.position.x -
                    npc.userData.startX;


                // =====================================
                // REVERSE
                // =====================================

                if (
                    Math.abs(distance) >
                    npc.userData.pathLength
                ) {

                    npc.userData.direction *=
                        -1;


                    npc.rotation.y =
                        npc.userData.direction > 0
                            ? Math.PI / 2
                            : -Math.PI / 2;

                }


                // =====================================
                // WALK ANIMATION
                // =====================================

                const swing =
                    Math.sin(
                        npc.userData.walkTime
                    ) * 0.45;


                npc.children[2].rotation.x =
                    swing;

                npc.children[3].rotation.x =
                    -swing;

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
    // RESIZE
    // =================================================

    window.addEventListener(
        "resize",
        function() {

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
    // CLOCK
    // =================================================

    const clock =
        new THREE.Clock();


    // =================================================
    // INITIAL CAMERA
    // =================================================

    updateCamera(0.016);


    // =================================================
    // ANIMATION LOOP
    // =================================================

    function animate() {

        requestAnimationFrame(
            animate
        );


        const delta =
            Math.min(
                clock.getDelta(),
                0.05
            );


        // =============================================
        // PLAYER
        // =============================================

        updatePlayer(
            delta
        );


        updatePlayerAnimation(
            delta
        );


        // =============================================
        // NPC
        // =============================================

        updateNPCs(
            delta
        );


        // =============================================
        // CAMERA
        // =============================================

        updateCamera(
            delta
        );


        // =============================================
        // RENDER
        // =============================================

        renderer.render(
            scene,
            camera
        );

    }


    animate();


    console.log(
        "=== 3D WORLD RUNNING ==="
    );

    console.log(
        "SmartVoc-style third-person movement active."
    );

}
