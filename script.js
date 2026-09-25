// =====================================================
// SADAM ALKAYYIS - INTERACTIVE 3D PORTFOLIO
// STEP 6 - FIXED (NO ILLEGAL RETURN)
// THIRD PERSON + COLLISION + PROJECT SIGN + E INTERACTION
// NPC FULL BODY
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

    const canvas =
        document.getElementById("game-canvas");


    if (!canvas) {

        console.error(
            "Canvas #game-canvas tidak ditemukan."
        );

    } else {

        // =============================================
        // SCENE
        // =============================================

        const scene =
            new THREE.Scene();

        scene.background =
            new THREE.Color(0x87ceeb);

        scene.fog =
            new THREE.Fog(
                0x87ceeb,
                30,
                100
            );


        // =============================================
        // CAMERA
        // =============================================

        const camera =
            new THREE.PerspectiveCamera(
                65,
                window.innerWidth /
                window.innerHeight,
                0.1,
                1000
            );


        // =============================================
        // RENDERER
        // =============================================

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

        renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        // =============================================
        // LIGHTING
        // =============================================

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

        sunLight.shadow.mapSize.width =
            2048;

        sunLight.shadow.mapSize.height =
            2048;

        sunLight.shadow.camera.left =
            -50;

        sunLight.shadow.camera.right =
            50;

        sunLight.shadow.camera.top =
            50;

        sunLight.shadow.camera.bottom =
            -50;

        scene.add(
            sunLight
        );


        // =============================================
        // GROUND
        // =============================================

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


        // =============================================
        // PATH
        // =============================================

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

        scene.add(
            path
        );


        // =============================================
        // COLLISION SYSTEM
        // =============================================

        const collisionObjects = [];


        function addCollisionBox(
            x,
            z,
            width,
            depth
        ) {

            collisionObjects.push({
                x: x,
                z: z,
                halfWidth: width / 2,
                halfDepth: depth / 2
            });

        }


        // =============================================
        // PLAYER COLLISION SIZE
        // =============================================

        const PLAYER_RADIUS = 0.45;


        // =============================================
        // CHECK COLLISION
        // =============================================

        function resolvePlayerCollision(
            position
        ) {

            for (
                const collider
                of collisionObjects
            ) {

                const closestX =
                    THREE.MathUtils.clamp(
                        position.x,
                        collider.x -
                        collider.halfWidth,
                        collider.x +
                        collider.halfWidth
                    );

                const closestZ =
                    THREE.MathUtils.clamp(
                        position.z,
                        collider.z -
                        collider.halfDepth,
                        collider.z +
                        collider.halfDepth
                    );


                let dx =
                    position.x -
                    closestX;

                let dz =
                    position.z -
                    closestZ;


                const distanceSq =
                    dx * dx +
                    dz * dz;


                if (
                    distanceSq <
                    PLAYER_RADIUS *
                    PLAYER_RADIUS
                ) {

                    let distance =
                        Math.sqrt(
                            distanceSq
                        );


                    // =====================================
                    // PLAYER INSIDE CENTER
                    // =====================================

                    if (
                        distance === 0
                    ) {

                        const pushX =
                            Math.min(
                                Math.abs(
                                    position.x -
                                    (
                                        collider.x -
                                        collider.halfWidth
                                    )
                                ),
                                Math.abs(
                                    position.x -
                                    (
                                        collider.x +
                                        collider.halfWidth
                                    )
                                )
                            );

                        const pushZ =
                            Math.min(
                                Math.abs(
                                    position.z -
                                    (
                                        collider.z -
                                        collider.halfDepth
                                    )
                                ),
                                Math.abs(
                                    position.z -
                                    (
                                        collider.z +
                                        collider.halfDepth
                                    )
                                )
                            );


                        if (
                            pushX <
                            pushZ
                        ) {

                            position.x =
                                position.x <
                                collider.x
                                    ? collider.x -
                                      collider.halfWidth -
                                      PLAYER_RADIUS
                                    : collider.x +
                                      collider.halfWidth +
                                      PLAYER_RADIUS;

                        } else {

                            position.z =
                                position.z <
                                collider.z
                                    ? collider.z -
                                      collider.halfDepth -
                                      PLAYER_RADIUS
                                    : collider.z +
                                      collider.halfDepth +
                                      PLAYER_RADIUS;

                        }

                        continue;

                    }


                    // =====================================
                    // PUSH PLAYER OUT
                    // =====================================

                    const penetration =
                        PLAYER_RADIUS -
                        distance;


                    dx /= distance;
                    dz /= distance;


                    position.x +=
                        dx * penetration;

                    position.z +=
                        dz * penetration;

                }

            }

        }


        // =============================================
        // BOX FUNCTION
        // =============================================

        function createBox(
            width,
            height,
            depth,
            color,
            x,
            y,
            z,
            collision = true
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


            if (collision) {

                addCollisionBox(
                    x,
                    z,
                    width,
                    depth
                );

            }


            return mesh;

        }


        // =============================================
        // ENVIRONMENT
        // =============================================

        createBox(
            4,
            2,
            4,
            0x8b6f47,
            -6,
            1,
            -8,
            true
        );


        createBox(
            3,
            3,
            3,
            0x6d8f52,
            6,
            1.5,
            -12,
            true
        );


        createBox(
            5,
            1,
            5,
            0x77624a,
            0,
            0.5,
            -18,
            true
        );


        // =============================================
        // TREE
        // =============================================

        function createTree(
            x,
            z
        ) {

            // =========================================
            // TRUNK
            // =========================================

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


            // =========================================
            // LEAVES
            // =========================================

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


            // =========================================
            // TREE COLLISION
            // =========================================

            addCollisionBox(
                x,
                z,
                1.2,
                1.2
            );

        }


        createTree(
            -10,
            -5
        );

        createTree(
            10,
            -7
        );

        createTree(
            -12,
            -18
        );

        createTree(
            12,
            -22
        );

        createTree(
            4,
            -25
        );


        // =============================================
        // PLAYER
        // =============================================

        const player =
            new THREE.Group();


        player.position.set(
            0,
            0,
            6
        );


        scene.add(
            player
        );


        // =============================================
        // PLAYER BODY
        // =============================================

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

        body.position.y =
            1.15;

        body.castShadow = true;

        player.add(
            body
        );


        // =============================================
        // PLAYER HEAD
        // =============================================

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

        head.position.y =
            2.0;

        head.castShadow = true;

        player.add(
            head
        );


        // =============================================
        // PLAYER LEGS
        // =============================================

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

        player.add(
            leftLeg
        );


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

        player.add(
            rightLeg
        );


        // =============================================
        // PLAYER ARMS
        // =============================================

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

        player.add(
            leftArm
        );


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

        player.add(
            rightArm
        );


        // =============================================
        // THIRD PERSON CAMERA
        // =============================================

        let cameraYaw = 0;

        let cameraPitch = 0.18;

        let cameraDistance = 6.0;


        const CAMERA_MIN_DISTANCE =
            3.5;

        const CAMERA_MAX_DISTANCE =
            9.0;

        const CAMERA_HEIGHT =
            2.8;

        const CAMERA_LOOK_HEIGHT =
            1.15;


        const cameraTarget =
            new THREE.Vector3();

        const cameraDesiredPosition =
            new THREE.Vector3();


        const cameraFollowSpeed =
            12;


        // =============================================
        // INPUT
        // =============================================

        const keys = {};


        window.addEventListener(
            "keydown",
            function(event) {

                keys[event.code] = true;


                // =====================================
                // E INTERACTION
                // =====================================

                if (
                    event.code === "KeyE"
                ) {

                    interactWithProject();

                }

            }
        );


        window.addEventListener(
            "keyup",
            function(event) {

                keys[event.code] = false;

            }
        );


        // =============================================
        // MOUSE / POINTER LOCK
        // =============================================

        let mouseLocked = false;


        document.addEventListener(
            "pointerlockchange",
            function() {

                mouseLocked =
                    document.pointerLockElement ===
                    canvas;

            }
        );


        document.addEventListener(
            "mousemove",
            function(event) {

                if (
                    !mouseLocked ||
                    projectOpen
                ) {

                    return;

                }


                const sensitivity =
                    0.0025;


                cameraYaw -=
                    event.movementX *
                    sensitivity;


                cameraPitch -=
                    event.movementY *
                    sensitivity;


                cameraPitch =
                    THREE.MathUtils.clamp(
                        cameraPitch,
                        -0.65,
                        0.85
                    );

            }
        );


        // =============================================
        // CAMERA ZOOM
        // =============================================

        canvas.addEventListener(
            "wheel",
            function(event) {

                if (
                    projectOpen
                ) {

                    return;

                }


                event.preventDefault();


                cameraDistance +=
                    event.deltaY *
                    0.005;


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


        // =============================================
        // START SCREEN
        // =============================================

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


                    canvas.requestPointerLock();


                    console.log(
                        "Portfolio started."
                    );

                }
            );

        }


        // =============================================
        // MOVEMENT
        // =============================================

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


        // =============================================
        // PLAYER MOVEMENT
        // =============================================

        function updatePlayer(
            delta
        ) {

            if (
                projectOpen
            ) {

                moveDirection.set(
                    0,
                    0,
                    0
                );

                return;

            }


            moveDirection.set(
                0,
                0,
                0
            );


            // =========================================
            // CAMERA FORWARD
            // =========================================

            cameraForward.set(
                Math.sin(cameraYaw),
                0,
                Math.cos(cameraYaw)
            );

            cameraForward.normalize();


            // =========================================
            // CAMERA RIGHT
            // =========================================

            cameraRight.set(
                Math.cos(cameraYaw),
                0,
                -Math.sin(cameraYaw)
            );

            cameraRight.normalize();


            // =========================================
            // W
            // =========================================

            if (
                keys["KeyW"] ||
                keys["ArrowUp"]
            ) {

                moveDirection.add(
                    cameraForward
                );

            }


            // =========================================
            // S
            // =========================================

            if (
                keys["KeyS"] ||
                keys["ArrowDown"]
            ) {

                moveDirection.sub(
                    cameraForward
                );

            }


            // =========================================
            // A
            // =========================================

            if (
                keys["KeyA"] ||
                keys["ArrowLeft"]
            ) {

                moveDirection.sub(
                    cameraRight
                );

            }


            // =========================================
            // D
            // =========================================

            if (
                keys["KeyD"] ||
                keys["ArrowRight"]
            ) {

                moveDirection.add(
                    cameraRight
                );

            }


            // =========================================
            // NORMALIZE
            // =========================================

            const isMoving =
                moveDirection.lengthSq() > 0;


            if (
                isMoving
            ) {

                moveDirection.normalize();


                // =====================================
                // CALCULATE NEW POSITION
                // =====================================

                velocity.copy(
                    moveDirection
                );

                velocity.multiplyScalar(
                    moveSpeed *
                    delta
                );


                // =====================================
                // MOVE X
                // =====================================

                player.position.x +=
                    velocity.x;


                resolvePlayerCollision(
                    player.position
                );


                // =====================================
                // MOVE Z
                // =====================================

                player.position.z +=
                    velocity.z;


                resolvePlayerCollision(
                    player.position
                );


                // =====================================
                // ROTATION
                // =====================================

                const targetRotation =
                    Math.atan2(
                        moveDirection.x,
                        moveDirection.z
                    );


                let rotationDifference =
                    targetRotation -
                    player.rotation.y;


                while (
                    rotationDifference >
                    Math.PI
                ) {

                    rotationDifference -=
                        Math.PI * 2;

                }


                while (
                    rotationDifference <
                    -Math.PI
                ) {

                    rotationDifference +=
                        Math.PI * 2;

                }


                player.rotation.y +=
                    rotationDifference *
                    Math.min(
                        1,
                        delta *
                        rotationSpeed
                    );

            }


            // =========================================
            // WORLD BOUNDS
            // =========================================

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


        // =============================================
        // PLAYER ANIMATION
        // =============================================

        let walkTime = 0;


        function updatePlayerAnimation(
            delta
        ) {

            const isMoving =
                moveDirection.lengthSq() > 0;


            if (
                isMoving
            ) {

                walkTime +=
                    delta *
                    10;


                const swing =
                    Math.sin(
                        walkTime
                    ) *
                    0.5;


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


        // =============================================
        // CAMERA FOLLOW
        // =============================================

        function updateCamera(
            delta
        ) {

            cameraTarget.set(
                player.position.x,
                player.position.y +
                CAMERA_LOOK_HEIGHT,
                player.position.z
            );


            const horizontalDistance =
                cameraDistance *
                Math.cos(
                    cameraPitch
                );


            const verticalDistance =
                cameraDistance *
                Math.sin(
                    cameraPitch
                );


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


            camera.lookAt(
                cameraTarget
            );

        }


        // =============================================
        // PROJECT DATA
        // =============================================

        const projects = {

            smartvoc: {

                title: "SmartVoc",

                category: "GAME DEVELOPMENT",

                description:
                    "3D open-world English learning RPG built for university students.",

                about:
                    "An educational RPG that combines open-world exploration, NPC interaction, missions, vocabulary learning, mini-games and progression into one interactive experience.",

                technologies:
                    "Godot Engine • GDScript • Blender • JSON",

                contribution:
                    "Game design, gameplay programming, UI implementation, systems development, level design and educational mechanics.",

                github:
                    "https://github.com/SadamAlkayyis117",

                demo:
                    "#"

            },


            blockfight: {

                title: "BlockFight",

                category: "GAME DEVELOPMENT",

                description:
                    "Interactive game project focused on gameplay systems and player interaction.",

                about:
                    "A gameplay-focused project developed to explore game mechanics, interaction systems and real-time player experiences.",

                technologies:
                    "Godot Engine • GDScript • Blender",

                contribution:
                    "Gameplay programming, mechanics implementation, level design and visual development.",

                github:
                    "https://github.com/SadamAlkayyis117",

                demo:
                    "#"

            },


            uiux: {

                title: "UI / UX DESIGN",

                category: "UI / UX",

                description:
                    "Interface and experience design projects created using Figma.",

                about:
                    "A collection of interface design and prototyping work focused on usability, visual hierarchy and interactive user experiences.",

                technologies:
                    "Figma • UI Design • UX Design • Prototyping",

                contribution:
                    "UI design, UX planning, wireframing, prototyping and visual design.",

                github:
                    "#",

                demo:
                    "#"

            },


            graphic: {

                title: "GRAPHIC DESIGN",

                category: "GRAPHIC DESIGN",

                description:
                    "Visual design projects covering illustration, branding and digital artwork.",

                about:
                    "A selection of graphic design work created across various projects, combining visual communication, composition and digital illustration.",

                technologies:
                    "CorelDRAW • Adobe Photoshop • Digital Illustration",

                contribution:
                    "Graphic design, illustration, composition, layout and visual development.",

                github:
                    "#",

                demo:
                    "#"

            }

        };


        // =============================================
        // PROJECT SIGN SYSTEM
        // =============================================

        const projectSigns = [];


        // =============================================
        // CREATE SIGN TEXTURE
        // =============================================

        function createSignTexture(
            title,
            category
        ) {

            const canvasTexture =
                document.createElement(
                    "canvas"
                );


            canvasTexture.width = 1024;

            canvasTexture.height = 512;


            const context =
                canvasTexture.getContext(
                    "2d"
                );


            // Background

            context.fillStyle =
                "#111111";

            context.fillRect(
                0,
                0,
                canvasTexture.width,
                canvasTexture.height
            );


            // Border

            context.strokeStyle =
                "#ffffff";

            context.lineWidth =
                8;

            context.strokeRect(
                12,
                12,
                canvasTexture.width - 24,
                canvasTexture.height - 24
            );


            // Category

            context.fillStyle =
                "#bbbbbb";

            context.font =
                "bold 32px Arial";

            context.textAlign =
                "center";

            context.fillText(
                category,
                canvasTexture.width / 2,
                100
            );


            // Title

            context.fillStyle =
                "#ffffff";

            context.font =
                "bold 72px Arial";

            context.fillText(
                title,
                canvasTexture.width / 2,
                205
            );


            // Interaction

            context.fillStyle =
                "#cccccc";

            context.font =
                "30px Arial";

            context.fillText(
                "PRESS E TO EXPLORE",
                canvasTexture.width / 2,
                380
            );


            const texture =
                new THREE.CanvasTexture(
                    canvasTexture
                );


            if (THREE.SRGBColorSpace) {
                texture.colorSpace = THREE.SRGBColorSpace;
            } else if (THREE.sRGBEncoding) {
                texture.encoding = THREE.sRGBEncoding;
            }


            return texture;

        }


        // =============================================
        // CREATE PROJECT SIGN
        // =============================================

        function createProjectSign(
            projectId,
            x,
            z
        ) {

            const data =
                projects[projectId];


            const sign =
                new THREE.Group();


            sign.position.set(
                x,
                0,
                z
            );


            // =========================================
            // POST
            // =========================================

            const post =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        0.25,
                        2.2,
                        0.25
                    ),
                    new THREE.MeshStandardMaterial({
                        color: 0x333333
                    })
                );


            post.position.y =
                1.1;


            post.castShadow = true;


            sign.add(
                post
            );


            // =========================================
            // BOARD
            // =========================================

            const board =
                new THREE.Mesh(
                    new THREE.PlaneGeometry(
                        3.2,
                        1.6
                    ),
                    new THREE.MeshStandardMaterial({
                        map:
                            createSignTexture(
                                data.title,
                                data.category
                            ),
                        side:
                            THREE.DoubleSide
                    })
                );


            board.position.y =
                2.2;


            board.castShadow = true;


            sign.add(
                board
            );


            // =========================================
            // COLLISION
            // =========================================

            addCollisionBox(
                x,
                z,
                0.8,
                0.8
            );


            // =========================================
            // USER DATA
            // =========================================

            sign.userData.projectId =
                projectId;


            sign.userData.interactionRadius =
                3.2;


            projectSigns.push(
                sign
            );


            scene.add(
                sign
            );


            return sign;

        }


        // =============================================
        // PROJECT SIGN LOCATIONS
        // =============================================

        createProjectSign(
            "smartvoc",
            5,
            -3
        );


        createProjectSign(
            "blockfight",
            -5,
            -12
        );


        createProjectSign(
            "uiux",
            5,
            -22
        );


        createProjectSign(
            "graphic",
            -5,
            -32
        );


        // =============================================
        // INTERACTION PROMPT
        // =============================================

        const interactionPrompt =
            document.getElementById(
                "interaction-prompt"
            );


        let nearestProject =
            null;


        // =============================================
        // UPDATE PROJECT DETECTION
        // =============================================

        function updateProjectDetection() {

            if (
                projectOpen
            ) {

                if (
                    interactionPrompt
                ) {

                    interactionPrompt.classList.add(
                        "hidden"
                    );

                }

                nearestProject =
                    null;

                return;

            }


            let closest =
                null;


            let closestDistance =
                Infinity;


            for (
                const sign
                of projectSigns
            ) {

                const dx =
                    player.position.x -
                    sign.position.x;


                const dz =
                    player.position.z -
                    sign.position.z;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dz * dz
                    );


                if (
                    distance <
                    sign.userData.interactionRadius &&
                    distance <
                    closestDistance
                ) {

                    closest =
                        sign;

                    closestDistance =
                        distance;

                }

            }


            nearestProject =
                closest;


            if (
                interactionPrompt
            ) {

                if (
                    nearestProject
                ) {

                    interactionPrompt.classList.remove(
                        "hidden"
                    );


                    const key =
                        interactionPrompt.querySelector(
                            ".key"
                        );


                    if (
                        key
                    ) {

                        key.textContent =
                            "E";

                    }


                    const textElements =
                        interactionPrompt.querySelectorAll(
                            "span"
                        );


                    if (
                        textElements.length >
                        1
                    ) {

                        textElements[
                            textElements.length - 1
                        ].textContent =
                            "View Project";

                    }

                } else {

                    interactionPrompt.classList.add(
                        "hidden"
                    );

                }

            }

        }


        // =============================================
        // PROJECT PANEL
        // =============================================

        const projectPanel =
            document.getElementById(
                "project-panel"
            );


        const backButton =
            document.querySelector(
                ".back-button"
            );


        let projectOpen =
            false;


        // =============================================
        // OPEN PROJECT
        // =============================================

        function openProject(
            projectId
        ) {

            const data =
                projects[projectId];


            if (
                !data
            ) {

                return;

            }


            projectOpen =
                true;


            // =========================================
            // FIND COMMON PROJECT ELEMENTS
            // =========================================

            const title =
                document.getElementById(
                    "project-title"
                );


            const description =
                document.getElementById(
                    "project-description"
                );


            const about =
                document.getElementById(
                    "project-about"
                );


            const technologies =
                document.getElementById(
                    "project-technologies"
                );


            const contribution =
                document.getElementById(
                    "project-contribution"
                );


            if (
                title
            ) {

                title.textContent =
                    data.title;

            }


            if (
                description
            ) {

                description.textContent =
                    data.description;

            }


            if (
                about
            ) {

                about.textContent =
                    data.about;

            }


            if (
                technologies
            ) {

                technologies.textContent =
                    data.technologies;

            }


            if (
                contribution
            ) {

                contribution.textContent =
                    data.contribution;

            }


            // =========================================
            // LINKS
            // =========================================

            const githubLink =
                document.getElementById(
                    "project-github"
                );


            const demoLink =
                document.getElementById(
                    "project-demo"
                );


            if (
                githubLink
            ) {

                githubLink.href =
                    data.github;

            }


            if (
                demoLink
            ) {

                demoLink.href =
                    data.demo;

            }


            // =========================================
            // SHOW PANEL
            // =========================================

            if (
                projectPanel
            ) {

                projectPanel.classList.remove(
                    "hidden"
                );

            }


            // =========================================
            // HIDE PROMPT
            // =========================================

            if (
                interactionPrompt
            ) {

                interactionPrompt.classList.add(
                    "hidden"
                );

            }


            // =========================================
            // UNLOCK MOUSE
            // =========================================

            if (
                document.pointerLockElement
            ) {

                document.exitPointerLock();

            }


            console.log(
                "Project opened:",
                data.title
            );

        }


        // =============================================
        // E INTERACTION
        // =============================================

        function interactWithProject() {

            if (
                projectOpen
            ) {

                return;

            }


            if (
                !nearestProject
            ) {

                return;

            }


            const projectId =
                nearestProject.userData.projectId;


            openProject(
                projectId
            );

        }


        // =============================================
        // CLOSE PROJECT
        // =============================================

        function closeProject() {

            projectOpen =
                false;


            if (
                projectPanel
            ) {

                projectPanel.classList.add(
                    "hidden"
                );

            }


            nearestProject =
                null;


            // =========================================
            // RELOCK MOUSE
            // =========================================

            canvas.requestPointerLock();

        }


        // =============================================
        // BACK BUTTON
        // =============================================

        if (
            backButton
        ) {

            backButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    closeProject();

                }
            );

        }


        // =============================================
        // ESC
        // =============================================

        document.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.code === "Escape" &&
                    projectOpen
                ) {

                    closeProject();

                }

            }
        );


        // =============================================
        // NPC CREATION (FULL BODY)
        // =============================================

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


            scene.add(
                npc
            );


            // =========================================
            // BODY
            // =========================================

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


            npc.add(
                npcBody
            );


            // =========================================
            // HEAD
            // =========================================

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


            npc.add(
                npcHead
            );


            // =========================================
            // LEGS
            // =========================================

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


            npc.add(
                npcLeftLeg
            );


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


            npc.add(
                npcRightLeg
            );


            // =========================================
            // ARMS
            // =========================================

            const npcArmGeometry =
                new THREE.BoxGeometry(
                    0.18,
                    0.75,
                    0.22
                );


            const npcArmMaterial =
                new THREE.MeshStandardMaterial({
                    color: color
                })


            const npcLeftArm =
                new THREE.Mesh(
                    npcArmGeometry,
                    npcArmMaterial
                );


            npcLeftArm.position.set(
                -0.50,
                1.15,
                0
            );


            npcLeftArm.castShadow = true;


            npc.add(
                npcLeftArm
            );


            const npcRightArm =
                new THREE.Mesh(
                    npcArmGeometry,
                    npcArmMaterial
                );


            npcRightArm.position.set(
                0.50,
                1.15,
                0
            );


            npcRightArm.castShadow = true;


            npc.add(
                npcRightArm
            );


            // =========================================
            // NPC DATA
            // =========================================

            npc.userData.startX =
                x;


            npc.userData.startZ =
                z;


            npc.userData.pathLength =
                pathLength;


            npc.userData.speed =
                1.2 +
                Math.random() *
                0.6;


            npc.userData.direction =
                1;


            npc.userData.walkTime =
                0;


            npc.userData.leftLeg =
                npcLeftLeg;


            npc.userData.rightLeg =
                npcRightLeg;


            npc.userData.leftArm =
                npcLeftArm;


            npc.userData.rightArm =
                npcRightArm;


            npc.rotation.y =
                Math.PI / 2;


            return npc;

        }


        // =============================================
        // NPCS
        // =============================================

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


        // =============================================
        // NPC UPDATE
        // =============================================

        function updateNPCs(
            delta
        ) {

            npcs.forEach(
                function(npc) {

                    npc.userData.walkTime +=
                        delta *
                        8;


                    const offset =
                        npc.userData.direction *
                        npc.userData.speed *
                        delta;


                    npc.position.x +=
                        offset;


                    const distance =
                        npc.position.x -
                        npc.userData.startX;


                    // =================================
                    // TURN AROUND
                    // =================================

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


                    // =================================
                    // WALK ANIMATION
                    // =================================

                    const swing =
                        Math.sin(
                            npc.userData.walkTime
                        ) *
                        0.45;


                    npc.userData.leftLeg.rotation.x =
                        swing;


                    npc.userData.rightLeg.rotation.x =
                        -swing;


                    // Arms opposite legs
                    npc.userData.leftArm.rotation.x =
                        -swing;


                    npc.userData.rightArm.rotation.x =
                        swing;

                }
            );

        }


        // =============================================
        // LOADING SCREEN
        // =============================================

        const loadingScreen =
            document.getElementById(
                "loading-screen"
            );


        if (
            loadingScreen
        ) {

            loadingScreen.classList.add(
                "hidden"
            );

        }


        // =============================================
        // RESIZE
        // =============================================

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


        // =============================================
        // CLOCK
        // =============================================

        const clock =
            new THREE.Clock();


        // =============================================
        // INITIAL CAMERA
        // =============================================

        updateCamera(
            0.016
        );


        // =============================================
        // ANIMATION LOOP
        // =============================================

        function animate() {

            requestAnimationFrame(
                animate
            );


            const delta =
                Math.min(
                    clock.getDelta(),
                    0.05
                );


            // =========================================
            // PLAYER
            // =========================================

            updatePlayer(
                delta
            );


            updatePlayerAnimation(
                delta
            );


            // =========================================
            // NPC
            // =========================================

            updateNPCs(
                delta
            );


            // =========================================
            // PROJECT DETECTION
            // =========================================

            updateProjectDetection();


            // =========================================
            // CAMERA
            // =========================================

            updateCamera(
                delta
            );


            // =========================================
            // RENDER
            // =========================================

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
            "Third-person + collision + project interaction active."
        );

    }

}
