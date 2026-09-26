// =====================================================
// SADAM ALKAYYIS - INTERACTIVE 3D PORTFOLIO
// CIRCULAR OPEN WORLD + LET'S CONNECT + MOBILE PORTRAIT
// FULL FIXED & TESTED (DAY/NIGHT SKY FIX)
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

        // FIX: Gunakan clone() agar scene.background tidak merusak variabel daySkyColor
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
        // 3. LIGHTING & ATMOSPHERE
        // =============================================

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x557755, 2);
        scene.add(hemisphereLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 3);
        sunLight.position.set(20, 40, 20);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
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
        // 4. DAY / NIGHT SYSTEM (FIXED COLOR PRESERVATION)
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

            // Pastikan warna dikembalikan tepat ke warna biru siang
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

            // Pastikan warna diubah tepat ke warna gelap malam
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

        // Action Buttons Mobile
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
        // 11. PLAYER MOVEMENT & ANIMATION (KEYBOARD + JOYSTICK)
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

            cameraForward.set(Math.sin(cameraYaw), 0, Math.cos(cameraYaw)).normalize();
            cameraRight.set(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw)).normalize();

            // 1. Keyboard Input
            if (keys["KeyW"] || keys["ArrowUp"]) moveDirection.add(cameraForward);
            if (keys["KeyS"] || keys["ArrowDown"]) moveDirection.sub(cameraForward);
            if (keys["KeyA"] || keys["ArrowLeft"]) moveDirection.sub(cameraRight);
            if (keys["KeyD"] || keys["ArrowRight"]) moveDirection.add(cameraRight);

            // 2. Mobile Joystick Input
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

            // CIRCULAR WORLD LIMIT
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
                about: "An educational RPG that combines open-world exploration, missions, and vocabulary learning.",
                technologies: "Godot Engine • GDScript • Blender • JSON",
                contribution: "Game design, gameplay programming, UI implementation.",
                github: "https://github.com/SadamAlkayyis117",
                demo: "#"
            },
            blockfight: {
                title: "BlockFight",
                category: "GAME DEVELOPMENT",
                description: "Interactive game project focused on gameplay systems and player interaction.",
                about: "A gameplay-focused project developed to explore mechanics and real-time interaction.",
                technologies: "Godot Engine • GDScript • Blender",
                contribution: "Gameplay programming, mechanics implementation, level design.",
                github: "https://github.com/SadamAlkayyis117",
                demo: "#"
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
                about: "A selection of graphic design work created across various projects.",
                technologies: "CorelDRAW • Adobe Photoshop • Digital Illustration",
                contribution: "Graphic design, illustration, composition, layout.",
                github: "#",
                demo: "#"
            }
        };

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

        // =============================================
        // 16. MODAL & INTERACTION SYSTEM
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

            // 1. CEK FINISH AREA
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

            // 2. CEK ABOUT ME
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

            // 3. CEK PROJECT SIGNS
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

        // BUKA PROJECT MODAL
        function openProject(projectId) {
            const data = projects[projectId];
            if (!data) return;

            projectOpen = true;
            const projectPanel = document.getElementById("project-panel");
            const aboutPanel = document.getElementById("about-panel");

            if (aboutPanel) {
                aboutPanel.classList.add("hidden");
                aboutPanel.style.display = "none";
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

            const gh = document.getElementById("project-github");
            const dm = document.getElementById("project-demo");
            if (gh) gh.href = data.github;
            if (dm) dm.href = data.demo;

            if (projectPanel) {
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
            if (!aboutPanel) return;

            projectOpen = true;

            if (projectPanel) {
                projectPanel.classList.add("hidden");
                projectPanel.style.display = "none";
            }

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
            if (projectPanel) {
                projectPanel.classList.add("hidden");
                projectPanel.style.display = "none";
            }
            if (aboutPanel) {
                aboutPanel.classList.add("hidden");
                aboutPanel.style.display = "none";
            }

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

            if (projectPanel) {
                projectPanel.classList.add("hidden");
                projectPanel.style.display = "none";
            }

            if (aboutPanel) {
                aboutPanel.classList.add("hidden");
                aboutPanel.style.display = "none";
            }

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

        document.querySelectorAll(".back-button, #about-back-button, #project-back-button").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeAllPanels();
            });
        });

        const restartButton = document.getElementById("restart-button");
        if (restartButton) {
            restartButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                restartPortfolio();
            });
        }

        document.addEventListener("keydown", (e) => {
            if (e.code === "Escape") {
                if (finishOpen) {
                    restartPortfolio();
                } else if (projectOpen) {
                    closeAllPanels();
                }
            }
        });

        // =============================================
        // 17. NPC SYSTEM
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
        // 18. LOADING & RESIZE
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
        // 19. ANIMATION LOOP
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
