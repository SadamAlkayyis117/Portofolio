// =====================================================
// SADAM ALKAYYIS - INTERACTIVE 3D PORTFOLIO
// STEP 5 - PLAYER / MOVEMENT / NPC / INTERACTION
// THREE.JS R128
// =====================================================

console.log("=== PORTFOLIO SCRIPT START ===");


// =====================================================
// CHECK THREE.JS
// =====================================================

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


    // =================================================
    // SCENE
    // =================================================

    const scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(0x87ceeb);

    scene.fog =
        new THREE.Fog(
            0x87ceeb,
            35,
            100
        );


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
    // MAIN PATH
    // =================================================

    const pathGeometry =
        new THREE.PlaneGeometry(
            7,
            80
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
        0.025,
        -25
    );

    scene.add(
        path
    );


    // =================================================
    // DECORATIVE BOX
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
    // ENVIRONMENT OBJECTS
    // =================================================

    createBox(
        4,
        2,
        4,
        0x8b6f47,
        -7,
        1,
        -10
    );


    createBox(
        3,
        3,
        3,
        0x6d8f52,
        7,
        1.5,
        -16
    );


    createBox(
        5,
        1,
        5,
        0x77624a,
        0,
        0.5,
        -27
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

        scene.add(
            trunk
        );


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

    createTree(-10, -30);
    createTree(10, -35);

    createTree(-14, -45);
    createTree(14, -48);


    // =================================================
    // PLAYER
    // =================================================

    const player = {

        position:
            new THREE.Vector3(
                0,
                0,
                5
            ),

        height: 1.7,

        speed: 6,

        yaw: 0,

        pitch: 0

    };


    // =================================================
    // PLAYER BODY
    // =================================================

    const playerGroup =
        new THREE.Group();


    const bodyGeometry =
        new THREE.CapsuleGeometry(
            0.35,
            0.8,
            4,
            8
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x222222
        });

    const playerBody =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    playerBody.position.y =
        0.8;

    playerBody.castShadow = true;

    playerGroup.add(
        playerBody
    );


    // Head

    const headGeometry =
        new THREE.SphereGeometry(
            0.3,
            12,
            12
        );

    const headMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xd6a27a
        });

    const playerHead =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        );

    playerHead.position.y =
        1.55;

    playerHead.castShadow = true;

    playerGroup.add(
        playerHead
    );


    playerGroup.position.copy(
        player.position
    );

    scene.add(
        playerGroup
    );


    // =================================================
    // CAMERA INITIAL POSITION
    // =================================================

    camera.position.set(
        player.position.x,
        player.height,
        player.position.z
    );


    // =================================================
    // KEYBOARD
    // =================================================

    const keys = {

        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false

    };


    window.addEventListener(
        "keydown",
        function(event) {

            if (
                event.code in keys
            ) {

                keys[event.code] =
                    true;

                event.preventDefault();
            }


            // -----------------------------------------
            // INTERACTION
            // -----------------------------------------

            if (
                event.code === "KeyE"
            ) {

                interact();
            }

        }
    );


    window.addEventListener(
        "keyup",
        function(event) {

            if (
                event.code in keys
            ) {

                keys[event.code] =
                    false;

                event.preventDefault();
            }

        }
    );


    // =================================================
    // MOUSE LOOK
    // =================================================

    const mouseSensitivity =
        0.0025;


    document.addEventListener(
        "mousemove",
        function(event) {

            if (
                document.pointerLockElement !==
                canvas
            ) {

                return;
            }


            player.yaw -=
                event.movementX *
                mouseSensitivity;


            player.pitch -=
                event.movementY *
                mouseSensitivity;


            const limit =
                Math.PI / 2 - 0.1;


            player.pitch =
                Math.max(
                    -limit,
                    Math.min(
                        limit,
                        player.pitch
                    )
                );

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


    let gameStarted =
        false;


    if (startButton) {

        startButton.addEventListener(
            "click",
            function() {

                gameStarted =
                    true;


                startScreen.classList.add(
                    "hidden"
                );


                // Request mouse control

                if (
                    canvas.requestPointerLock
                ) {

                    canvas.requestPointerLock();

                }


                console.log(
                    "Portfolio started."
                );

            }
        );

    }


    // =================================================
    // PLAYER MOVEMENT
    // =================================================

    function updatePlayer(
        delta
    ) {

        if (
            !gameStarted
        ) {

            return;
        }


        const direction =
            new THREE.Vector3();


        // Forward / backward

        if (
            keys.KeyW
        ) {

            direction.z -= 1;

        }


        if (
            keys.KeyS
        ) {

            direction.z += 1;

        }


        // Left / right

        if (
            keys.KeyA
        ) {

            direction.x -= 1;

        }


        if (
            keys.KeyD
        ) {

            direction.x += 1;

        }


        if (
            direction.lengthSq() === 0
        ) {

            return;
        }


        direction.normalize();


        // Rotate movement according to camera yaw

        const sin =
            Math.sin(
                player.yaw
            );

        const cos =
            Math.cos(
                player.yaw
            );


        const moveX =
            direction.x * cos -
            direction.z * sin;


        const moveZ =
            direction.x * sin +
            direction.z * cos;


        player.position.x +=
            moveX *
            player.speed *
            delta;


        player.position.z +=
            moveZ *
            player.speed *
            delta;


        // World boundaries

        player.position.x =
            THREE.MathUtils.clamp(
                player.position.x,
                -45,
                45
            );


        player.position.z =
            THREE.MathUtils.clamp(
                player.position.z,
                -75,
                8
            );


        // Player body

        playerGroup.position.copy(
            player.position
        );


        // Camera

        camera.position.set(
            player.position.x,
            player.position.y +
            player.height,
            player.position.z
        );

    }


    // =================================================
    // CAMERA ROTATION
    // =================================================

    function updateCamera() {

        camera.rotation.order =
            "YXZ";


        camera.rotation.y =
            player.yaw;


        camera.rotation.x =
            player.pitch;

    }


    // =================================================
    // NPC SYSTEM
    // =================================================

    const npcs = [];


    function createNPC(
        x,
        z,
        color,
        name
    ) {

        const npc =
            new THREE.Group();


        // Body

        const bodyGeometry =
            new THREE.CapsuleGeometry(
                0.35,
                0.8,
                4,
                8
            );

        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: color
            });

        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );

        body.position.y =
            0.8;

        body.castShadow = true;

        npc.add(
            body
        );


        // Head

        const headGeometry =
            new THREE.SphereGeometry(
                0.3,
                12,
                12
            );

        const headMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xd6a27a
            });

        const head =
            new THREE.Mesh(
                headGeometry,
                headMaterial
            );

        head.position.y =
            1.55;

        head.castShadow = true;

        npc.add(
            head
        );


        npc.position.set(
            x,
            0,
            z
        );


        scene.add(
            npc
        );


        const npcData = {

            object: npc,

            name: name,

            startX: x,

            startZ: z,

            time: Math.random() * 10,

            radius: 4,

            speed:
                0.7 +
                Math.random() * 0.5,

            direction:
                Math.random() * Math.PI * 2

        };


        npcs.push(
            npcData
        );


        return npcData;
    }


    // NPC 1

    createNPC(
        -5,
        -5,
        0x355c7d,
        "Alex"
    );


    // NPC 2

    createNPC(
        5,
        -13,
        0x9b59b6,
        "Maya"
    );


    // NPC 3

    createNPC(
        -5,
        -25,
        0xe67e22,
        "Jordan"
    );


    // NPC 4

    createNPC(
        6,
        -38,
        0x16a085,
        "Riley"
    );


    // =================================================
    // NPC MOVEMENT
    // =================================================

    function updateNPCs(
        delta
    ) {

        npcs.forEach(
            function(npc) {

                npc.time +=
                    delta *
                    npc.speed;


                const angle =
                    npc.time;


                const targetX =
                    npc.startX +
                    Math.cos(angle) *
                    npc.radius;


                const targetZ =
                    npc.startZ +
                    Math.sin(angle) *
                    npc.radius;


                const dx =
                    targetX -
                    npc.object.position.x;


                const dz =
                    targetZ -
                    npc.object.position.z;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dz * dz
                    );


                if (
                    distance > 0.05
                ) {

                    npc.object.position.x +=
                        dx *
                        delta *
                        npc.speed;


                    npc.object.position.z +=
                        dz *
                        delta *
                        npc.speed;


                    npc.object.rotation.y =
                        Math.atan2(
                            dx,
                            dz
                        );

                }

            }
        );

    }


    // =================================================
    // PROJECT SIGN SYSTEM
    // =================================================

    const interactables = [];


    function createTextTexture(
        title,
        subtitle
    ) {

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width = 1024;
        canvas.height = 512;


        const context =
            canvas.getContext(
                "2d"
            );


        context.fillStyle =
            "#101820";

        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        context.fillStyle =
            "#ffffff";

        context.textAlign =
            "center";


        context.font =
            "bold 70px Arial";

        context.fillText(
            title,
            512,
            220
        );


        context.font =
            "32px Arial";

        context.fillStyle =
            "#9ad7ff";

        context.fillText(
            subtitle,
            512,
            290
        );


        context.font =
            "bold 26px Arial";

        context.fillStyle =
            "#ffffff";

        context.fillText(
            "PRESS E TO EXPLORE",
            512,
            390
        );


        return new THREE.CanvasTexture(
            canvas
        );

    }


    function createProjectSign(
        title,
        subtitle,
        x,
        z,
        projectId
    ) {

        const group =
            new THREE.Group();


        // Pole

        const poleGeometry =
            new THREE.CylinderGeometry(
                0.12,
                0.12,
                3,
                8
            );

        const poleMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x333333
            });

        const pole =
            new THREE.Mesh(
                poleGeometry,
                poleMaterial
            );

        pole.position.y =
            1.5;

        pole.castShadow = true;

        group.add(
            pole
        );


        // Sign board

        const signGeometry =
            new THREE.BoxGeometry(
                3.5,
                1.8,
                0.18
            );

        const signMaterial =
            new THREE.MeshStandardMaterial({
                map:
                    createTextTexture(
                        title,
                        subtitle
                    )
            });


        const sign =
            new THREE.Mesh(
                signGeometry,
                signMaterial
            );


        sign.position.y =
            3;

        sign.castShadow = true;

        group.add(
            sign
        );


        group.position.set(
            x,
            0,
            z
        );


        scene.add(
            group
        );


        interactables.push({

            object: group,

            type: "project",

            projectId: projectId,

            title: title

        });


        return group;
    }


    // =================================================
    // PROJECTS
    // =================================================

    createProjectSign(
        "SMARTVOC",
        "GAME DEVELOPMENT",
        -5,
        -12,
        "smartvoc"
    );


    createProjectSign(
        "BLOCKFIGHT",
        "GAME DEVELOPMENT",
        5,
        -22,
        "blockfight"
    );


    createProjectSign(
        "UI / UX",
        "FIGMA PROJECTS",
        -5,
        -34,
        "uiux"
    );


    createProjectSign(
        "GRAPHIC DESIGN",
        "DESIGN PROJECTS",
        5,
        -45,
        "graphic"
    );


    // =================================================
    // INTERACTION PROMPT
    // =================================================

    const interactionPrompt =
        document.getElementById(
            "interaction-prompt"
        );


    let nearbyObject =
        null;


    function updateInteraction() {

        nearbyObject =
            null;


        let closestDistance =
            Infinity;


        interactables.forEach(
            function(item) {

                const distance =
                    player.position.distanceTo(
                        item.object.position
                    );


                if (
                    distance < 4 &&
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance;

                    nearbyObject =
                        item;

                }

            }
        );


        if (
            nearbyObject
        ) {

            interactionPrompt.classList.remove(
                "hidden"
            );

        } else {

            interactionPrompt.classList.add(
                "hidden"
            );

        }

    }


    // =================================================
    // PROJECT DATA
    // =================================================

    const projects = {

        smartvoc: {

            category:
                "GAME DEVELOPMENT",

            title:
                "SmartVoc",

            description:
                "3D open-world English learning RPG developed for university students.",

            about:
                "An experiential English learning game where players explore an open world, interact with NPCs, complete activities, learn vocabulary and progress through different learning levels.",

            technologies:
                "Godot Engine · GDScript · Blender · JSON",

            contribution:
                "Game Design · Gameplay Programming · UI/UX · System Development",

            github:
                "https://github.com/SadamAlkayyis117",

            demo:
                "#",

            screenshots: []

        },


        blockfight: {

            category:
                "GAME DEVELOPMENT",

            title:
                "BlockFight",

            description:
                "3D game project focused on gameplay systems and interactive environments.",

            about:
                "A separate game development project exploring gameplay mechanics, level design and interactive systems.",

            technologies:
                "Godot Engine · GDScript · Blender",

            contribution:
                "Gameplay Programming · Game Design · 3D Development",

            github:
                "https://github.com/SadamAlkayyis117",

            demo:
                "#",

            screenshots: []

        },


        uiux: {

            category:
                "UI / UX DESIGN",

            title:
                "UI / UX Projects",

            description:
                "Interface and experience design projects created with Figma.",

            about:
                "A collection of interface design and prototyping projects focusing on visual hierarchy, usability and interaction flow.",

            technologies:
                "Figma · UI Design · Prototyping",

            contribution:
                "UI Design · UX Research · Prototyping",

            github:
                "#",

            demo:
                "#",

            screenshots: []

        },


        graphic: {

            category:
                "GRAPHIC DESIGN",

            title:
                "Graphic Design",

            description:
                "Selected graphic design and visual communication projects.",

            about:
                "A collection of graphic design work including illustrations, visual assets, promotional designs and digital artwork.",

            technologies:
                "CorelDRAW · Adobe tools · Digital Illustration",

            contribution:
                "Graphic Design · Illustration · Visual Development",

            github:
                "https://github.com/SadamAlkayyis117/Graphic-Designer",

            demo:
                "#",

            screenshots: []

        }

    };


    // =================================================
    // PROJECT PANEL
    // =================================================

    const projectPanel =
        document.getElementById(
            "project-panel"
        );


    const projectBackButton =
        document.getElementById(
            "project-back-button"
        );


    function openProject(
        projectId
    ) {

        const project =
            projects[projectId];


        if (
            !project
        ) {

            return;
        }


        document.getElementById(
            "project-category"
        ).textContent =
            project.category;


        document.getElementById(
            "project-title"
        ).textContent =
            project.title;


        document.getElementById(
            "project-description"
        ).textContent =
            project.description;


        document.getElementById(
            "project-about"
        ).textContent =
            project.about;


        document.getElementById(
            "project-technologies"
        ).textContent =
            project.technologies;


        document.getElementById(
            "project-contribution"
        ).textContent =
            project.contribution;


        const github =
            document.getElementById(
                "project-github"
            );


        const demo =
            document.getElementById(
                "project-demo"
            );


        github.href =
            project.github;


        demo.href =
            project.demo;


        // Close pointer lock

        if (
            document.exitPointerLock
        ) {

            document.exitPointerLock();

        }


        projectPanel.classList.remove(
            "hidden"
        );

    }


    if (
        projectBackButton
    ) {

        projectBackButton.addEventListener(
            "click",
            function() {

                projectPanel.classList.add(
                    "hidden"
                );


                canvas.requestPointerLock();

            }
        );

    }


    // =================================================
    // INTERACT
    // =================================================

    function interact() {

        if (
            !gameStarted
        ) {

            return;
        }


        if (
            !nearbyObject
        ) {

            return;
        }


        if (
            nearbyObject.type ===
            "project"
        ) {

            openProject(
                nearbyObject.projectId
            );

        }

    }


    // =================================================
    // FINISH FLAG
    // =================================================

    function createFinishFlag() {

        const group =
            new THREE.Group();


        const poleGeometry =
            new THREE.CylinderGeometry(
                0.12,
                0.12,
                4,
                8
            );

        const poleMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            });


        const pole =
            new THREE.Mesh(
                poleGeometry,
                poleMaterial
            );


        pole.position.y =
            2;

        group.add(
            pole
        );


        const flagGeometry =
            new THREE.PlaneGeometry(
                2.2,
                1.2
            );


        const flagMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111,
                side:
                    THREE.DoubleSide
            });


        const flag =
            new THREE.Mesh(
                flagGeometry,
                flagMaterial
            );


        flag.position.set(
            1,
            3.3,
            0
        );


        group.add(
            flag
        );


        group.position.set(
            0,
            0,
            -70
        );


        scene.add(
            group
        );


        return group;

    }


    const finishFlag =
        createFinishFlag();


    // =================================================
    // FINISH SCREEN
    // =================================================

    const finishScreen =
        document.getElementById(
            "finish-screen"
        );


    let finished =
        false;


    function checkFinish() {

        if (
            finished
        ) {

            return;
        }


        const distance =
            player.position.distanceTo(
                finishFlag.position
            );


        if (
            distance < 4
        ) {

            finished =
                true;


            if (
                document.exitPointerLock
            ) {

                document.exitPointerLock();

            }


            finishScreen.classList.remove(
                "hidden"
            );

        }

    }


    // =================================================
    // RESTART
    // =================================================

    const restartButton =
        document.getElementById(
            "restart-button"
        );


    if (
        restartButton
    ) {

        restartButton.addEventListener(
            "click",
            function() {

                player.position.set(
                    0,
                    0,
                    5
                );


                player.yaw =
                    0;


                player.pitch =
                    0;


                camera.position.set(
                    0,
                    player.height,
                    5
                );


                finishScreen.classList.add(
                    "hidden"
                );


                finished =
                    false;


                canvas.requestPointerLock();

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


    if (
        loadingScreen
    ) {

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
    // ANIMATION
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


        updatePlayer(
            delta
        );


        updateCamera();


        updateNPCs(
            delta
        );


        updateInteraction();


        checkFinish();


        renderer.render(
            scene,
            camera
        );

    }


    // =================================================
    // START
    // =================================================

    animate();


    console.log(
        "=== 3D WORLD RUNNING ==="
    );

}
