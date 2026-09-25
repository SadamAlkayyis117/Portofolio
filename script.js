// =====================================================
// SADAM ALKAYYIS - INTERACTIVE 3D PORTFOLIO
// STEP 6 - FULL FIXED
// THIRD PERSON + COLLISION + HOUSES + NPC ANIMATIONS + SIGN
// =====================================================

console.log("=== PORTFOLIO SCRIPT START ===");

if (typeof THREE === "undefined") {
    console.error("Three.js gagal dimuat.");
} else {
    console.log("Three.js berhasil dimuat. Version:", THREE.REVISION);

    // =================================================
    // CANVAS
    // =================================================
    const canvas = document.getElementById("game-canvas");

    if (!canvas) {
        console.error("Canvas #game-canvas tidak ditemukan.");
    } else {
        // =============================================
        // SCENE
        // =============================================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        scene.fog = new THREE.Fog(0x87ceeb, 30, 100);

        // =============================================
        // CAMERA
        // =============================================
        const camera = new THREE.PerspectiveCamera(
            65,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // =============================================
        // RENDERER
        // =============================================
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // =============================================
        // LIGHTING
        // =============================================
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x557755, 2);
        scene.add(hemisphereLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 3);
        sunLight.position.set(20, 40, 20);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        scene.add(sunLight);

        // =============================================
        // GROUND
        // =============================================
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x4f7d3a });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // =============================================
        // MAIN PATH
        // =============================================
        const pathGeometry = new THREE.PlaneGeometry(6, 60);
        const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xb89b6a });
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        path.rotation.x = -Math.PI / 2;
        path.position.set(0, 0.02, -20);
        path.receiveShadow = true;
        scene.add(path);

        // =============================================
        // COLLISION SYSTEM
        // =============================================
        const collisionObjects = [];
        const npcCollisionObjects = [];
        const PLAYER_RADIUS = 0.45;
        const NPC_RADIUS = 0.55;

        function addCollisionBox(x, z, width, depth) {
            collisionObjects.push({
                x: x,
                z: z,
                halfWidth: width / 2,
                halfDepth: depth / 2
            });
        }

        function addNPCCollider(npc) {
            npcCollisionObjects.push({
                npc: npc,
                radius: NPC_RADIUS
            });
        }

        // =============================================
        // RESOLVE PLAYER VS STATIC OBJECTS
        // =============================================
        function resolvePlayerCollision(position) {
            for (const collider of collisionObjects) {
                const closestX = THREE.MathUtils.clamp(
                    position.x,
                    collider.x - collider.halfWidth,
                    collider.x + collider.halfWidth
                );
                const closestZ = THREE.MathUtils.clamp(
                    position.z,
                    collider.z - collider.halfDepth,
                    collider.z + collider.halfDepth
                );

                let dx = position.x - closestX;
                let dz = position.z - closestZ;
                const distanceSq = dx * dx + dz * dz;

                if (distanceSq < PLAYER_RADIUS * PLAYER_RADIUS) {
                    let distance = Math.sqrt(distanceSq);

                    if (distance === 0) {
                        const pushX = Math.min(
                            Math.abs(position.x - (collider.x - collider.halfWidth)),
                            Math.abs(position.x - (collider.x + collider.halfWidth))
                        );
                        const pushZ = Math.min(
                            Math.abs(position.z - (collider.z - collider.halfDepth)),
                            Math.abs(position.z - (collider.z + collider.halfDepth))
                        );

                        if (pushX < pushZ) {
                            position.x = position.x < collider.x
                                ? collider.x - collider.halfWidth - PLAYER_RADIUS
                                : collider.x + collider.halfWidth + PLAYER_RADIUS;
                        } else {
                            position.z = position.z < collider.z
                                ? collider.z - collider.halfDepth - PLAYER_RADIUS
                                : collider.z + collider.halfDepth + PLAYER_RADIUS;
                        }
                        continue;
                    }

                    const penetration = PLAYER_RADIUS - distance;
                    dx /= distance;
                    dz /= distance;
                    position.x += dx * penetration;
                    position.z += dz * penetration;
                }
            }
        }

        // =============================================
        // RESOLVE PLAYER VS NPC COLLISION
        // =============================================
        function resolvePlayerVsNPC() {
            for (const collider of npcCollisionObjects) {
                const npc = collider.npc;
                const dx = player.position.x - npc.position.x;
                const dz = player.position.z - npc.position.z;
                let distance = Math.sqrt(dx * dx + dz * dz);
                const minimumDistance = PLAYER_RADIUS + collider.radius;

                if (distance < minimumDistance) {
                    if (distance < 0.001) {
                        player.position.x += minimumDistance;
                        continue;
                    }
                    const push = minimumDistance - distance;
                    const normalX = dx / distance;
                    const normalZ = dz / distance;
                    player.position.x += normalX * push;
                    player.position.z += normalZ * push;
                }
            }
        }

        // =============================================
        // REAL 3D HOUSE CREATION
        // =============================================
        function createHouse(x, z, width, depth, wallColor, roofColor) {
            const house = new THREE.Group();
            house.position.set(x, 0, z);
            scene.add(house);

            const wallHeight = 2.8;
            const wallThickness = 0.3;
            const wallMaterial = new THREE.MeshStandardMaterial({ color: wallColor });
            const roofMaterial = new THREE.MeshStandardMaterial({ color: roofColor });
            const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x5b3824 });

            // Back Wall
            const backWall = new THREE.Mesh(
                new THREE.BoxGeometry(width, wallHeight, wallThickness),
                wallMaterial
            );
            backWall.position.set(0, wallHeight / 2, -depth / 2);
            backWall.castShadow = true;
            house.add(backWall);

            // Left Wall
            const leftWall = new THREE.Mesh(
                new THREE.BoxGeometry(wallThickness, wallHeight, depth),
                wallMaterial
            );
            leftWall.position.set(-width / 2, wallHeight / 2, 0);
            leftWall.castShadow = true;
            house.add(leftWall);

            // Right Wall
            const rightWall = new THREE.Mesh(
                new THREE.BoxGeometry(wallThickness, wallHeight, depth),
                wallMaterial
            );
            rightWall.position.set(width / 2, wallHeight / 2, 0);
            rightWall.castShadow = true;
            house.add(rightWall);

            // Front Wall
            const frontWall = new THREE.Mesh(
                new THREE.BoxGeometry(width, wallHeight, wallThickness),
                wallMaterial
            );
            frontWall.position.set(0, wallHeight / 2, depth / 2);
            frontWall.castShadow = true;
            house.add(frontWall);

            // Roof (Gable style)
            const roofLeft = new THREE.Mesh(
                new THREE.BoxGeometry(width + 0.8, 0.35, depth + 0.8),
                roofMaterial
            );
            roofLeft.position.set(-width * 0.23, wallHeight + 0.75, 0);
            roofLeft.rotation.z = -Math.PI / 6;
            roofLeft.castShadow = true;
            house.add(roofLeft);

            const roofRight = new THREE.Mesh(
                new THREE.BoxGeometry(width + 0.8, 0.35, depth + 0.8),
                roofMaterial
            );
            roofRight.position.set(width * 0.23, wallHeight + 0.75, 0);
            roofRight.rotation.z = Math.PI / 6;
            roofRight.castShadow = true;
            house.add(roofRight);

            // Door
            const door = new THREE.Mesh(
                new THREE.BoxGeometry(1.0, 1.8, 0.08),
                new THREE.MeshStandardMaterial({ color: 0x4a2b1b })
            );
            door.position.set(0, 0.9, depth / 2 + 0.05);
            door.castShadow = true;
            house.add(door);

            // Terrace
            const terrace = new THREE.Mesh(
                new THREE.BoxGeometry(width + 1.2, 0.2, 1.5),
                new THREE.MeshStandardMaterial({ color: 0xa98258 })
            );
            terrace.position.set(0, 0.1, depth / 2 + 0.75);
            terrace.castShadow = true;
            house.add(terrace);

            // Add Colliders for the House Walls
            addCollisionBox(x, z, width + 0.4, depth + 0.4);

            return house;
        }

        // Create Real Village Houses
        createHouse(-7, -8, 6, 6, 0xc08b5c, 0x7a3328);
        createHouse(7, -15, 6, 7, 0x9eaf78, 0x4d5c38);
        createHouse(-7, -28, 7, 6, 0xd1a06b, 0x65402c);

        // =============================================
        // TREE
        // =============================================
        function createTree(x, z) {
            const trunkGeometry = new THREE.CylinderGeometry(0.35, 0.45, 3, 8);
            const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x6b4423 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.set(x, 1.5, z);
            trunk.castShadow = true;
            scene.add(trunk);

            const leavesGeometry = new THREE.SphereGeometry(1.7, 12, 12);
            const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2f6b32 });
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.set(x, 4, z);
            leaves.castShadow = true;
            scene.add(leaves);

            addCollisionBox(x, z, 1.2, 1.2);
        }

        createTree(-10, -5);
        createTree(10, -7);
        createTree(-12, -18);
        createTree(12, -22);
        createTree(4, -25);

        // =============================================
        // PLAYER
        // =============================================
        const player = new THREE.Group();
        player.position.set(0, 0, 6);
        scene.add(player);

        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.2, 0.45),
            new THREE.MeshStandardMaterial({ color: 0x2d5bff })
        );
        body.position.y = 1.15;
        body.castShadow = true;
        player.add(body);

        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.35, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xf0c8a0 })
        );
        head.position.y = 2.0;
        head.castShadow = true;
        player.add(head);

        // Legs
        const legGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.3);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x202020 });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.2, 0.4, 0);
        leftLeg.castShadow = true;
        player.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.2, 0.4, 0);
        rightLeg.castShadow = true;
        player.add(rightLeg);

        // Arms
        const armGeometry = new THREE.BoxGeometry(0.2, 0.9, 0.25);
        const leftArm = new THREE.Mesh(armGeometry, body.material);
        leftArm.position.set(-0.55, 1.2, 0);
        leftArm.castShadow = true;
        player.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, body.material);
        rightArm.position.set(0.55, 1.2, 0);
        rightArm.castShadow = true;
        player.add(rightArm);

        // =============================================
        // THIRD PERSON CAMERA
        // =============================================
        let cameraYaw = 0;
        let cameraPitch = 0.18;
        let cameraDistance = 6.0;

        const CAMERA_MIN_DISTANCE = 3.5;
        const CAMERA_MAX_DISTANCE = 9.0;
        const CAMERA_HEIGHT = 2.8;
        const CAMERA_LOOK_HEIGHT = 1.15;

        const cameraTarget = new THREE.Vector3();
        const cameraDesiredPosition = new THREE.Vector3();
        const cameraFollowSpeed = 12;

        // =============================================
        // INPUT
        // =============================================
        const keys = {};

        window.addEventListener("keydown", function(event) {
            keys[event.code] = true;
            if (event.code === "KeyE") {
                interactWithProject();
            }
        });

        window.addEventListener("keyup", function(event) {
            keys[event.code] = false;
        });

        // =============================================
        // MOUSE / POINTER LOCK
        // =============================================
        let mouseLocked = false;

        document.addEventListener("pointerlockchange", function() {
            mouseLocked = document.pointerLockElement === canvas;
        });

        document.addEventListener("mousemove", function(event) {
            if (!mouseLocked || projectOpen) return;
            const sensitivity = 0.0025;
            cameraYaw -= event.movementX * sensitivity;
            cameraPitch -= event.movementY * sensitivity;
            cameraPitch = THREE.MathUtils.clamp(cameraPitch, -0.65, 0.85);
        });

        canvas.addEventListener("wheel", function(event) {
            if (projectOpen) return;
            event.preventDefault();
            cameraDistance += event.deltaY * 0.005;
            cameraDistance = THREE.MathUtils.clamp(
                cameraDistance,
                CAMERA_MIN_DISTANCE,
                CAMERA_MAX_DISTANCE
            );
        }, { passive: false });

        // =============================================
        // START SCREEN
        // =============================================
        const startScreen = document.getElementById("start-screen");
        const startButton = document.getElementById("start-button");

        if (startButton) {
            startButton.addEventListener("click", function() {
                if (startScreen) {
                    startScreen.classList.add("hidden");
                }
                canvas.requestPointerLock();
                console.log("Portfolio started.");
            });
        }

        // =============================================
        // PLAYER MOVEMENT & ANIMATION
        // =============================================
        const moveDirection = new THREE.Vector3();
        const cameraForward = new THREE.Vector3();
        const cameraRight = new THREE.Vector3();
        const velocity = new THREE.Vector3();
        const moveSpeed = 6;
        const rotationSpeed = 10;
        let walkTime = 0;

        function updatePlayer(delta) {
            if (projectOpen) {
                moveDirection.set(0, 0, 0);
                return;
            }

            moveDirection.set(0, 0, 0);

            cameraForward.set(Math.sin(cameraYaw), 0, Math.cos(cameraYaw)).normalize();
            cameraRight.set(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw)).normalize();

            if (keys["KeyW"] || keys["ArrowUp"]) moveDirection.add(cameraForward);
            if (keys["KeyS"] || keys["ArrowDown"]) moveDirection.sub(cameraForward);
            if (keys["KeyA"] || keys["ArrowLeft"]) moveDirection.sub(cameraRight);
            if (keys["KeyD"] || keys["ArrowRight"]) moveDirection.add(cameraRight);

            const isMoving = moveDirection.lengthSq() > 0;

            if (isMoving) {
                moveDirection.normalize();
                velocity.copy(moveDirection).multiplyScalar(moveSpeed * delta);

                player.position.x += velocity.x;
                resolvePlayerCollision(player.position);

                player.position.z += velocity.z;
                resolvePlayerCollision(player.position);

                resolvePlayerVsNPC();

                const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
                let rotationDifference = targetRotation - player.rotation.y;

                while (rotationDifference > Math.PI) rotationDifference -= Math.PI * 2;
                while (rotationDifference < -Math.PI) rotationDifference += Math.PI * 2;

                player.rotation.y += rotationDifference * Math.min(1, delta * rotationSpeed);
            }

            player.position.x = THREE.MathUtils.clamp(player.position.x, -45, 45);
            player.position.z = THREE.MathUtils.clamp(player.position.z, -45, 45);
        }

        function updatePlayerAnimation(delta) {
            const isMoving = moveDirection.lengthSq() > 0;
            if (isMoving) {
                walkTime += delta * 10;
                const swing = Math.sin(walkTime) * 0.5;
                leftLeg.rotation.x = swing;
                rightLeg.rotation.x = -swing;
                leftArm.rotation.x = -swing;
                rightArm.rotation.x = swing;
            } else {
                leftLeg.rotation.x = 0;
                rightLeg.rotation.x = 0;
                leftArm.rotation.x = 0;
                rightArm.rotation.x = 0;
            }
        }

        function updateCamera(delta) {
            cameraTarget.set(
                player.position.x,
                player.position.y + CAMERA_LOOK_HEIGHT,
                player.position.z
            );

            const horizontalDistance = cameraDistance * Math.cos(cameraPitch);
            const verticalDistance = cameraDistance * Math.sin(cameraPitch);

            cameraDesiredPosition.set(
                player.position.x - Math.sin(cameraYaw) * horizontalDistance,
                player.position.y + CAMERA_HEIGHT - verticalDistance,
                player.position.z - Math.cos(cameraYaw) * horizontalDistance
            );

            const followAlpha = 1 - Math.pow(0.001, delta * cameraFollowSpeed);
            camera.position.lerp(cameraDesiredPosition, followAlpha);
            camera.lookAt(cameraTarget);
        }

        // =============================================
        // PROJECT SIGN DATA & CREATION (TIANG TINGGI & JELAS)
        // =============================================
        const projects = {
            smartvoc: {
                title: "SmartVoc",
                category: "GAME DEVELOPMENT",
                description: "3D open-world English learning RPG built for university students.",
                about: "An educational RPG that combines open-world exploration, NPC interaction, missions, and vocabulary learning.",
                technologies: "Godot Engine • GDScript • Blender • JSON",
                contribution: "Game design, gameplay programming, UI implementation, systems development.",
                github: "https://github.com/SadamAlkayyis117",
                demo: "#"
            },
            blockfight: {
                title: "BlockFight",
                category: "GAME DEVELOPMENT",
                description: "Interactive game project focused on gameplay systems and player interaction.",
                about: "A gameplay-focused project developed to explore game mechanics and interaction systems.",
                technologies: "Godot Engine • GDScript • Blender",
                contribution: "Gameplay programming, mechanics implementation, level design.",
                github: "https://github.com/SadamAlkayyis117",
                demo: "#"
            },
            uiux: {
                title: "UI / UX DESIGN",
                category: "UI / UX",
                description: "Interface and experience design projects created using Figma.",
                about: "A collection of interface design and prototyping work focused on usability and UX flow.",
                technologies: "Figma • UI Design • UX Design • Prototyping",
                contribution: "UI design, UX planning, wireframing, prototyping.",
                github: "#",
                demo: "#"
            },
            graphic: {
                title: "GRAPHIC DESIGN",
                category: "GRAPHIC DESIGN",
                description: "Visual design projects covering illustration, branding and digital artwork.",
                about: "A selection of graphic design work created across various projects.",
                technologies: "CorelDRAW • Adobe Photoshop • Digital Illustration",
                contribution: "Graphic design, illustration, composition, layout.",
                github: "#",
                demo: "#"
            }
        };

        const projectSigns = [];

        function createSignTexture(title, category) {
            const canvasTexture = document.createElement("canvas");
            canvasTexture.width = 1024;
            canvasTexture.height = 512;
            const context = canvasTexture.getContext("2d");

            context.fillStyle = "#111111";
            context.fillRect(0, 0, canvasTexture.width, canvasTexture.height);

            context.strokeStyle = "#4fd1c5";
            context.lineWidth = 14;
            context.strokeRect(12, 12, canvasTexture.width - 24, canvasTexture.height - 24);

            context.fillStyle = "#38bdf8";
            context.font = "bold 34px Arial";
            context.textAlign = "center";
            context.fillText(category, canvasTexture.width / 2, 100);

            context.fillStyle = "#ffffff";
            context.font = "bold 76px Arial";
            context.fillText(title, canvasTexture.width / 2, 215);

            context.fillStyle = "#a3e635";
            context.font = "bold 36px Arial";
            context.fillText("TEKAN E UNTUK MELIHAT", canvasTexture.width / 2, 385);

            const texture = new THREE.CanvasTexture(canvasTexture);
            if (THREE.SRGBColorSpace) {
                texture.colorSpace = THREE.SRGBColorSpace;
            } else if (THREE.sRGBEncoding) {
                texture.encoding = THREE.sRGBEncoding;
            }
            return texture;
        }

        // Fungsi membuat plang: Tiang berdiri tinggi dan kokoh
        function createProjectSign(projectId, x, z) {
            const data = projects[projectId];
            const sign = new THREE.Group();
            sign.position.set(x, 0, z);

            // Tiang plang tinggi (3.2 meter)
            const postHeight = 3.2;
            const post = new THREE.Mesh(
                new THREE.CylinderGeometry(0.14, 0.16, postHeight, 12),
                new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.6 })
            );
            post.position.y = postHeight / 2;
            post.castShadow = true;
            sign.add(post);

            // Papan Plang Besar terpasang di atas tiang
            const board = new THREE.Mesh(
                new THREE.BoxGeometry(3.6, 1.8, 0.2),
                new THREE.MeshStandardMaterial({
                    map: createSignTexture(data.title, data.category)
                })
            );
            board.position.y = 2.8; // Terangkat tinggi dan jelas terlihat
            board.castShadow = true;
            sign.add(board);

            // Lampu sorot kecil penanda plang
            const light = new THREE.PointLight(0x38bdf8, 1.5, 6);
            light.position.set(0, 3.8, 0.8);
            sign.add(light);

            addCollisionBox(x, z, 1.2, 1.2);

            sign.userData.projectId = projectId;
            sign.userData.interactionRadius = 4.0;
            projectSigns.push(sign);
            scene.add(sign);

            return sign;
        }

        createProjectSign("smartvoc", 5, -3);
        createProjectSign("blockfight", -5, -12);
        createProjectSign("uiux", 5, -22);
        createProjectSign("graphic", -5, -32);

        // =============================================
        // INTERACTION PROMPT & MODAL
        // =============================================
        const interactionPrompt = document.getElementById("interaction-prompt");
        let nearestProject = null;

        function updateProjectDetection() {
            if (projectOpen) {
                if (interactionPrompt) interactionPrompt.classList.add("hidden");
                nearestProject = null;
                return;
            }

            let closest = null;
            let closestDistance = Infinity;

            for (const sign of projectSigns) {
                const dx = player.position.x - sign.position.x;
                const dz = player.position.z - sign.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < sign.userData.interactionRadius && distance < closestDistance) {
                    closest = sign;
                    closestDistance = distance;
                }
            }

            nearestProject = closest;

            if (interactionPrompt) {
                if (nearestProject) {
                    interactionPrompt.classList.remove("hidden");
                } else {
                    interactionPrompt.classList.add("hidden");
                }
            }
        }

        const projectPanel = document.getElementById("project-panel");
        const backButton = document.querySelector(".back-button");
        let projectOpen = false;

        function openProject(projectId) {
            const data = projects[projectId];
            if (!data) return;

            projectOpen = true;

            const title = document.getElementById("project-title");
            const description = document.getElementById("project-description");
            const about = document.getElementById("project-about");
            const technologies = document.getElementById("project-technologies");
            const contribution = document.getElementById("project-contribution");

            if (title) title.textContent = data.title;
            if (description) description.textContent = data.description;
            if (about) about.textContent = data.about;
            if (technologies) technologies.textContent = data.technologies;
            if (contribution) contribution.textContent = data.contribution;

            const githubLink = document.getElementById("project-github");
            const demoLink = document.getElementById("project-demo");
            if (githubLink) githubLink.href = data.github;
            if (demoLink) demoLink.href = data.demo;

            if (projectPanel) projectPanel.classList.remove("hidden");
            if (interactionPrompt) interactionPrompt.classList.add("hidden");
            if (document.pointerLockElement) document.exitPointerLock();

            console.log("Project opened:", data.title);
        }

        function interactWithProject() {
            if (projectOpen || !nearestProject) return;
            openProject(nearestProject.userData.projectId);
        }

        function closeProject() {
            projectOpen = false;
            if (projectPanel) projectPanel.classList.add("hidden");
            nearestProject = null;
            canvas.requestPointerLock();
        }

        if (backButton) {
            backButton.addEventListener("click", function(event) {
                event.preventDefault();
                closeProject();
            });
        }

        document.addEventListener("keydown", function(event) {
            if (event.code === "Escape" && projectOpen) closeProject();
        });

        // =============================================
        // NPC CREATION DENGAN ANIMASI KHUSUS LENGKAP
        // =============================================
        function createNPC(x, z, color, pathLength, activity) {
            const npc = new THREE.Group();
            npc.position.set(x, 0, z);
            scene.add(npc);

            // Badan
            const npcBody = new THREE.Mesh(
                new THREE.BoxGeometry(0.75, 1.1, 0.45),
                new THREE.MeshStandardMaterial({ color: color })
            );
            npcBody.position.y = 1.1;
            npcBody.castShadow = true;
            npc.add(npcBody);

            // Kepala
            const npcHead = new THREE.Mesh(
                new THREE.SphereGeometry(0.33, 12, 12),
                new THREE.MeshStandardMaterial({ color: 0xe8bd96 })
            );
            npcHead.position.y = 1.9;
            npcHead.castShadow = true;
            npc.add(npcHead);

            // Kaki
            const npcLegGeometry = new THREE.BoxGeometry(0.23, 0.75, 0.28);
            const npcLegMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });

            const npcLeftLeg = new THREE.Mesh(npcLegGeometry, npcLegMaterial);
            npcLeftLeg.position.set(-0.19, 0.38, 0);
            npcLeftLeg.castShadow = true;
            npc.add(npcLeftLeg);

            const npcRightLeg = new THREE.Mesh(npcLegGeometry, npcLegMaterial);
            npcRightLeg.position.set(0.19, 0.38, 0);
            npcRightLeg.castShadow = true;
            npc.add(npcRightLeg);

            // Tangan
            const npcArmGeometry = new THREE.BoxGeometry(0.18, 0.75, 0.22);
            const npcArmMaterial = new THREE.MeshStandardMaterial({ color: color });

            const npcLeftArm = new THREE.Mesh(npcArmGeometry, npcArmMaterial);
            npcLeftArm.position.set(-0.50, 1.15, 0);
            npcLeftArm.castShadow = true;
            npc.add(npcLeftArm);

            const npcRightArm = new THREE.Mesh(npcArmGeometry, npcArmMaterial);
            npcRightArm.position.set(0.50, 1.15, 0);
            npcRightArm.castShadow = true;
            npc.add(npcRightArm);

            // Simpan referensi anggota tubuh
            npc.userData.body = npcBody;
            npc.userData.head = npcHead;
            npc.userData.leftLeg = npcLeftLeg;
            npc.userData.rightLeg = npcRightLeg;
            npc.userData.leftArm = npcLeftArm;
            npc.userData.rightArm = npcRightArm;
            npc.userData.activity = activity;
            npc.userData.activityTime = Math.random() * 10;
            npc.userData.startX = x;
            npc.userData.startZ = z;
            npc.userData.pathLength = pathLength;
            npc.userData.speed = 1.2;
            npc.userData.direction = 1;
            npc.userData.walkTime = 0;

            // =========================================
            // PERLENGKAPAN ALAT UNTUK MASING-MASING NPC
            // =========================================
            if (activity === "SWEEP") {
                // Buat Sapu 3D
                const broom = new THREE.Group();
                const broomStick = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8),
                    new THREE.MeshStandardMaterial({ color: 0x70452a })
                );
                broomStick.rotation.z = -0.3;
                broomStick.position.y = 0.5;
                broom.add(broomStick);

                const broomHead = new THREE.Mesh(
                    new THREE.BoxGeometry(0.45, 0.15, 0.15),
                    new THREE.MeshStandardMaterial({ color: 0xc9a66b })
                );
                broomHead.position.set(0.25, -0.2, 0);
                broom.add(broomHead);

                broom.position.set(0.45, 0.9, 0.3);
                npc.add(broom);
                npc.userData.broom = broom;
            }

            if (activity === "WATER") {
                // Buat Teko / Gembor Air 3D
                const wateringCan = new THREE.Group();
                const canBody = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.2, 0.22, 0.35, 12),
                    new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
                );
                wateringCan.add(canBody);

                const canSpout = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.04, 0.07, 0.4, 8),
                    new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
                );
                canSpout.position.set(0.25, 0.15, 0);
                canSpout.rotation.z = -Math.PI / 4;
                wateringCan.add(canSpout);

                wateringCan.position.set(0.55, 0.9, 0.2);
                npc.add(wateringCan);
                npc.userData.wateringCan = wateringCan;
            }

            return npc;
        }

        // =============================================
        // DAFTAR NPC DENGAN PERILAKU MASING-MASING
        // =============================================
        const npc1 = createNPC(-5, -10, 0xd94c4c, 4, "WALK");  // Alex: Patroli bolak-balik
        const npc2 = createNPC(6, -17, 0xf0a83c, 0, "SWEEP");  // Maya: Menyapu halaman
        const npc3 = createNPC(-4, -24, 0x8e5bd9, 0, "WATER"); // Jordan: Menyiram tanaman

        const npcs = [npc1, npc2, npc3];
        npcs.forEach(function(npc) {
            addNPCCollider(npc);
        });

        // =============================================
        // NPC VS NPC AVOIDANCE (SALING MENGHINDAR)
        // =============================================
        function resolveNPCVsNPC() {
            for (let i = 0; i < npcs.length; i++) {
                for (let j = i + 1; j < npcs.length; j++) {
                    const a = npcs[i];
                    const b = npcs[j];
                    const dx = a.position.x - b.position.x;
                    const dz = a.position.z - b.position.z;
                    let distance = Math.sqrt(dx * dx + dz * dz);
                    const minimumDistance = NPC_RADIUS * 2.2;

                    if (distance < minimumDistance) {
                        if (distance < 0.001) distance = 0.001;
                        const push = (minimumDistance - distance) / 2;
                        const normalX = dx / distance;
                        const normalZ = dz / distance;

                        a.position.x += normalX * push;
                        a.position.z += normalZ * push;
                        b.position.x -= normalX * push;
                        b.position.z -= normalZ * push;
                    }
                }
            }
        }

        // =============================================
        // NPC ANIMATION UPDATE
        // =============================================
        function updateNPCs(delta) {
            npcs.forEach(function(npc) {
                const activity = npc.userData.activity;
                npc.userData.activityTime += delta;

                // 1. ANIMASI JALAN (WALK)
                if (activity === "WALK") {
                    npc.userData.walkTime += delta * 8;
                    const offset = npc.userData.direction * npc.userData.speed * delta;
                    npc.position.x += offset;

                    const distance = npc.position.x - npc.userData.startX;
                    if (Math.abs(distance) > npc.userData.pathLength) {
                        npc.userData.direction *= -1;
                        npc.rotation.y = npc.userData.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
                    }

                    const swing = Math.sin(npc.userData.walkTime) * 0.45;
                    npc.userData.leftLeg.rotation.x = swing;
                    npc.userData.rightLeg.rotation.x = -swing;
                    npc.userData.leftArm.rotation.x = -swing;
                    npc.userData.rightArm.rotation.x = swing;
                }

                // 2. ANIMASI MENYAPU (SWEEP)
                else if (activity === "SWEEP") {
                    const t = npc.userData.activityTime;
                    const sweepMotion = Math.sin(t * 4);

                    npc.userData.body.rotation.z = sweepMotion * 0.08;
                    npc.userData.leftArm.rotation.x = -0.4 + sweepMotion * 0.25;
                    npc.userData.rightArm.rotation.x = -0.5 + sweepMotion * 0.25;

                    if (npc.userData.broom) {
                        npc.userData.broom.rotation.x = sweepMotion * 0.3;
                    }
                }

                // 3. ANIMASI MENYIRAM (WATER)
                else if (activity === "WATER") {
                    const t = npc.userData.activityTime;
                    const waterMotion = Math.sin(t * 3);

                    npc.userData.rightArm.rotation.x = -0.7 + waterMotion * 0.2;
                    npc.userData.leftArm.rotation.x = -0.2;

                    if (npc.userData.wateringCan) {
                        npc.userData.wateringCan.rotation.x = -0.3 + waterMotion * 0.3;
                    }
                }
            });

            resolveNPCVsNPC();
        }

        // =============================================
        // LOADING & RESIZE
        // =============================================
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) loadingScreen.classList.add("hidden");

        window.addEventListener("resize", function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // =============================================
        // GAME LOOP
        // =============================================
        const clock = new THREE.Clock();
        updateCamera(0.016);

        function animate() {
            requestAnimationFrame(animate);
            const delta = Math.min(clock.getDelta(), 0.05);

            updatePlayer(delta);
            updatePlayerAnimation(delta);
            updateNPCs(delta);
            resolvePlayerVsNPC();
            updateProjectDetection();
            updateCamera(delta);

            renderer.render(scene, camera);
        }

        animate();

        console.log("=== 3D WORLD RUNNING ===");
        console.log("Third-person + Real houses + NPC unique animations + Clear high signs active.");
    }
}
