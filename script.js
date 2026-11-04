// =====================================================
// SADAM ALKAYYIS - INTERACTIVE 3D PORTFOLIO
// CIRCULAR OPEN WORLD + LET'S CONNECT + MOBILE PORTRAIT
// FULL FIXED & TESTED (NO-FREEZE + IMAGE CACHING ENGINE)
// =====================================================

console.log("=== PORTFOLIO SCRIPT START ===");

if (typeof THREE === "undefined") {
    console.error("Three.js gagal dimuat.");
} else {
    console.log("Three.js berhasil dimuat. Version:", THREE.REVISION);

    const canvas = document.getElementById("game-canvas");

    if (!canvas) {
        console.error("Canvas #game-canvas tidak ditemukan.");
    } else {

        // =============================================
        // 1. SCENE, FOG, CAMERA & RENDERER
        // =============================================

        const scene = new THREE.Scene();

        const daySkyColor = new THREE.Color(0x87ceeb);
        const nightSkyColor = new THREE.Color(0x071426);
        const dayFogColor = new THREE.Color(0x87ceeb);
        const nightFogColor = new THREE.Color(0x071426);

        scene.background = daySkyColor.clone();
        scene.fog = new THREE.Fog(0x87ceeb, 30, 100);

        const camera = new THREE.PerspectiveCamera(
            65,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // =============================================
        // 2. MAP CONFIGURATION
        // =============================================

        const MAP_RADIUS = 48;
        const PLAYER_BOUNDARY = MAP_RADIUS - 1.2;

        // =============================================
        // 3. LIGHTING & ATMOSPHERE (OPTIMIZED FOR NO FREEZE)
        // =============================================

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x557755, 2);
        scene.add(hemisphereLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 3);
        sunLight.position.set(20, 40, 20);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 1024;
        sunLight.shadow.mapSize.height = 1024;
        sunLight.shadow.camera.left = -60;
        sunLight.shadow.camera.right = 60;
        sunLight.shadow.camera.top = 60;
        sunLight.shadow.camera.bottom = -60;
        scene.add(sunLight);

        const moonLight = new THREE.DirectionalLight(0x9db7ff, 0);
        moonLight.position.set(-20, 35, -15);
        moonLight.castShadow = true;
        moonLight.shadow.mapSize.width = 1024;
        moonLight.shadow.mapSize.height = 1024;
        scene.add(moonLight);

        const nightAmbient = new THREE.HemisphereLight(0x506080, 0x10151f, 0);
        scene.add(nightAmbient);

        // SUN & MOON VISUALS
        const sunVisual = new THREE.Mesh(
            new THREE.SphereGeometry(2.5, 24, 24),
            new THREE.MeshBasicMaterial({ color: 0xffdd66 })
        );
        sunVisual.position.set(25, 35, -30);
        scene.add(sunVisual);

        const moonVisual = new THREE.Mesh(
            new THREE.SphereGeometry(2.2, 24, 24),
            new THREE.MeshBasicMaterial({ color: 0xdde7ff })
        );
        moonVisual.position.set(-25, 30, -25);
        moonVisual.visible = false;
        scene.add(moonVisual);

        // STARS
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = [];
        for (let i = 0; i < 300; i++) {
            const x = (Math.random() - 0.5) * 160;
            const y = 20 + Math.random() * 50;
            const z = (Math.random() - 0.5) * 160;
            starPositions.push(x, y, z);
        }
        starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.18,
            sizeAttenuation: true
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        stars.visible = false;
        scene.add(stars);

        // FIREFLIES
        const fireflies = [];
        function createFireflies() {
            for (let i = 0; i < 55; i++) {
                const material = new THREE.MeshBasicMaterial({
                    color: 0xbaff80,
                    transparent: true
                });
                const firefly = new THREE.Mesh(
                    new THREE.SphereGeometry(0.045, 6, 6),
                    material
                );
                const angle = Math.random() * Math.PI * 2;
                const radius = 5 + Math.random() * 38;
                firefly.position.set(
                    Math.cos(angle) * radius,
                    0.8 + Math.random() * 3,
                    Math.sin(angle) * radius
                );
                firefly.userData.phase = Math.random() * Math.PI * 2;
                firefly.userData.speed = 0.5 + Math.random();
                firefly.visible = false;
                scene.add(firefly);
                fireflies.push(firefly);
            }
        }
        createFireflies();

        // =============================================
        // 4. DAY / NIGHT SYSTEM (FIXED COLOR RESTORE)
        // =============================================

        let isNight = false;
        const timeModeUI = document.getElementById("time-mode");
        const mobileTimeIcon = document.getElementById("mobile-time-icon");

        function updateTimeModeUI() {
            if (timeModeUI) {
                timeModeUI.textContent = isNight ? "🌙 NIGHT" : "☀️ DAY";
            }
            if (mobileTimeIcon) {
                mobileTimeIcon.textContent = isNight ? "🌙" : "☀️";
            }
        }

        function updateNightObjects() {
            fireflies.forEach((firefly) => {
                firefly.visible = isNight;
            });
        }

        function setDayMode() {
            isNight = false;
            scene.background.setHex(0x87ceeb);
            scene.fog.color.setHex(0x87ceeb);

            sunLight.intensity = 3.0;
            hemisphereLight.intensity = 2.0;
            moonLight.intensity = 0;
            nightAmbient.intensity = 0;

            sunVisual.visible = true;
            moonVisual.visible = false;
            stars.visible = false;

            updateNightObjects();
            updateTimeModeUI();
        }

        function setNightMode() {
            isNight = true;
            scene.background.setHex(0x071426);
            scene.fog.color.setHex(0x071426);

            sunLight.intensity = 0.25;
            hemisphereLight.intensity = 0.35;
            moonLight.intensity = 1.4;
            nightAmbient.intensity = 0.8;

            sunVisual.visible = false;
            moonVisual.visible = true;
            stars.visible = true;

            updateNightObjects();
            updateTimeModeUI();
        }

        function toggleDayNight() {
            if (isNight) {
                setDayMode();
            } else {
                setNightMode();
            }
        }

        setDayMode();

        // =============================================
        // 5. CIRCULAR GROUND & PATHS
        // =============================================

        const ground = new THREE.Mesh(
            new THREE.CircleGeometry(MAP_RADIUS, 96),
            new THREE.MeshStandardMaterial({
                color: 0x4f7d3a,
                roughness: 0.9
            })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        const mapBoundary = new THREE.Mesh(
            new THREE.RingGeometry(MAP_RADIUS - 0.8, MAP_RADIUS, 96),
            new THREE.MeshStandardMaterial({
                color: 0x315526,
                side: THREE.DoubleSide,
                roughness: 1
            })
        );
        mapBoundary.rotation.x = -Math.PI / 2;
        mapBoundary.position.y = 0.03;
        scene.add(mapBoundary);

        const centralPlaza = new THREE.Mesh(
            new THREE.CircleGeometry(5.5, 48),
            new THREE.MeshStandardMaterial({
                color: 0xb89b6a,
                roughness: 0.9
            })
        );
        centralPlaza.rotation.x = -Math.PI / 2;
        centralPlaza.position.y = 0.025;
        centralPlaza.receiveShadow = true;
        scene.add(centralPlaza);

        const pathMaterial = new THREE.MeshStandardMaterial({
            color: 0xb89b6a,
            roughness: 0.95
        });

        function createRadialPath(angle, length = 40, width = 5) {
            const path = new THREE.Mesh(
                new THREE.PlaneGeometry(width, length),
                pathMaterial
            );
            path.rotation.x = -Math.PI / 2;
            path.rotation.z = THREE.MathUtils.degToRad(angle);
            path.position.y = 0.02;
            scene.add(path);
            return path;
        }

        createRadialPath(0, 82, 5);
        createRadialPath(90, 82, 5);
        createRadialPath(180, 82, 5);
        createRadialPath(270, 82, 5);

        const outerPath = new THREE.Mesh(
            new THREE.RingGeometry(31, 34, 96),
            pathMaterial
        );
        outerPath.rotation.x = -Math.PI / 2;
        outerPath.position.y = 0.021;
        outerPath.receiveShadow = true;
        scene.add(outerPath);

        // =============================================
        // 6. CLOUDS, BIRDS & BUTTERFLIES
        // =============================================

        const clouds = [];
        function createCloud(x, y, z, scale = 1) {
            const cloud = new THREE.Group();
            const cloudMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 1
            });
            const parts = [
                [-1.5, 0, 0, 1.0],
                [-0.5, 0.3, 0, 1.3],
                [0.6, 0.15, 0, 1.15],
                [1.5, 0, 0, 0.9],
                [0, -0.05, 0.15, 1.0]
            ];
            parts.forEach(([px, py, pz, size]) => {
                const puff = new THREE.Mesh(
                    new THREE.SphereGeometry(size, 12, 10),
                    cloudMaterial
                );
                puff.position.set(px, py, pz);
                cloud.add(puff);
            });
            cloud.position.set(x, y, z);
            cloud.scale.setScalar(scale);
            scene.add(cloud);
            clouds.push({
                object: cloud,
                speed: 0.3 + Math.random() * 0.25
            });
        }

        createCloud(-25, 18, -20, 1.5);
        createCloud(5, 21, -35, 1.2);
        createCloud(28, 17, -10, 1.7);
        createCloud(-5, 24, 5, 0.9);

        function updateClouds(delta) {
            clouds.forEach((cloudData) => {
                cloudData.object.position.x += cloudData.speed * delta;
                if (cloudData.object.position.x > 55) {
                    cloudData.object.position.x = -55;
                }
            });
        }

        const birds = [];
        function createBird(x, y, z) {
            const bird = new THREE.Group();
            const birdMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
            const body = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), birdMaterial);
            bird.add(body);

            const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.18), birdMaterial);
            const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.18), birdMaterial);
            leftWing.position.x = -0.3;
            rightWing.position.x = 0.3;
            bird.add(leftWing);
            bird.add(rightWing);
            bird.position.set(x, y, z);
            scene.add(bird);

            birds.push({
                object: bird,
                leftWing,
                rightWing,
                speed: 2 + Math.random(),
                phase: Math.random() * Math.PI * 2
            });
        }

        createBird(-25, 15, -15);
        createBird(-35, 18, -30);
        createBird(-15, 20, -5);
        createBird(20, 17, 15);

        function updateBirds(delta) {
            birds.forEach((bird) => {
                bird.object.position.x += bird.speed * delta;
                bird.object.position.z += Math.sin(clock.elapsedTime * 1.5 + bird.phase) * delta * 0.8;
                const flap = Math.sin(clock.elapsedTime * 8 + bird.phase) * 0.35;
                bird.leftWing.rotation.z = flap;
                bird.rightWing.rotation.z = -flap;
                if (bird.object.position.x > 55) {
                    bird.object.position.x = -55;
                }
            });
        }

        const butterflies = [];
        function createButterfly(x, y, z) {
            const butterfly = new THREE.Group();
            const wingMaterial = new THREE.MeshStandardMaterial({
                color: 0xffd34d,
                side: THREE.DoubleSide
            });
            const leftWing = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.35), wingMaterial);
            const rightWing = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.35), wingMaterial);
            leftWing.position.x = -0.15;
            rightWing.position.x = 0.15;
            butterfly.add(leftWing);
            butterfly.add(rightWing);
            butterfly.position.set(x, y, z);
            scene.add(butterfly);

            butterflies.push({
                object: butterfly,
                leftWing,
                rightWing,
                origin: new THREE.Vector3(x, y, z),
                phase: Math.random() * 10,
                speed: 0.5 + Math.random() * 0.5
            });
        }

        createButterfly(-8, 1.8, -7);
        createButterfly(8, 1.5, -14);
        createButterfly(-9, 1.7, -27);
        createButterfly(6, 1.6, -25);
        createButterfly(20, 1.5, 10);
        createButterfly(-22, 1.8, 12);

        function updateButterflies(delta) {
            butterflies.forEach((butterfly) => {
                const t = clock.elapsedTime * butterfly.speed + butterfly.phase;
                butterfly.object.position.x = butterfly.origin.x + Math.sin(t) * 2;
                butterfly.object.position.z = butterfly.origin.z + Math.cos(t * 0.8) * 2;
                butterfly.object.position.y = butterfly.origin.y + Math.sin(t * 2) * 0.4;
                const flap = Math.sin(t * 12) * 0.7;
                butterfly.leftWing.rotation.y = flap;
                butterfly.rightWing.rotation.y = -flap;
            });
        }

        function updateFireflies() {
            fireflies.forEach((firefly) => {
                if (!isNight) return;
                const t = clock.elapsedTime * firefly.userData.speed + firefly.userData.phase;
                firefly.position.y += Math.sin(t * 2) * 0.002;
                const glow = 0.5 + Math.sin(t * 4) * 0.5;
                firefly.material.opacity = glow;
            });
        }

        // =============================================
        // 7. COLLISION SYSTEM
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
                    const distance = Math.sqrt(distanceSq);
                    if (distance === 0) {
                        position.x += collider.halfWidth + PLAYER_RADIUS;
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
                    player.position.x += (dx / distance) * push;
                    player.position.z += (dz / distance) * push;
                }
            }
        }

        function polarPosition(angle, radius) {
            const rad = THREE.MathUtils.degToRad(angle);
            return {
                x: Math.cos(rad) * radius,
                z: Math.sin(rad) * radius
            };
        }

        // =============================================
        // 8. HOUSES & TREES
        // =============================================

        function createHouse(x, z, width, depth, wallColor, roofColor) {
            const house = new THREE.Group();
            house.position.set(x, 0, z);
            scene.add(house);

            const wallHeight = 2.8;
            const wallMat = new THREE.MeshStandardMaterial({ color: wallColor });
            const roofMat = new THREE.MeshStandardMaterial({ color: roofColor });

            const backWall = new THREE.Mesh(new THREE.BoxGeometry(width, wallHeight, 0.3), wallMat);
            backWall.position.set(0, wallHeight / 2, -depth / 2);
            backWall.castShadow = true;
            house.add(backWall);

            const frontWall = new THREE.Mesh(new THREE.BoxGeometry(width, wallHeight, 0.3), wallMat);
            frontWall.position.set(0, wallHeight / 2, depth / 2);
            frontWall.castShadow = true;
            house.add(frontWall);

            const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallHeight, depth), wallMat);
            leftWall.position.set(-width / 2, wallHeight / 2, 0);
            leftWall.castShadow = true;
            house.add(leftWall);

            const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallHeight, depth), wallMat);
            rightWall.position.set(width / 2, wallHeight / 2, 0);
            rightWall.castShadow = true;
            house.add(rightWall);

            const roofHeight = 1.8;
            const roofRadius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(depth / 2, 2)) + 0.35;
            const roofGeometry = new THREE.CylinderGeometry(0, roofRadius, roofHeight, 4, 1);
            roofGeometry.rotateY(Math.PI / 4);
            const roof = new THREE.Mesh(roofGeometry, roofMat);
            roof.position.set(0, wallHeight + roofHeight / 2, 0);
            roof.castShadow = true;
            roof.receiveShadow = true;
            house.add(roof);

            const door = new THREE.Mesh(
                new THREE.BoxGeometry(1.0, 1.8, 0.08),
                new THREE.MeshStandardMaterial({ color: 0x4a2b1b })
            );
            door.position.set(0, 0.9, depth / 2 + 0.05);
            door.castShadow = true;
            house.add(door);

            const terrace = new THREE.Mesh(
                new THREE.BoxGeometry(width + 1.2, 0.2, 1.5),
                new THREE.MeshStandardMaterial({ color: 0xa98258 })
            );
            terrace.position.set(0, 0.1, depth / 2 + 0.75);
            terrace.castShadow = true;
            house.add(terrace);

            addCollisionBox(x, z, width + 0.4, depth + 0.4);
            return house;
        }

        const house1 = polarPosition(45, 25);
        createHouse(house1.x, house1.z, 6, 6, 0xc08b5c, 0x7a3328);

        const house2 = polarPosition(135, 25);
        createHouse(house2.x, house2.z, 6, 7, 0x9eaf78, 0x4d5c38);

        const house3 = polarPosition(225, 25);
        createHouse(house3.x, house3.z, 7, 6, 0xd1a06b, 0x65402c);

        const house4 = polarPosition(315, 25);
        createHouse(house4.x, house4.z, 6, 6, 0xb87858, 0x55352c);

        function createTree(x, z) {
            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.35, 0.45, 3, 8),
                new THREE.MeshStandardMaterial({ color: 0x6b4423 })
            );
            trunk.position.set(x, 1.5, z);
            trunk.castShadow = true;
            scene.add(trunk);

            const leaves = new THREE.Mesh(
                new THREE.SphereGeometry(1.7, 12, 12),
                new THREE.MeshStandardMaterial({ color: 0x2f6b32 })
            );
            leaves.position.set(x, 4, z);
            leaves.castShadow = true;
            scene.add(leaves);

            addCollisionBox(x, z, 1.2, 1.2);
        }

        const treePositions = [
            [15, 8], [27, 4], [31, 15], [22, 27], [5, 31],
            [-12, 30], [-25, 24], [-31, 12], [-29, -4], [-25, -18],
            [-10, -30], [8, -31], [24, -25], [32, -12], [10, 20],
            [-15, 17], [17, -15], [-17, -12]
        ];
        treePositions.forEach(([x, z]) => createTree(x, z));

        // =============================================
        // 9. PLAYER
        // =============================================

        const player = new THREE.Group();
        player.position.set(0, 0, 6);
        scene.add(player);

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.2, 0.45),
            new THREE.MeshStandardMaterial({ color: 0x2d5bff })
        );
        body.position.y = 1.15;
        body.castShadow = true;
        player.add(body);

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.35, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xf0c8a0 })
        );
        head.position.y = 2.0;
        head.castShadow = true;
        player.add(head);

        const legGeo = new THREE.BoxGeometry(0.25, 0.8, 0.3);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x202020 });

        const leftLeg = new THREE.Mesh(legGeo, legMat);
        leftLeg.position.set(-0.2, 0.4, 0);
        leftLeg.castShadow = true;
        player.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, legMat);
        rightLeg.position.set(0.2, 0.4, 0);
        rightLeg.castShadow = true;
        player.add(rightLeg);

        const armGeo = new THREE.BoxGeometry(0.2, 0.9, 0.25);
        const leftArm = new THREE.Mesh(armGeo, body.material);
        leftArm.position.set(-0.55, 1.2, 0);
        leftArm.castShadow = true;
        player.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, body.material);
        rightArm.position.set(0.55, 1.2, 0);
        rightArm.castShadow = true;
        player.add(rightArm);

        // =============================================
        // 10. THIRD PERSON CAMERA & CONTROLS
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

        const keys = {};
        let mouseLocked = false;
        let projectOpen = false;
        let finishOpen = false;

        window.addEventListener("keydown", (e) => {
            keys[e.code] = true;
            if (e.code === "KeyE" && !projectOpen && !finishOpen) {
                interactWithProject();
            }
            if (e.code === "KeyN" && !projectOpen && !finishOpen) {
                toggleDayNight();
            }
        });

        window.addEventListener("keyup", (e) => {
            keys[e.code] = false;
        });

        document.addEventListener("pointerlockchange", () => {
            mouseLocked = document.pointerLockElement === canvas;
        });

        document.addEventListener("mousemove", (e) => {
            if (!mouseLocked || projectOpen || finishOpen) return;
            cameraYaw -= e.movementX * 0.0025;
            cameraPitch -= e.movementY * 0.0025;
            cameraPitch = THREE.MathUtils.clamp(cameraPitch, -0.65, 0.85);
        });

        canvas.addEventListener("wheel", (e) => {
            if (projectOpen || finishOpen) return;
            e.preventDefault();
            cameraDistance += e.deltaY * 0.005;
            cameraDistance = THREE.MathUtils.clamp(cameraDistance, CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE);
        }, { passive: false });

        const startScreen = document.getElementById("start-screen");
        const startButton = document.getElementById("start-button");
        if (startButton) {
            startButton.addEventListener("click", () => {
                if (startScreen) {
                    startScreen.classList.add("hidden");
                }
                if (isTouchDevice) {
                    updateMobileOrientation();
                } else {
                    canvas.requestPointerLock();
                }
            });
        }

        // ============================================================
        // MOBILE DEVICE SUPPORT (PORTRAIT ORIENTED)
        // ============================================================

        const isTouchDevice =
            window.matchMedia("(pointer: coarse)").matches ||
            "ontouchstart" in window;

        const mobileControls = document.getElementById("mobile-controls");
        const rotateDeviceScreen = document.getElementById("rotate-device-screen");
        const mobileInteractButton = document.getElementById("mobile-interact-button");
        const mobileTimeButton = document.getElementById("mobile-time-button");
        const touchLookArea = document.getElementById("touch-look-area");
        const virtualJoystick = document.getElementById("virtual-joystick");
        const joystickBase = document.getElementById("joystick-base");
        const joystickKnob = document.getElementById("joystick-knob");

        let mobileMoveX = 0;
        let mobileMoveY = 0;
        let joystickPointerId = null;
        const joystickRadius = 43;

        let mobileLookPointerId = null;
        let mobileLookLastX = 0;
        let mobileLookLastY = 0;
        const mobileLookSensitivity = 0.007;

        function isPortraitMode() {
            return window.innerHeight >= window.innerWidth;
        }

        function updateMobileOrientation() {
            if (!isTouchDevice) return;

            const portrait = isPortraitMode();

            if (rotateDeviceScreen) {
                rotateDeviceScreen.classList.toggle("active", !portrait);
            }

            if (mobileControls) {
                mobileControls.classList.toggle("active", portrait);
            }

            if (portrait) {
                camera.fov = 75;
            } else {
                camera.fov = 65;
            }
            camera.updateProjectionMatrix();
        }

        function resetMobileJoystick() {
            mobileMoveX = 0;
            mobileMoveY = 0;
            joystickPointerId = null;
            if (joystickKnob) {
                joystickKnob.style.transform = "translate(-50%, -50%)";
            }
        }

        function updateMobileJoystick(clientX, clientY) {
            if (!joystickBase || !joystickKnob) return;
            const rect = joystickBase.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            let deltaX = clientX - centerX;
            let deltaY = clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > joystickRadius) {
                const scale = joystickRadius / distance;
                deltaX *= scale;
                deltaY *= scale;
            }

            mobileMoveX = deltaX / joystickRadius;
            mobileMoveY = deltaY / joystickRadius;

            joystickKnob.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        }

        function setupMobileJoystick() {
            if (!virtualJoystick) return;

            virtualJoystick.addEventListener("pointerdown", (event) => {
                event.preventDefault();
                joystickPointerId = event.pointerId;
                virtualJoystick.setPointerCapture(event.pointerId);
                updateMobileJoystick(event.clientX, event.clientY);
            });

            virtualJoystick.addEventListener("pointermove", (event) => {
                if (event.pointerId !== joystickPointerId) return;
                event.preventDefault();
                updateMobileJoystick(event.clientX, event.clientY);
            });

            virtualJoystick.addEventListener("pointerup", (event) => {
                if (event.pointerId !== joystickPointerId) return;
                resetMobileJoystick();
            });

            virtualJoystick.addEventListener("pointercancel", (event) => {
                if (event.pointerId !== joystickPointerId) return;
                resetMobileJoystick();
            });
        }

        function setupMobileCameraLook() {
            if (!touchLookArea) return;

            touchLookArea.addEventListener("pointerdown", (event) => {
                if (projectOpen || finishOpen) return;
                event.preventDefault();
                mobileLookPointerId = event.pointerId;
                mobileLookLastX = event.clientX;
                mobileLookLastY = event.clientY;
                touchLookArea.setPointerCapture(event.pointerId);
            });

            touchLookArea.addEventListener("pointermove", (event) => {
                if (event.pointerId !== mobileLookPointerId || projectOpen || finishOpen) return;
                event.preventDefault();

                const deltaX = event.clientX - mobileLookLastX;
                const deltaY = event.clientY - mobileLookLastY;
                mobileLookLastX = event.clientX;
                mobileLookLastY = event.clientY;

                cameraYaw -= deltaX * mobileLookSensitivity;
                cameraPitch -= deltaY * mobileLookSensitivity;
                cameraPitch = Math.max(-0.65, Math.min(0.85, cameraPitch));
            });

            touchLookArea.addEventListener("pointerup", (event) => {
                if (event.pointerId !== mobileLookPointerId) return;
                mobileLookPointerId = null;
            });

            touchLookArea.addEventListener("pointercancel", (event) => {
                if (event.pointerId !== mobileLookPointerId) return;
                mobileLookPointerId = null;
            });
        }

        if (mobileInteractButton) {
            mobileInteractButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!projectOpen && !finishOpen) {
                    interactWithProject();
                }
            });
        }

        if (mobileTimeButton) {
            mobileTimeButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!projectOpen && !finishOpen) {
                    toggleDayNight();
                }
            });
        }

        if (isTouchDevice) {
            setupMobileJoystick();
            setupMobileCameraLook();
            updateMobileOrientation();
            window.addEventListener("resize", updateMobileOrientation);
            window.addEventListener("orientationchange", () => {
                setTimeout(updateMobileOrientation, 150);
            });
            if (canvas) {
                canvas.style.touchAction = "none";
            }
        }

        // =============================================
        // 11. PLAYER MOVEMENT & ANIMATION (FIXED DIRECTION)
        // =============================================

        const moveDirection = new THREE.Vector3();
        const cameraForward = new THREE.Vector3();
        const cameraRight = new THREE.Vector3();
        const velocity = new THREE.Vector3();
        let walkTime = 0;

        function updatePlayer(delta) {
            if (projectOpen || finishOpen) {
                moveDirection.set(0, 0, 0);
                return;
            }

            moveDirection.set(0, 0, 0);

            cameraForward.set(
                Math.sin(cameraYaw), 
                0, 
                Math.cos(cameraYaw)
            ).normalize();

            cameraRight.set(
                -Math.cos(cameraYaw), 
                0, 
                Math.sin(cameraYaw)
            ).normalize();

            if (keys["KeyW"] || keys["ArrowUp"]) moveDirection.add(cameraForward);
            if (keys["KeyS"] || keys["ArrowDown"]) moveDirection.sub(cameraForward);
            if (keys["KeyA"] || keys["ArrowLeft"]) moveDirection.sub(cameraRight);
            if (keys["KeyD"] || keys["ArrowRight"]) moveDirection.add(cameraRight);

            if (isTouchDevice && (Math.abs(mobileMoveX) > 0.05 || Math.abs(mobileMoveY) > 0.05)) {
                moveDirection.addScaledVector(cameraForward, -mobileMoveY);
                moveDirection.addScaledVector(cameraRight, mobileMoveX);
            }

            if (moveDirection.lengthSq() > 0) {
                moveDirection.normalize();

                velocity.copy(moveDirection).multiplyScalar(6 * delta);

                player.position.x += velocity.x;
                resolvePlayerCollision(player.position);

                player.position.z += velocity.z;
                resolvePlayerCollision(player.position);

                resolvePlayerVsNPC();

                const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
                let diff = targetRotation - player.rotation.y;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                player.rotation.y += diff * Math.min(1, delta * 10);
            }

            const distanceFromCenter = Math.sqrt(
                player.position.x * player.position.x +
                player.position.z * player.position.z
            );

            if (distanceFromCenter > PLAYER_BOUNDARY) {
                const angle = Math.atan2(player.position.z, player.position.x);
                player.position.x = Math.cos(angle) * PLAYER_BOUNDARY;
                player.position.z = Math.sin(angle) * PLAYER_BOUNDARY;
            }
        }

        function updatePlayerAnimation(delta) {
            if (moveDirection.lengthSq() > 0) {
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
            cameraTarget.set(player.position.x, player.position.y + CAMERA_LOOK_HEIGHT, player.position.z);
            const hDist = cameraDistance * Math.cos(cameraPitch);
            const vDist = cameraDistance * Math.sin(cameraPitch);

            cameraDesiredPosition.set(
                player.position.x - Math.sin(cameraYaw) * hDist,
                player.position.y + CAMERA_HEIGHT - vDist,
                player.position.z - Math.cos(cameraYaw) * hDist
            );

            camera.position.lerp(cameraDesiredPosition, 1 - Math.pow(0.001, delta * cameraFollowSpeed));
            camera.lookAt(cameraTarget);
        }

        // =============================================
        // 12. PROJECT DATA
        // =============================================

        const projects = {
            smartvoc: {
                title: "SmartVoc",
                category: "GAME DEVELOPMENT",
                description: "3D open-world English learning RPG built for university students.",
                about: "SmartVoc began with the idea of making English vocabulary learning more engaging through an interactive game experience. Instead of relying on conventional lessons and repetitive multiple-choice exercises, I designed a 3D open-world RPG where players can explore the environment, interact with characters, complete activities, and learn through gameplay. The project is specifically designed for university students, with learning materials covering basic, intermediate, and advanced English vocabulary. I developed a progression system in which players interact with teacher NPCs to access learning activities and exercises, complete assessments to unlock new vocabulary, and use an in-game dictionary to review words, meanings, parts of speech, synonyms, antonyms, collocations, and vocabulary categories. The learning content is organized into a structured progression of 100 levels, with 10 vocabulary entries per level and assessment checkpoints throughout the journey. My development process involved shaping the initial concept and learning flow, designing the gameplay loop and progression mechanics, building the 3D game environment, implementing player interactions and gameplay systems, organizing vocabulary content through JSON data, and integrating the learning interface with the game. I also worked on the visual presentation and user interface to make the learning features accessible within the game world. The result is SmartVoc, a playable educational RPG that combines exploration, game mechanics, and structured vocabulary learning in one experience.",
                technologies: "Godot Engine • GDScript • Blender • JSON",
                contribution: "Game design, gameplay programming, UI implementation.",
                github: "https://github.com/SadamAlkayyis117/SMARTVOC-",
                demo: "https://edutree.itch.io/smartvoc",
                video: "https://www.youtube-nocookie.com/embed/vLz0PdW_uFM",
                screenshots: [
                    "assets/smartvoc/smartvoc-01.png",
                    "assets/smartvoc/smartvoc-02.png",
                    "assets/smartvoc/smartvoc-03.png",
                    "assets/smartvoc/smartvoc-04.png",
                    "assets/smartvoc/smartvoc-05.png"
                ]
            },
            blockfight: {
                title: "3D Modeling",
                category: "3D ASSET SHOWCASE",
                description: "A collection of interactive 3D models and game assets created for digital environments and game development.",
                about: "This showcase presents a collection of 3D assets, including environments, architectural designs, furniture, and character models. Each model can be explored directly through an interactive 3D viewer, allowing visitors to inspect its appearance from different angles, zoom in on details, and navigate around the model. The collection demonstrates my work in 3D modeling and asset creation for game-related projects.",
                technologies: "Blender • 3D Modeling • Sketchfab",
                contribution: "3D modeling, asset creation, and visual presentation.",
                github: "https://github.com/SadamAlkayyis117",
                demo: "#",
                models: [
                    {
                        id: "0a535039832545e3afe64040ccc51d8d",
                        title: "Swimming Pool",
                        category: "Environment Design",

                        description:
                            "This 3D swimming pool project presents an outdoor recreational environment designed around a swimming pool space. The model showcases an environment-focused approach to 3D creation, where the overall composition and arrangement of the space help communicate its intended use. Visitors can explore the model from different angles to examine the visual structure and spatial presentation. This project represents my work in creating three-dimensional environment assets for digital visualization and interactive experiences.",

                        tags: [
                            "3D Environment",
                            "Environment Modeling",
                            "Outdoor Space",
                            "Recreational Area",
                            "3D Visualization"
                        ],

                        url: "https://sketchfab.com/3d-models/kolam-renang-swimming-pool-0a535039832545e3afe64040ccc51d8d"
                    },

                    {
                        id: "2717efef3bc6438fa5f052d0242b5aea",
                        title: "Home Design",
                        category: "Architectural Visualization",

                        description:
                            "This residential design project explores the representation of a home through a three-dimensional architectural model. It focuses on translating a residential concept into a visual space that can be inspected from multiple perspectives. The model provides an opportunity to explore the relationship between architectural elements, spatial composition, and overall visual presentation. It demonstrates my interest in architectural modeling and the use of 3D visualization to communicate design concepts more clearly.",

                        tags: [
                            "Architecture",
                            "Residential Design",
                            "3D Modeling",
                            "Architectural Visualization",
                            "Spatial Design"
                        ],

                        url: "https://sketchfab.com/3d-models/home-design-2717efef3bc6438fa5f052d0242b5aea"
                    },

                    {
                        id: "008ab042f481455faa615c91e03e4db1",
                        title: "School Gymnastic",
                        category: "Environment Design",

                        description:
                            "This project presents a school-based sports environment in a three-dimensional format. The model focuses on visualizing a gymnasium or gymnastics-related facility as an organized space for physical activities. Through its environment composition, the project explores how a functional indoor facility can be represented as a navigable 3D scene. It highlights my experience in creating environment-oriented models that communicate a specific location and its intended purpose.",

                        tags: [
                            "School Environment",
                            "Sports Facility",
                            "Gymnasium",
                            "Interior Environment",
                            "3D Environment"
                        ],

                        url: "https://sketchfab.com/3d-models/school-gymnastic-008ab042f481455faa615c91e03e4db1"
                    },

                    {
                        id: "f414e4c9ed394119a6207ccd48bea07d",
                        title: "Martial Arts Training Furniture",
                        category: "Furniture & Props",

                        description:
                            "This asset collection focuses on furniture and supporting objects associated with a martial arts training environment. The project represents the creation of functional 3D props that can contribute to the visual identity of a specialized activity space. Rather than treating individual objects as isolated assets, the model can be viewed in the context of an environment where furniture and equipment help communicate the purpose of the location. It demonstrates my work with object-based modeling and 3D asset presentation.",

                        tags: [
                            "3D Props",
                            "Furniture Modeling",
                            "Sports Equipment",
                            "Martial Arts",
                            "Game Assets"
                        ],

                        url: "https://sketchfab.com/3d-models/martial-arts-tranining-furniture-f414e4c9ed394119a6207ccd48bea07d"
                    },

                    {
                        id: "71c6178db8f44e3ea3ed13e63c91bf7c",
                        title: "Minimarket",
                        category: "Commercial Environment",

                        description:
                            "This minimarket project represents a small retail environment through a three-dimensional scene. The concept focuses on presenting a commercial space that visitors can inspect as an environment rather than viewing it as a single isolated object. A retail setting provides an opportunity to explore spatial arrangement and the visual presentation of a familiar everyday location. This work demonstrates my approach to building recognizable environment assets for visualization and potential interactive use.",

                        tags: [
                            "Retail Environment",
                            "Commercial Space",
                            "Environment Modeling",
                            "3D Scene",
                            "Game Environment"
                        ],

                        url: "https://sketchfab.com/3d-models/minimarket-71c6178db8f44e3ea3ed13e63c91bf7c"
                    },

                    {
                        id: "01542eb661de4689a25de72d2717bcce",
                        title: "Soccer Field",
                        category: "Sports Environment",

                        description:
                            "This 3D project presents a soccer field as an outdoor sports environment. The model focuses on communicating the layout and visual identity of a football playing area through a three-dimensional presentation. It can be explored from different viewpoints to understand the overall composition of the space. The project represents my experience in creating environment-based 3D assets that can support sports-related visualization, digital scenes, and interactive environments.",

                        tags: [
                            "Sports Environment",
                            "Soccer Field",
                            "Outdoor Modeling",
                            "Landscape",
                            "3D Environment"
                        ],

                        url: "https://sketchfab.com/3d-models/soccer-field-01542eb661de4689a25de72d2717bcce"
                    },

                    {
                        id: "4d964550c54e44b0abc784ed3683d2f3",
                        title: "NPC Pack",
                        category: "Character Assets",

                        description:
                            "This project presents a collection of non-player character assets intended for use in digital environments and interactive experiences. NPCs play an important role in making virtual worlds feel populated and engaging, supporting the atmosphere and context of a game environment. This collection focuses on character-based assets that can represent different inhabitants or supporting characters within a virtual scene. It demonstrates my interest in character assets and their role in game environment development.",

                        tags: [
                            "3D Characters",
                            "NPC",
                            "Character Assets",
                            "Game Development",
                            "Character Modeling"
                        ],

                        url: "https://sketchfab.com/3d-models/npc-pack-4d964550c54e44b0abc784ed3683d2f3"
                    }
                ]
            },
            uiux: {
                title: "UI / UX DESIGN",
                category: "UI / UX",
                description: "Interface and experience design projects created using Figma.",
                about: "A collection of interface design and prototyping work focused on usability.",
                technologies: "Figma • UI Design • UX Design • Prototyping",
                contribution: "UI design, UX planning, wireframing, prototyping.",
                github: "#",
                demo: "#"
            },
            graphic: {
                title: "GRAPHIC DESIGN",
                category: "GRAPHIC DESIGN",
                description: "Visual design projects covering illustration, branding and digital artwork.",
                about: "A selection of graphic design work created across various projects, featuring posters, promotional materials, certificates, infographics, social media content, and branding.",
                technologies: "CorelDRAW • Adobe Photoshop • Digital Illustration",
                contribution: "Graphic design, illustration, composition, layout.",
                github: "#",
                demo: "#",
                graphicWorks: [
                    {
                        title: "Banner Diklatsar",
                        category: "promotion",
                        image: "images/banner-diklatsar.png"
                    },
                    {
                        title: "Penempuhan Brevet",
                        category: "promotion",
                        image: "images/banner-penempuhan.png"
                    },
                    {
                        title: "Countdown Diklatsar",
                        category: "promotion",
                        image: "images/countdown-diklatsar.png"
                    },
                    {
                        title: "Hari Jadi Garut",
                        category: "social-media",
                        image: "images/hari-jadi-garut.png"
                    },
                    {
                        title: "Certificate of Completion",
                        category: "document",
                        image: "images/certificate-design.png"
                    },
                    {
                        title: "Business Model Canvas SafeGas",
                        category: "infographic",
                        image: "images/bmc-safegas.png"
                    },
                    {
                        title: "Feed Instagram E Florist",
                        category: "social-media",
                        image: "images/feed-instagram.png"
                    },
                    {
                        title: "Jersey Werewolf",
                        category: "mockup",
                        image: "images/jersey-werewolf-design.jpg"
                    },
                    {
                        title: "Mockup Jersey Werewolf",
                        category: "mockup",
                        image: "images/jersey-werewolf-mockup.png"
                    },
                    {
                        title: "Peta Perjalanan",
                        category: "infographic",
                        image: "images/peta-perjalanan.png"
                    },
                    {
                        title: "Sticker AWN",
                        category: "branding",
                        image: "images/sticker-awn.jpg"
                    },
                    {
                        title: "Twibbon Diksar",
                        category: "branding",
                        image: "images/twibbon-diksar.jpg"
                    },
                    {
                        title: "Logo SAVIE.ID",
                        category: "branding",
                        image: "images/savie-logo.png"
                    }
                ]
            }
        };

        const uiuxWorks = [
            {
                id: "road-monitoring",
                title: "Road Monitoring",
                category: "Monitoring System",
                description: "A monitoring system interface designed to present road conditions and monitoring information in a clear and organized way.",
                overview: "Road Monitoring is a UI/UX design project focused on presenting road monitoring information through a structured digital interface. The design explores how monitoring information can be arranged so users can understand the information more easily.",
                designFocus: "Dashboard layout, information hierarchy, interface consistency, and monitoring-oriented user experience.",
                objective: "To create an interface concept that makes road monitoring information easier to view and navigate.",
                cover: "images/uiux/road-monitoring.png",
                designUrl: "https://www.figma.com/design/0zbnbupHJdKBAltZJQAJyA/Road-Monitoring?node-id=0-1&t=8rWYyvEsjIkSplpB-1",
                figmaUrl: "https://www.figma.com/proto/0zbnbupHJdKBAltZJQAJyA/Road-Monitoring?node-id=107-2&viewport=462%2C34%2C0.05&t=BMZyPnOIoZdcqDFh-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=107%3A2&page-id=0%3A1"
            },
            {
                id: "pasar-ikan",
                title: "Website Pasar Ikan",
                category: "Website Design",
                description: "An online fish market website concept designed to present products and create an accessible shopping experience.",
                overview: "Website Pasar Ikan is a website interface design project that explores an online marketplace concept for fish products. The project focuses on presenting marketplace content through a structured website layout.",
                designFocus: "Website layout, product presentation, visual hierarchy, and user navigation.",
                objective: "To develop a website interface concept that helps users explore an online fish marketplace.",
                cover: "images/uiux/pasar-ikan.png",
                designUrl: "https://www.figma.com/design/2efuijKTRiOixMWDKMpmPV/Prototype-Website-Pasar-Ikan?node-id=0-1&t=uYjRzbnlun8dDZVJ-1",
                figmaUrl: "https://www.figma.com/proto/2efuijKTRiOixMWDKMpmPV/Prototype-Website-Pasar-Ikan?node-id=8-41&p=f&viewport=2274%2C1007%2C0.06&t=t8qAa0iUpmAmyNrr-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=8%3A41&page-id=0%3A1"
            },
            {
                id: "valentine-moto",
                title: "Valentine Moto",
                category: "Website Design",
                description: "A creative website interface concept combining a Valentine-themed visual direction with motorcycle-related presentation.",
                overview: "Valentine Moto is a creative website design project with a Valentine-themed visual concept. The project explores how a specific visual direction can be translated into a website interface and browsing experience.",
                designFocus: "Visual concept, website composition, interface styling, and user experience.",
                objective: "To create a distinctive website interface through a themed visual design approach.",
                cover: "images/uiux/valentine-moto.png",
                designUrl: "https://www.figma.com/design/fGetYqjtp6Kf3OnEkslBVf/Prototype-valentine-moto?node-id=122-643&t=MnvBI5N4UxVZ05WF-1",
                figmaUrl: "https://www.figma.com/proto/fGetYqjtp6Kf3OnEkslBVf/Prototype-valentine-moto?node-id=1-2&viewport=797%2C766%2C0.09&t=w6IBqRYzOJDJIJXD-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A2&page-id=0%3A1"
            }
        ];

        // =============================================
        // 13. ABOUT BOARD & PROJECT SIGNS
        // =============================================

        const projectSigns = [];
        const aboutBoard = {
            group: null,
            interactionRadius: 6.0
        };

        function createIntroTexture() {
            const canvasTex = document.createElement("canvas");
            canvasTex.width = 1024;
            canvasTex.height = 600;
            const ctx = canvasTex.getContext("2d");

            ctx.fillStyle = "#111111";
            ctx.fillRect(0, 0, 1024, 600);

            ctx.strokeStyle = "#4fd1c5";
            ctx.lineWidth = 14;
            ctx.strokeRect(12, 12, 1000, 576);

            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("WELCOME TO MY PORTFOLIO", 512, 75);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 68px Arial";
            ctx.fillText("SADAM ALKAYYIS", 512, 165);

            ctx.fillStyle = "#a3e635";
            ctx.font = "bold 30px Arial";
            ctx.fillText("CREATIVE DEVELOPER • UI/UX DESIGNER", 512, 225);

            ctx.fillStyle = "#dddddd";
            ctx.font = "26px Arial";
            ctx.fillText("Informatics Graduate passionate about", 512, 305);
            ctx.fillText("game development, UI/UX and creative digital projects.", 512, 345);

            ctx.fillStyle = "#4fd1c5";
            ctx.font = "bold 32px Arial";
            ctx.fillText("TEKAN E UNTUK MELIHAT ABOUT ME", 512, 445);

            ctx.fillStyle = "#ffffff";
            ctx.font = "23px Arial";
            ctx.fillText("EXPLORE • DISCOVER • CREATE", 512, 500);

            const texture = new THREE.CanvasTexture(canvasTex);
            if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        }

        function createIntroBoard(x, z) {
            const boardGroup = new THREE.Group();
            boardGroup.position.set(x, 0, z);
            boardGroup.userData.type = "about";
            boardGroup.rotation.y = 0;

            const boardWidth = 4.8;
            const boardHeight = 2.8;
            const boardThickness = 0.22;
            const boardCenterY = 3.2;
            const postHeight = boardCenterY - boardHeight / 2;

            const postMaterial = new THREE.MeshStandardMaterial({
                color: 0x2b2b2b,
                roughness: 0.6
            });
            const postGeometry = new THREE.CylinderGeometry(0.14, 0.16, postHeight, 12);

            const leftPost = new THREE.Mesh(postGeometry, postMaterial);
            leftPost.position.set(-1.6, postHeight / 2, -0.05);
            leftPost.castShadow = true;
            boardGroup.add(leftPost);

            const rightPost = new THREE.Mesh(postGeometry, postMaterial);
            rightPost.position.set(1.6, postHeight / 2, -0.05);
            rightPost.castShadow = true;
            boardGroup.add(rightPost);

            const board = new THREE.Mesh(
                new THREE.BoxGeometry(boardWidth, boardHeight, boardThickness),
                new THREE.MeshStandardMaterial({ map: createIntroTexture() })
            );
            board.position.set(0, boardCenterY, 0.05);
            board.castShadow = true;
            board.receiveShadow = true;
            boardGroup.add(board);

            addCollisionBox(x, z, 3.2, 0.6);
            aboutBoard.group = boardGroup;
            scene.add(boardGroup);
            return boardGroup;
        }

        function createSignTexture(title, category) {
            const canvasTex = document.createElement("canvas");
            canvasTex.width = 1024;
            canvasTex.height = 512;
            const ctx = canvasTex.getContext("2d");

            ctx.fillStyle = "#111111";
            ctx.fillRect(0, 0, 1024, 512);

            ctx.strokeStyle = "#4fd1c5";
            ctx.lineWidth = 14;
            ctx.strokeRect(12, 12, 1000, 488);

            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 34px Arial";
            ctx.textAlign = "center";
            ctx.fillText(category, 512, 100);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 76px Arial";
            ctx.fillText(title, 512, 215);

            ctx.fillStyle = "#a3e635";
            ctx.font = "bold 36px Arial";
            ctx.fillText("TEKAN E UNTUK MELIHAT", 512, 385);

            const texture = new THREE.CanvasTexture(canvasTex);
            if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        }

        function createProjectSign(projectId, x, z) {
            const data = projects[projectId];
            const sign = new THREE.Group();
            sign.position.set(x, 0, z);

            const boardWidth = 3.6;
            const boardHeight = 1.8;
            const boardThickness = 0.2;
            const boardCenterY = 3.8;
            const postHeight = boardCenterY - boardHeight / 2;

            const post = new THREE.Mesh(
                new THREE.CylinderGeometry(0.14, 0.16, postHeight, 12),
                new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.6 })
            );
            post.position.set(0, postHeight / 2, -0.05);
            post.castShadow = true;
            sign.add(post);

            const board = new THREE.Mesh(
                new THREE.BoxGeometry(boardWidth, boardHeight, boardThickness),
                new THREE.MeshStandardMaterial({ map: createSignTexture(data.title, data.category) })
            );
            board.position.set(0, boardCenterY, 0.05);
            board.castShadow = true;
            sign.add(board);

            addCollisionBox(x, z, 1.2, 1.2);
            sign.userData.projectId = projectId;
            sign.userData.interactionRadius = 5.0;
            projectSigns.push(sign);
            scene.add(sign);
            return sign;
        }

        // =============================================
        // 14. WORLD BOARD PLACEMENT
        // =============================================

        createIntroBoard(0, 1.5);
        createProjectSign("smartvoc", 20, 0);     // EAST
        createProjectSign("blockfight", 0, -23);  // SOUTH
        createProjectSign("uiux", -20, 0);       // WEST
        createProjectSign("graphic", 0, 23);     // NORTH

        // =============================================
        // 15. LET'S CONNECT FINISH AREA
        // =============================================

        const finishPoint = {
            x: 0,
            z: -41,
            interactionRadius: 5.5,
            group: null
        };

        function createFinishTexture() {
            const finishCanvas = document.createElement("canvas");
            finishCanvas.width = 1024;
            finishCanvas.height = 512;
            const ctx = finishCanvas.getContext("2d");

            ctx.fillStyle = "#111111";
            ctx.fillRect(0, 0, 1024, 512);

            ctx.strokeStyle = "#4fd1c5";
            ctx.lineWidth = 14;
            ctx.strokeRect(12, 12, 1000, 488);

            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 34px Arial";
            ctx.textAlign = "center";
            ctx.fillText("PORTFOLIO COMPLETE", 512, 90);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 74px Arial";
            ctx.fillText("LET'S CONNECT", 512, 210);

            ctx.fillStyle = "#a3e635";
            ctx.font = "bold 32px Arial";
            ctx.fillText("TEKAN E UNTUK MELANJUTKAN", 512, 350);

            ctx.fillStyle = "#dddddd";
            ctx.font = "24px Arial";
            ctx.fillText("Thanks for exploring my work.", 512, 420);

            const texture = new THREE.CanvasTexture(finishCanvas);
            if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        }

        function createFinishArea() {
            const finishGroup = new THREE.Group();
            finishGroup.position.set(finishPoint.x, 0, finishPoint.z);

            const poleMaterial = new THREE.MeshStandardMaterial({
                color: 0x2b2b2b,
                roughness: 0.6
            });
            const poleGeometry = new THREE.CylinderGeometry(0.13, 0.16, 5.0, 12);

            const leftPole = new THREE.Mesh(poleGeometry, poleMaterial);
            leftPole.position.set(-3.0, 2.5, 0);
            leftPole.castShadow = true;
            finishGroup.add(leftPole);

            const rightPole = new THREE.Mesh(poleGeometry, poleMaterial);
            rightPole.position.set(3.0, 2.5, 0);
            rightPole.castShadow = true;
            finishGroup.add(rightPole);

            const finishBoard = new THREE.Mesh(
                new THREE.BoxGeometry(6.6, 2.7, 0.22),
                new THREE.MeshStandardMaterial({ map: createFinishTexture() })
            );
            finishBoard.position.set(0, 3.4, 0);
            finishBoard.castShadow = true;
            finishBoard.receiveShadow = true;
            finishGroup.add(finishBoard);

            const flagMaterial = new THREE.MeshStandardMaterial({
                color: 0x4fd1c5,
                side: THREE.DoubleSide
            });

            const leftFlag = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.0), flagMaterial);
            leftFlag.position.set(-3.0 + 0.9, 4.2, 0);
            leftFlag.rotation.y = Math.PI / 2;
            finishGroup.add(leftFlag);

            const rightFlag = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.0), flagMaterial);
            rightFlag.position.set(3.0 - 0.9, 4.2, 0);
            rightFlag.rotation.y = -Math.PI / 2;
            finishGroup.add(rightFlag);

            const platform = new THREE.Mesh(
                new THREE.CylinderGeometry(4.5, 4.5, 0.18, 48),
                new THREE.MeshStandardMaterial({ color: 0x315526, roughness: 0.9 })
            );
            platform.position.y = 0.09;
            platform.receiveShadow = true;
            finishGroup.add(platform);

            scene.add(finishGroup);
            finishPoint.group = finishGroup;
        }

        createFinishArea();

        // =====================================================
        // PORTFOLIO IMAGE CACHE + SMART LAZY LOADING
        // =====================================================

        // URL gambar yang sudah berhasil dimuat.
        const loadedPortfolioImages = new Set();

        // Observer untuk memuat gambar saat mendekati viewport.
        const portfolioImageObserver =
            "IntersectionObserver" in window
                ? new IntersectionObserver(
                    (entries, observer) => {
                        entries.forEach((entry) => {
                            if (!entry.isIntersecting) return;

                            const image = entry.target;

                            observer.unobserve(image);

                            loadPortfolioImageSource(image);
                        });
                    },
                    {
                        root: null,
                        rootMargin: "300px 0px",
                        threshold: 0.01
                    }
                )
                : null;

        // Memulai pemuatan gambar.
        function loadPortfolioImageSource(image) {
            if (!image) return;

            const source = image.dataset.src;

            if (!source) return;

            // Hindari request ulang pada elemen yang sama.
            if (
                image.dataset.requestedSrc === source &&
                image.getAttribute("src")
            ) {
                return;
            }

            image.dataset.requestedSrc = source;

            image.onload = () => {
                loadedPortfolioImages.add(source);

                image.classList.add("image-loaded");
            };

            image.onerror = () => {
                loadedPortfolioImages.delete(source);

                if (image.dataset.requestedSrc === source) {
                    image.dataset.requestedSrc = "";
                    image.removeAttribute("src");
                }

                console.warn(
                    "[Image Cache] Gagal memuat gambar:",
                    source
                );
            };

            image.src = source;
        }

        // Fungsi utama untuk menyiapkan gambar.
        function preparePortfolioImage(
            image,
            source,
            alt = "",
            options = {}
        ) {
            if (!image || !source) return;

            const eager = options.eager === true;

            image.alt = alt;
            image.decoding = "async";
            image.loading = eager ? "eager" : "lazy";

            image.dataset.src = source;

            // URL sama dan elemen sudah memiliki sumber.
            if (
                image.dataset.requestedSrc === source &&
                image.getAttribute("src")
            ) {
                return;
            }

            // Gambar prioritas atau URL yang sudah pernah berhasil dimuat.
            if (
                eager ||
                loadedPortfolioImages.has(source) ||
                !portfolioImageObserver
            ) {
                portfolioImageObserver?.unobserve(image);

                loadPortfolioImageSource(image);

                return;
            }

            // Tunggu sampai gambar mendekati viewport.
            portfolioImageObserver.observe(image);
        }

        // Preload gambar tetangga untuk navigasi lightbox.
        function preloadPortfolioImage(source) {
            if (!source || loadedPortfolioImages.has(source)) {
                return;
            }

            const preloadImage = new Image();

            preloadImage.decoding = "async";

            preloadImage.onload = () => {
                loadedPortfolioImages.add(source);
            };

            preloadImage.src = source;
        }

        // =============================================
        // 16. GRAPHIC DESIGN GALLERY & LIGHTBOX SYSTEM
        // =============================================

        let currentGraphicIndex = 0;
        let currentGraphicWorks = [];

        function renderGraphicDesignGallery(works) {
            const gallery = document.getElementById("graphic-design-gallery");
            if (!gallery) return;
            
            gallery.innerHTML = "";
            // Gunakan DocumentFragment untuk batching render ke GPU dalam 1 kali operasi
            const fragment = document.createDocumentFragment();
            
            works.forEach((work, index) => {
                const card = document.createElement("div");
                card.className = "design-card";
                card.dataset.category = work.category;
                card.dataset.title = work.title;
                
                const badge = document.createElement("div");
                badge.className = "design-card-badge";
                badge.textContent = work.category;
                
                const mediaContainer = document.createElement("div");
                mediaContainer.className = "design-card-media";
                
                const image = document.createElement("img");
                image.decoding = "async"; // Decode gambar di background thread
                
                preparePortfolioImage(
                    image,
                    work.image,
                    work.title
                );
                
                mediaContainer.appendChild(image);
                
                const overlay = document.createElement("div");
                overlay.className = "design-card-overlay";
                
                const info = document.createElement("div");
                info.className = "design-card-info";
                
                const category = document.createElement("span");
                category.className = "design-card-category";
                category.textContent = work.category.toUpperCase();
                
                const title = document.createElement("h3");
                title.className = "design-card-title";
                title.textContent = work.title;
                
                info.appendChild(category);
                info.appendChild(title);
                
                card.appendChild(badge);
                card.appendChild(mediaContainer);
                card.appendChild(overlay);
                card.appendChild(info);
                
                card.addEventListener("click", () => {
                    openGraphicDesignViewer(index, works);
                });
                
                fragment.appendChild(card);
            });
            // 1 kali append langsung memasang semua kartu tanpa jank
            
            gallery.appendChild(fragment);
        }

        function initializeGraphicDesignFilters(works) {
            const filterButtons = document.querySelectorAll("#graphic-design-filters button");
            if (!filterButtons.length) return;
            
            filterButtons.forEach((button) => {
                button.onclick = () => {
                    const selectedCategory = button.dataset.category || button.dataset.filter || "all";
                    
                    filterButtons.forEach((btn) => {
                        btn.classList.remove("active");
                    });
                    
                    button.classList.add("active");
                    const filteredWorks =
                        selectedCategory === "all"
                        ? works
                        : works.filter((work) => work.category === selectedCategory);
                    
                    renderGraphicDesignGallery(filteredWorks);
                };
            });
        }
        
        function openGraphicDesignViewer(index, works) {
            currentGraphicIndex = index;
            currentGraphicWorks = works;
            const viewer = document.getElementById("graphic-design-viewer");
            if (!viewer) return;
            
            updateGraphicDesignViewer();
            viewer.classList.remove("hidden");
            viewer.style.display = "flex";
        }
        
        function updateGraphicDesignViewer() {
            const activeWork = currentGraphicWorks[currentGraphicIndex];
            if (!activeWork) return;
            
            const viewerImage = document.getElementById("graphic-design-viewer-image");
            const viewerTitle = document.getElementById("graphic-design-viewer-title");
            const viewerCategory = document.getElementById("graphic-design-viewer-category");
            
            if (viewerImage) {
                preparePortfolioImage(
                    viewerImage,
                    activeWork.image,
                    activeWork.title,
                    {
                        eager: true
                    }
                );
            }

            // Siapkan gambar berikutnya untuk navigasi lebih cepat.
            if (currentGraphicWorks.length > 1) {
                const nextIndex =
                    (currentGraphicIndex + 1) %
                    currentGraphicWorks.length;

                const previousIndex =
                    (
                        currentGraphicIndex -
                        1 +
                        currentGraphicWorks.length
                    ) %
                    currentGraphicWorks.length;

                preloadPortfolioImage(
                    currentGraphicWorks[nextIndex].image
                );

                preloadPortfolioImage(
                    currentGraphicWorks[previousIndex].image
                );
            }

            if (viewerTitle) {
                viewerTitle.textContent = activeWork.title;
            }
            if (viewerCategory) {
                viewerCategory.textContent = activeWork.category.toUpperCase();
            }
        }
        
        function closeGraphicDesignViewer() {
            const viewer = document.getElementById("graphic-design-viewer");
            if (!viewer) return;
            viewer.classList.add("hidden");
            viewer.style.display = "none";
        }
        
        function navigateGraphicDesignViewer(direction) {
            if (!currentGraphicWorks.length) return;
            
            currentGraphicIndex += direction;
            
            if (currentGraphicIndex < 0) {
                currentGraphicIndex = currentGraphicWorks.length - 1;
            } else if (currentGraphicIndex >= currentGraphicWorks.length) {
                currentGraphicIndex = 0;
            }
            updateGraphicDesignViewer();
        }

        function renderUIUXProjects() {
            const container = document.getElementById("uiux-project-grid");
            if (!container) return;
            container.innerHTML = "";
            
            uiuxWorks.forEach((project) => {
                const card = document.createElement("article");
                card.className = "uiux-project-card";
                
                const cover = document.createElement("div");
                cover.className = "uiux-card-cover";
                
                const image = document.createElement("img");

                preparePortfolioImage(
                    image,
                    project.cover,
                    project.title
                );
                
                image.addEventListener("error", () => {
                    console.warn(
                        "Cover UI/UX tidak ditemukan:",
                        project.cover
                    );
                });
                
                cover.appendChild(image);
                
                const content = document.createElement("div");
                content.className = "uiux-card-content";
                
                const category = document.createElement("div");
                category.className = "uiux-card-category";
                category.textContent = project.category;
                
                const title = document.createElement("h3");
                title.textContent = project.title;
                
                const description = document.createElement("p");
                description.textContent = project.description;
                
                const details = document.createElement("div");
                details.className = "uiux-project-details";
                
                const overview = document.createElement("p");
                overview.textContent = project.overview;
                
                const focus = document.createElement("p");
                focus.innerHTML = `<strong>Design Focus:</strong> ${project.designFocus}`;
                
                const objective = document.createElement("p");
                objective.innerHTML = `<strong>Objective:</strong> ${project.objective}`;
                
                details.append(overview, focus, objective);
                
                const actions = document.createElement("div");
                actions.className = "uiux-card-actions";
                
                const designButton = document.createElement("button");
                designButton.className = "uiux-design-button";
                designButton.type = "button";
                designButton.textContent = "View Design Canvas ↗";
                
                designButton.addEventListener("click", () => {
                    openUIUXViewer(project, "design");
                });
                
                const prototypeButton = document.createElement("button");
                prototypeButton.className = "uiux-explore-button";
                prototypeButton.type = "button";
                prototypeButton.textContent = "Explore Prototype ↗";
                
                prototypeButton.addEventListener("click", () => {
                    openUIUXViewer(project, "prototype");
                });
                
                actions.append(designButton, prototypeButton);
                content.append(category, title, description, details, actions);
                card.append(cover, content);
                
                container.appendChild(card);
            });
        }

        function getFigmaEmbedUrl(figmaUrl) {
            const url = new URL(figmaUrl);
            
            if (
                url.hostname !== "figma.com" &&
                !url.hostname.endsWith(".figma.com")
            ) {
                throw new Error("Invalid Figma URL");
            }
            
            const isDesign = url.pathname.startsWith("/design/");
            const isPrototype = url.pathname.startsWith("/proto/");
            
            if (!isDesign && !isPrototype) {
                throw new Error("Unsupported Figma URL");
            }
            
            url.hostname = "embed.figma.com";
            url.searchParams.set("embed-host", "sadam-portfolio");
            url.searchParams.set("footer", "false");
            url.searchParams.set("viewport-controls", "true");
            
            return url.toString();
        }

        function openUIUXViewer(project, mode = "prototype") {
            const viewer = document.getElementById("uiux-viewer");
            const iframe = document.getElementById("uiux-figma-frame");
            const title = document.getElementById("uiux-viewer-title");
            const externalLink = document.getElementById("uiux-open-figma");
            const viewerLabel = document.getElementById("uiux-viewer-label");
            const viewerHint = document.getElementById("uiux-viewer-hint");
            
            if (!viewer || !iframe || !title || !externalLink) {
                console.error("UI/UX viewer HTML tidak ditemukan.");
                return;
            }
            
            const isDesign = mode === "design";
            
            const figmaUrl = isDesign
                ? project.designUrl
                : project.figmaUrl;
            
            if (!figmaUrl) {
                console.error("URL Figma tidak tersedia:", project.title);
                return;
            }
            
            title.textContent = project.title;
            externalLink.href = figmaUrl;
            externalLink.textContent = "Open in Figma ↗";
            
            if (viewerLabel) {
                viewerLabel.textContent = isDesign
                    ? "DESIGN CANVAS"
                    : "INTERACTIVE PROTOTYPE";
            }
            
            if (viewerHint) {
                viewerHint.textContent = isDesign
                    ? "Explore the original Figma design. Use the Figma viewport controls to zoom and pan around the canvas."
                    : "Explore the interactive prototype and experience the interface flow.";
            }
            
            try {
                iframe.src = getFigmaEmbedUrl(figmaUrl);
            } catch (error) {
                console.error("Figma embed error:", error);
                return;
            }
            viewer.classList.remove("hidden");
        }
        
        function closeUIUXViewer() {
            const viewer = document.getElementById("uiux-viewer");
            const iframe = document.getElementById("uiux-figma-frame");
            if (!viewer || !iframe) return;
            viewer.classList.add("hidden");
            iframe.src = "about:blank";
        }

        function openUIUXShowcase() {
            const panel = document.getElementById("uiux-showcase-panel");

            if (!panel) {
                console.error("UI/UX showcase panel tidak ditemukan.");
                return;
            }

            renderUIUXProjects();

            panel.classList.remove("hidden");
            panel.style.display = "block";

            canvas.style.cursor = "default";

            if (interactionPrompt) {
                interactionPrompt.classList.add("hidden");
            }

            if (document.exitPointerLock) {
                document.exitPointerLock();
            }
        }

        const uiuxViewerClose = document.getElementById("uiux-viewer-close");
        if (uiuxViewerClose) {
            uiuxViewerClose.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                closeUIUXViewer();
            });
        }

        document.addEventListener("keydown", (event) => {
            const viewer = document.getElementById("uiux-viewer");
            if (
                event.key === "Escape" &&
                viewer &&
                !viewer.classList.contains("hidden")
            ) {
                closeUIUXViewer();
            }
        });

        // =============================================
        // 17. MODAL & INTERACTION SYSTEM (FIXED DIST BUG)
        // =============================================

        const interactionPrompt = document.getElementById("interaction-prompt");
        let nearestProject = null;
        let nearestAboutBoard = false;
        let nearestFinish = false;

        function updateProjectDetection() {
            if (projectOpen || finishOpen) {
                if (interactionPrompt) interactionPrompt.classList.add("hidden");
                nearestProject = null;
                nearestAboutBoard = false;
                nearestFinish = false;
                return;
            }

            nearestFinish = false;
            const finishDX = player.position.x - finishPoint.x;
            const finishDZ = player.position.z - finishPoint.z;
            const finishDistance = Math.sqrt(finishDX * finishDX + finishDZ * finishDZ);

            if (finishDistance < finishPoint.interactionRadius) {
                nearestFinish = true;
                nearestProject = null;
                nearestAboutBoard = false;

                if (interactionPrompt) {
                    interactionPrompt.classList.remove("hidden");
                    const key = interactionPrompt.querySelector(".key");
                    const text = interactionPrompt.querySelector("span:last-child");
                    if (key) key.textContent = "E";
                    if (text) text.textContent = "Let's Connect";
                }
                return;
            }

            nearestAboutBoard = false;
            if (aboutBoard.group) {
                const dx = player.position.x - aboutBoard.group.position.x;
                const dz = player.position.z - aboutBoard.group.position.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist < aboutBoard.interactionRadius) {
                    nearestAboutBoard = true;
                    nearestProject = null;

                    if (interactionPrompt) {
                        interactionPrompt.classList.remove("hidden");
                        const key = interactionPrompt.querySelector(".key");
                        const text = interactionPrompt.querySelector("span:last-child");
                        if (key) key.textContent = "E";
                        if (text) text.textContent = "About Me";
                    }
                    return;
                }
            }

            let closest = null;
            let closestDistance = Infinity;

            for (const sign of projectSigns) {
                const dx = player.position.x - sign.position.x;
                const dz = player.position.z - sign.position.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist < sign.userData.interactionRadius && dist < closestDistance) {
                    closest = sign;
                    closestDistance = dist;
                }
            }

            nearestProject = closest;

            if (interactionPrompt) {
                if (nearestProject) {
                    interactionPrompt.classList.remove("hidden");
                    const key = interactionPrompt.querySelector(".key");
                    const text = interactionPrompt.querySelector("span:last-child");
                    if (key) key.textContent = "E";
                    if (text) text.textContent = "View Project";
                } else {
                    interactionPrompt.classList.add("hidden");
                }
            }
        }

        function getSketchfabEmbedUrl(modelId) {
            if (!/^[a-f0-9]{32}$/i.test(modelId)) {
                throw new Error("Invalid Sketchfab model ID.");
            }
            const embedUrl = new URL(
                `https://sketchfab.com/models/${modelId}/embed`
            );
            
            // autostart=0 mencegah GPU overheat & stutter saat model dimuat
            embedUrl.searchParams.set("autostart", "0");
            embedUrl.searchParams.set("ui_controls", "1");
            embedUrl.searchParams.set("ui_infos", "0");
            embedUrl.searchParams.set("ui_inspector", "0");
            embedUrl.searchParams.set("ui_stop", "0");
            embedUrl.searchParams.set("ui_watermark", "1");
            embedUrl.searchParams.set("ui_watermark_link", "1");
            
            return embedUrl.toString();
        }
        
        function renderSketchfabShowcase(
            videoContainer,
            screenshotContainer,
            models,
            projectTitle
        ) {
            if (
                !videoContainer ||
                !screenshotContainer ||
                !Array.isArray(models) ||
                models.length === 0
            ) {
                console.error("Sketchfab showcase elements are incomplete.");
                return;
            }

            const detailPanel = document.getElementById(
                "sketchfab-model-details"
            );

            const detailTitle = document.getElementById(
                "sketchfab-model-title"
            );

            const detailCategory = document.getElementById(
                "sketchfab-model-category"
            );

            const detailDescription = document.getElementById(
                "sketchfab-model-description"
            );

            const detailTags = document.getElementById(
                "sketchfab-model-tags"
            );

            const galleryHeading = screenshotContainer
                .closest(".project-gallery")
                ?.querySelector("h3");

            // =============================================
            // 1. CEK CACHE YANG SUDAH ADA
            // =============================================

            let cache = videoContainer._sketchfabCache;

            if (cache) {
                cache.models = models;
                cache.projectTitle = projectTitle;

                cache.stage.style.display = "block";
                cache.stage.style.visibility = "visible";

                cache.galleryGrid.style.display = "grid";

                const standardGallery = screenshotContainer.querySelector(
                    ".project-standard-gallery"
                );

                if (standardGallery) {
                    standardGallery.style.display = "none";
                }

                // Sembunyikan konten video proyek biasa.
                const standardMedia = videoContainer.querySelector(
                    ".project-standard-media"
                );

                if (standardMedia) {
                    standardMedia.style.display = "none";
                }

                screenshotContainer.classList.add(
                    "sketchfab-asset-grid"
                );

                if (galleryHeading) {
                    galleryHeading.textContent = "Explore 3D Assets";
                }

                // Pulihkan model terakhir tanpa reload iframe.
                const lastIndex = Math.min(
                    cache.activeModelIndex,
                    models.length - 1
                );

                cache.selectModel(lastIndex);

                return;
            }

            // =============================================
            // 2. BUAT VIEWER PERTAMA KALI
            // =============================================

            const stage = document.createElement("div");

            stage.className = "sketchfab-stage";

            const iframe = document.createElement("iframe");

            iframe.title = `${projectTitle} - Interactive 3D Viewer`;
            iframe.allow = "autoplay; fullscreen; xr-spatial-tracking";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";
            iframe.referrerPolicy = "strict-origin-when-cross-origin";

            const externalLink = document.createElement("a");

            externalLink.className = "sketchfab-open-link";
            externalLink.target = "_blank";
            externalLink.rel = "noopener noreferrer";
            externalLink.textContent = "Open on Sketchfab ↗";

            stage.append(iframe, externalLink);

            videoContainer.appendChild(stage);

            // =============================================
            // 3. SIAPKAN GALLERY
            // =============================================

            screenshotContainer.innerHTML = "";

            const galleryGrid = document.createElement("div");
            galleryGrid.className = "sketchfab-cache-grid sketchfab-asset-grid";
            galleryGrid.style.display = "grid";

            screenshotContainer.appendChild(galleryGrid);

            screenshotContainer.classList.add(
                "sketchfab-asset-grid"
            );

            if (galleryHeading) {
                if (!galleryHeading.dataset.originalText) {
                    galleryHeading.dataset.originalText =
                        galleryHeading.textContent.trim();
                }

                galleryHeading.textContent = "Explore 3D Assets";
            }

            // =============================================
            // 4. SIMPAN STATE CACHE
            // =============================================

            cache = {
                stage,
                iframe,
                externalLink,
                galleryGrid,
                models,
                projectTitle,
                activeModelIndex: 0,
                activeModelId: null,
                selectModel: null
            };

            videoContainer._sketchfabCache = cache;

            // =============================================
            // 5. UPDATE INFORMASI MODEL
            // =============================================

            function updateModelInformation(model) {
                if (!model) return;

                if (detailPanel) {
                    detailPanel.classList.remove("hidden");
                }

                if (detailTitle) {
                    detailTitle.textContent = model.title || "";
                }

                if (detailCategory) {
                    detailCategory.textContent = model.category || "";
                }

                if (detailDescription) {
                    detailDescription.textContent =
                        model.description || "";
                }

                if (detailTags) {
                    detailTags.innerHTML = "";

                    const tags = Array.isArray(model.tags)
                        ? model.tags
                        : [];

                    tags.forEach((tag) => {
                        const tagElement = document.createElement("span");

                        tagElement.className = "sketchfab-tag";
                        tagElement.textContent = tag;

                        detailTags.appendChild(tagElement);
                    });
                }
            }

            // =============================================
            // 6. PILIH MODEL
            // =============================================

            function selectSketchfabModel(index) {
                const model = cache.models[index];

                if (!model) return;

                cache.activeModelIndex = index;

                // Hanya ubah URL jika model benar-benar berbeda.
                // Model yang sama tidak akan memuat ulang iframe.
                if (cache.activeModelId !== model.id) {
                    try {
                        iframe.src = getSketchfabEmbedUrl(model.id);

                        cache.activeModelId = model.id;
                    } catch (error) {
                        console.error(
                            "Sketchfab embed error:",
                            error
                        );

                        return;
                    }
                }

                iframe.title = `${model.title} - Interactive 3D Model`;

                externalLink.href = model.url;

                updateModelInformation(model);

                // Update kartu aktif.
                const cards = galleryGrid.querySelectorAll(
                    ".sketchfab-asset-card"
                );

                cards.forEach((card, cardIndex) => {
                    const isActive = cardIndex === index;

                    card.classList.toggle("active", isActive);

                    card.setAttribute(
                        "aria-pressed",
                        isActive ? "true" : "false"
                    );
                });
            }

            cache.selectModel = selectSketchfabModel;

            // =============================================
            // 7. BUAT KARTU MODEL SATU KALI
            // =============================================

            const fragment = document.createDocumentFragment();

            models.forEach((model, index) => {
                const card = document.createElement("button");

                card.type = "button";
                card.className = "sketchfab-asset-card";
                card.setAttribute("aria-pressed", "false");

                const number = document.createElement("span");

                number.className = "sketchfab-asset-number";
                number.textContent = String(index + 1).padStart(2, "0");

                const information = document.createElement("span");

                information.className = "sketchfab-asset-information";

                const title = document.createElement("strong");

                title.textContent = model.title;

                const category = document.createElement("small");

                category.textContent = model.category;

                information.append(title, category);

                card.append(number, information);

                card.addEventListener("click", () => {
                    cache.selectModel(index);
                });

                fragment.appendChild(card);
            });

            galleryGrid.appendChild(fragment);

            // =============================================
            // 8. LOAD MODEL PERTAMA
            // =============================================

            cache.selectModel(0);

            console.log(
                "[Sketchfab Cache] Showcase initialized:",
                models.length,
                "models"
            );
        }

        // BUKA PROJECT MODAL
        function openProject(projectId) {
            const data = projects[projectId];
            if (!data) return;

            projectOpen = true;
            const projectPanel = document.getElementById("project-panel");
            const aboutPanel = document.getElementById("about-panel");
            const graphicPanel = document.getElementById("graphic-design-panel");

            if (aboutPanel) {
                aboutPanel.classList.add("hidden");
                aboutPanel.style.display = "none";
            }

            if (projectId === "uiux") {
                if (projectPanel) {
                    projectPanel.classList.add("hidden");
                    projectPanel.style.display = "none";
                }
                if (graphicPanel) {
                    graphicPanel.classList.add("hidden");
                    graphicPanel.style.display = "none";
                }
                openUIUXShowcase();
                return;
            }

            // CEK KHUSUS GRAPHIC DESIGN GALLERY
            if (projectId === "graphic") {
                const works = data.graphicWorks || [];
                renderGraphicDesignGallery(works);
                initializeGraphicDesignFilters(works);

                if (graphicPanel) {
                    if (projectPanel) {
                        projectPanel.classList.add("hidden");
                        projectPanel.style.display = "none";
                    }
                    graphicPanel.classList.remove("hidden");
                    graphicPanel.style.display = "block";

                    canvas.style.cursor = "default";
                    if (interactionPrompt) interactionPrompt.classList.add("hidden");
                    if (document.exitPointerLock) document.exitPointerLock();
                    return;
                }
            } else {
                if (graphicPanel) {
                    graphicPanel.classList.add("hidden");
                    graphicPanel.style.display = "none";
                }
            }

            canvas.style.cursor = "default";

            const title = document.getElementById("project-title");
            const desc = document.getElementById("project-description");
            const about = document.getElementById("project-about");
            const tech = document.getElementById("project-technologies");
            const cont = document.getElementById("project-contribution");

            if (title) title.textContent = data.title;
            if (desc) desc.textContent = data.description;
            if (about) about.textContent = data.about;
            if (tech) tech.textContent = data.technologies;
            if (cont) cont.textContent = data.contribution;

            const videoContainer = document.getElementById(
                "project-video-placeholder"
            );

            const screenshotContainer = document.getElementById(
                "project-screenshots"
            );

            const sketchfabCache = videoContainer?._sketchfabCache;

            // =============================================
            // PROJECT WITH 3D MODELS
            // =============================================

            if (Array.isArray(data.models) && data.models.length > 0) {
                renderSketchfabShowcase(
                    videoContainer,
                    screenshotContainer,
                    data.models,
                    data.title
                );

                // Tampilkan kembali gallery Sketchfab.
                const cache = videoContainer._sketchfabCache;

                if (cache) {
                    cache.stage.style.display = "block";
                    cache.galleryGrid.style.display = "grid";
                }

                // Sembunyikan media proyek biasa.
                const standardMedia = videoContainer.querySelector(
                    ".project-standard-media"
                );

                if (standardMedia) {
                    standardMedia.style.display = "none";
                }

                const standardGallery = screenshotContainer.querySelector(
                    ".project-standard-gallery"
                );

                if (standardGallery) {
                    standardGallery.style.display = "none";
                }

                screenshotContainer.classList.add(
                    "sketchfab-asset-grid"
                );

            // =============================================
            // NORMAL PROJECT WITHOUT 3D MODELS
            // =============================================

            } else {
                // Sembunyikan viewer Sketchfab tanpa menghapusnya.
                if (sketchfabCache) {
                    sketchfabCache.stage.style.display = "none";
                    sketchfabCache.galleryGrid.style.display = "none";
                }

                // Buat atau gunakan kembali area media biasa (Cegah Duplikasi Video).
                if (videoContainer) {
                    // Bersihkan jika ada iframe nyasar langsung di videoContainer
                    videoContainer.querySelectorAll(":scope > iframe").forEach((f) => f.remove());

                    let standardMedia = videoContainer.querySelector(
                        ".project-standard-media"
                    );

                    if (!standardMedia) {
                        standardMedia = document.createElement("div");
                        standardMedia.className = "project-standard-media";
                        videoContainer.appendChild(standardMedia);
                    }

                    standardMedia.style.display = "block";

                    if (data.video) {
                        let iframe = standardMedia.querySelector("iframe");

                        if (!iframe) {
                            standardMedia.innerHTML = "";
                            iframe = document.createElement("iframe");
                            iframe.title = `${data.title} Project Video`;
                            iframe.allow =
                                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                            iframe.allowFullscreen = true;
                            iframe.loading = "lazy";
                            standardMedia.appendChild(iframe);
                        }

                        if (iframe.src !== data.video) {
                            iframe.src = data.video;
                        }
                    } else {
                        standardMedia.innerHTML = "<span>VIDEO COMING SOON</span>";
                    }
                }

                // Buat atau gunakan kembali gallery proyek biasa tanpa reload berulang.
                if (screenshotContainer) {
                    let standardGallery = screenshotContainer.querySelector(
                        ".project-standard-gallery"
                    );

                    if (!standardGallery) {
                        standardGallery = document.createElement("div");
                        standardGallery.className = "project-standard-gallery";
                        screenshotContainer.appendChild(standardGallery);
                    }

                    standardGallery.style.display = "grid";

                    if (standardGallery.dataset.activeProject !== projectId) {
                        standardGallery.dataset.activeProject = projectId;
                        standardGallery.innerHTML = "";

                        if (Array.isArray(data.screenshots)) {
                            data.screenshots.forEach((imagePath, index) => {
                                const link = document.createElement("a");
                                const image = document.createElement("img");

                                link.href = imagePath;
                                link.target = "_blank";
                                link.rel = "noopener noreferrer";

                                preparePortfolioImage(
                                    image,
                                    imagePath,
                                    `${data.title} Screenshot ${index + 1}`
                                );

                                link.appendChild(image);
                                standardGallery.appendChild(link);
                            });
                        }
                    }

                    screenshotContainer.classList.remove(
                        "sketchfab-asset-grid"
                    );

                    const galleryHeading = screenshotContainer
                        .closest(".project-gallery")
                        ?.querySelector("h3");

                    if (
                        galleryHeading &&
                        galleryHeading.dataset.originalText
                    ) {
                        galleryHeading.textContent =
                            galleryHeading.dataset.originalText;
                    }
                }

                // Sembunyikan informasi khusus model 3D.
                const detailPanel = document.getElementById(
                    "sketchfab-model-details"
                );

                if (detailPanel) {
                    detailPanel.classList.add("hidden");
                }
            }
            if (projectPanel) {
                projectPanel.classList.toggle("is-3d-showcase", projectId === "blockfight");
                projectPanel.classList.remove("hidden");
                projectPanel.style.display = "block";
            }

            if (interactionPrompt) interactionPrompt.classList.add("hidden");
            if (document.exitPointerLock) document.exitPointerLock();
        }

        // BUKA ABOUT ME MODAL
        function openAbout() {
            const projectPanel = document.getElementById("project-panel");
            const aboutPanel = document.getElementById("about-panel");
            const graphicPanel = document.getElementById("graphic-design-panel");
            const uiuxPanel = document.getElementById("uiux-showcase-panel");

            if (!aboutPanel) return;

            projectOpen = true;

            if (projectPanel) {
                projectPanel.classList.add("hidden");
                projectPanel.style.display = "none";
            }

            if (graphicPanel) {
                graphicPanel.classList.add("hidden");
                graphicPanel.style.display = "none";
            }

            if (uiuxPanel) {
                uiuxPanel.classList.add("hidden");
                uiuxPanel.style.display = "none";
            }

            closeUIUXViewer();
            closeGraphicDesignViewer();

            canvas.style.cursor = "default";
            aboutPanel.classList.remove("hidden");
            aboutPanel.style.display = "block";

            if (interactionPrompt) interactionPrompt.classList.add("hidden");

            nearestProject = null;
            nearestAboutBoard = false;
            nearestFinish = false;

            if (document.exitPointerLock) document.exitPointerLock();
        }

        // BUKA LET'S CONNECT MODAL
        function openFinishScreen() {
            if (projectOpen || finishOpen) return;
            finishOpen = true;

            const projectPanel = document.getElementById("project-panel");
            const aboutPanel = document.getElementById("about-panel");
            const graphicPanel = document.getElementById("graphic-design-panel");
            const uiuxPanel = document.getElementById("uiux-showcase-panel");

            if (projectPanel) {
                projectPanel.classList.add("hidden");
                projectPanel.style.display = "none";
            }
            if (aboutPanel) {
                aboutPanel.classList.add("hidden");
                aboutPanel.style.display = "none";
            }
            if (graphicPanel) {
                graphicPanel.classList.add("hidden");
                graphicPanel.style.display = "none";
            }
            if (uiuxPanel) {
                uiuxPanel.classList.add("hidden");
                uiuxPanel.style.display = "none";
            }

            closeUIUXViewer();
            closeGraphicDesignViewer();

            const finishScreen = document.getElementById("finish-screen");
            const githubLink = document.getElementById("github-link");
            const linkedinLink = document.getElementById("linkedin-link");
            const emailLink = document.getElementById("email-link");

            if (githubLink) githubLink.href = "https://github.com/SadamAlkayyis117";
            if (linkedinLink) linkedinLink.href = "#";
            if (emailLink) emailLink.href = "#";

            if (finishScreen) {
                finishScreen.classList.remove("hidden");
                finishScreen.style.display = "flex";
            }

            if (interactionPrompt) interactionPrompt.classList.add("hidden");

            nearestProject = null;
            nearestAboutBoard = false;
            nearestFinish = false;
            moveDirection.set(0, 0, 0);

            if (document.exitPointerLock) document.exitPointerLock();
            canvas.style.cursor = "default";
        }

        function interactWithProject() {
            if (projectOpen || finishOpen) return;
            if (nearestFinish) {
                openFinishScreen();
                return;
            }
            if (nearestAboutBoard) {
                openAbout();
                return;
            }
            if (nearestProject) {
                openProject(nearestProject.userData.projectId);
            }
        }

        function closeAllPanels() {
            projectOpen = false;

            const projectPanel = document.getElementById("project-panel");
            const aboutPanel = document.getElementById("about-panel");
            const graphicPanel = document.getElementById("graphic-design-panel");
            const uiuxPanel = document.getElementById("uiux-showcase-panel");

            if (projectPanel) {
                projectPanel.classList.add("hidden");
                projectPanel.style.display = "none";
            }

            if (aboutPanel) {
                aboutPanel.classList.add("hidden");
                aboutPanel.style.display = "none";
            }

            if (graphicPanel) {
                graphicPanel.classList.add("hidden");
                graphicPanel.style.display = "none";
            }

            if (uiuxPanel) {
                uiuxPanel.classList.add("hidden");
                uiuxPanel.style.display = "none";
            }

            closeUIUXViewer();
            closeGraphicDesignViewer();

            canvas.style.cursor = "crosshair";
            nearestProject = null;
            nearestAboutBoard = false;
            nearestFinish = false;

            if (interactionPrompt) interactionPrompt.classList.add("hidden");
            if (canvas && canvas.requestPointerLock && !isTouchDevice) {
                canvas.requestPointerLock();
            }
        }

        function restartPortfolio() {
            const finishScreen = document.getElementById("finish-screen");
            finishOpen = false;

            if (finishScreen) {
                finishScreen.classList.add("hidden");
                finishScreen.style.display = "none";
            }

            const graphicPanel = document.getElementById("graphic-design-panel");
            if (graphicPanel) {
                graphicPanel.classList.add("hidden");
                graphicPanel.style.display = "none";
            }

            closeGraphicDesignViewer();

            projectOpen = false;
            player.position.set(0, 0, 6);
            player.rotation.y = 0;

            cameraYaw = 0;
            cameraPitch = 0.18;
            cameraDistance = 6.0;
            moveDirection.set(0, 0, 0);

            nearestProject = null;
            nearestAboutBoard = false;
            nearestFinish = false;

            canvas.style.cursor = "crosshair";
            if (interactionPrompt) interactionPrompt.classList.add("hidden");
            if (canvas && canvas.requestPointerLock && !isTouchDevice) {
                canvas.requestPointerLock();
            }
        }

        // Back button listeners
        document.querySelectorAll(".back-button, #about-back-button, #project-back-button, #graphic-design-back-button").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeAllPanels();
            });
        });

        // Event listener Lightbox Viewer Graphic Design
        const viewerCloseBtn = document.getElementById("graphic-design-viewer-close");
        const viewerPrevBtn = document.getElementById("graphic-design-viewer-prev");
        const viewerNextBtn = document.getElementById("graphic-design-viewer-next");
        const graphicViewerModal = document.getElementById("graphic-design-viewer");

        if (viewerCloseBtn) {
            viewerCloseBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeGraphicDesignViewer();
            });
        }

        if (viewerPrevBtn) {
            viewerPrevBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateGraphicDesignViewer(-1);
            });
        }

        if (viewerNextBtn) {
            viewerNextBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateGraphicDesignViewer(1);
            });
        }

        if (graphicViewerModal) {
            graphicViewerModal.addEventListener("click", (e) => {
                if (e.target === graphicViewerModal) {
                    closeGraphicDesignViewer();
                }
            });
        }

        const restartButton = document.getElementById("restart-button");
        if (restartButton) {
            restartButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                restartPortfolio();
            });
        }

        document.addEventListener("keydown", (e) => {
            const viewer = document.getElementById("graphic-design-viewer");
            const isViewerActive = viewer && !viewer.classList.contains("hidden") && viewer.style.display !== "none";

            if (isViewerActive) {
                if (e.code === "Escape") {
                    closeGraphicDesignViewer();
                    return;
                }
                if (e.code === "ArrowLeft") {
                    navigateGraphicDesignViewer(-1);
                    return;
                }
                if (e.code === "ArrowRight") {
                    navigateGraphicDesignViewer(1);
                    return;
                }
            }

            if (e.code === "Escape") {
                if (finishOpen) {
                    restartPortfolio();
                } else if (projectOpen) {
                    closeAllPanels();
                }
            }
        });

        // =============================================
        // 18. NPC SYSTEM
        // =============================================

        function createNPC(x, z, color, pathLength, activity) {
            const npc = new THREE.Group();
            npc.position.set(x, 0, z);
            scene.add(npc);

            const npcBody = new THREE.Mesh(
                new THREE.BoxGeometry(0.75, 1.1, 0.45),
                new THREE.MeshStandardMaterial({ color: color })
            );
            npcBody.position.y = 1.1;
            npcBody.castShadow = true;
            npc.add(npcBody);

            const npcHead = new THREE.Mesh(
                new THREE.SphereGeometry(0.33, 12, 12),
                new THREE.MeshStandardMaterial({ color: 0xe8bd96 })
            );
            npcHead.position.y = 1.9;
            npcHead.castShadow = true;
            npc.add(npcHead);

            const npcLegGeo = new THREE.BoxGeometry(0.23, 0.75, 0.28);
            const npcLegMat = new THREE.MeshStandardMaterial({ color: 0x202020 });

            const npcLeftLeg = new THREE.Mesh(npcLegGeo, npcLegMat);
            npcLeftLeg.position.set(-0.19, 0.38, 0);
            npcLeftLeg.castShadow = true;
            npc.add(npcLeftLeg);

            const npcRightLeg = new THREE.Mesh(npcLegGeo, npcLegMat);
            npcRightLeg.position.set(0.19, 0.38, 0);
            npcRightLeg.castShadow = true;
            npc.add(npcRightLeg);

            const npcArmGeo = new THREE.BoxGeometry(0.18, 0.75, 0.22);
            const npcArmMat = new THREE.MeshStandardMaterial({ color: color });

            const npcLeftArm = new THREE.Mesh(npcArmGeo, npcArmMat);
            npcLeftArm.position.set(-0.50, 1.15, 0);
            npcLeftArm.castShadow = true;
            npc.add(npcLeftArm);

            const npcRightArm = new THREE.Mesh(npcArmGeo, npcArmMat);
            npcRightArm.position.set(0.50, 1.15, 0);
            npcRightArm.castShadow = true;
            npc.add(npcRightArm);

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

            if (activity === "SWEEP") {
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

        const npc1 = createNPC(7, -7, 0xd94c4c, 4, "WALK");
        const npc2 = createNPC(15, 4, 0xf0a83c, 0, "SWEEP");
        const npc3 = createNPC(-14, -5, 0x8e5bd9, 0, "WATER");

        const npcs = [npc1, npc2, npc3];
        npcs.forEach((npc) => {
            addNPCCollider(npc);
        });

        function resolveNPCVsNPC() {
            for (let i = 0; i < npcs.length; i++) {
                for (let j = i + 1; j < npcs.length; j++) {
                    const a = npcs[i];
                    const b = npcs[j];
                    const dx = a.position.x - b.position.x;
                    const dz = a.position.z - b.position.z;
                    let distance = Math.sqrt(dx * dx + dz * dz);
                    const minDist = NPC_RADIUS * 2.2;

                    if (distance < minDist) {
                        if (distance < 0.001) distance = 0.001;
                        const push = (minDist - distance) / 2;
                        a.position.x += (dx / distance) * push;
                        a.position.z += (dz / distance) * push;
                        b.position.x -= (dx / distance) * push;
                        b.position.z -= (dz / distance) * push;
                    }
                }
            }
        }

        function updateNPCs(delta) {
            npcs.forEach((npc) => {
                const act = npc.userData.activity;
                npc.userData.activityTime += delta;

                if (act === "WALK") {
                    npc.userData.walkTime += delta * 8;
                    npc.position.x += npc.userData.direction * npc.userData.speed * delta;
                    if (Math.abs(npc.position.x - npc.userData.startX) > npc.userData.pathLength) {
                        npc.userData.direction *= -1;
                        npc.rotation.y = npc.userData.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
                    }
                    const swing = Math.sin(npc.userData.walkTime) * 0.45;
                    npc.userData.leftLeg.rotation.x = swing;
                    npc.userData.rightLeg.rotation.x = -swing;
                    npc.userData.leftArm.rotation.x = -swing;
                    npc.userData.rightArm.rotation.x = swing;
                }

                if (act === "SWEEP") {
                    const sweep = Math.sin(npc.userData.activityTime * 4);
                    npc.userData.body.rotation.z = sweep * 0.08;
                    npc.userData.leftArm.rotation.x = -0.4 + sweep * 0.25;
                    npc.userData.rightArm.rotation.x = -0.5 + sweep * 0.25;
                    if (npc.userData.broom) npc.userData.broom.rotation.x = sweep * 0.3;
                }

                if (act === "WATER") {
                    const water = Math.sin(npc.userData.activityTime * 3);
                    npc.userData.rightArm.rotation.x = -0.7 + water * 0.2;
                    npc.userData.leftArm.rotation.x = -0.2;
                    if (npc.userData.wateringCan) npc.userData.wateringCan.rotation.x = -0.3 + water * 0.3;
                }
            });

            resolveNPCVsNPC();
        }

        // =============================================
        // 19. LOADING & RESIZE
        // =============================================

        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (isTouchDevice) {
                updateMobileOrientation();
            }
        });

        // =============================================
        // 20. ANIMATION LOOP (OPTIMIZED)
        // =============================================

        const clock = new THREE.Clock();
        updateCamera(0.016);

        function animate() {
            requestAnimationFrame(animate);

            // Jika modal sedang terbuka, jeda update game agar tidak rebutan GPU dengan Sketchfab/Figma
            if (projectOpen || finishOpen) {
                return;
            }

            const delta = Math.min(clock.getDelta(), 0.05);

            updatePlayer(delta);
            updatePlayerAnimation(delta);
            updateNPCs(delta);
            resolvePlayerVsNPC();
            updateProjectDetection();
            updateCamera(delta);
            updateClouds(delta);
            updateBirds(delta);
            updateButterflies(delta);
            updateFireflies();

            renderer.render(scene, camera);
        }

        animate();

        console.log("=== CIRCULAR 3D WORLD + LET'S CONNECT + MOBILE RUNNING ===");
    }
}
