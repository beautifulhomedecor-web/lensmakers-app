/* =======================================
   Crowd Clash 3D — Game Logic (Hypercasual Style)
   ======================================= */

let MAT = null;
function initMaterials() {
    if (MAT) return;
    // Zenith Runner Aesthetic: OLED Black, Pure White, Vibrant Red
    MAT = {
        // Solid matte finishes for tight, true-to-palette colors
        mobBody:   new THREE.MeshStandardMaterial({ color: 0x2c9fc7, roughness: 0.6, metalness: 0.0 }), // Curious Blue
        enemyBody: new THREE.MeshStandardMaterial({ color: 0xe60023, roughness: 0.6, metalness: 0.0 }), // Red for opponent
        chrome:    new THREE.MeshStandardMaterial({ color: 0x1570ac, roughness: 0.4, metalness: 0.2 }), // Nice Blue
        pGlow:     new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x2c9fc7, emissiveIntensity: 1.0 }),
        eGlow:     new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xe60023, emissiveIntensity: 1.0 }),
        pGlowGiant:new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x2c9fc7, emissiveIntensity: 1.5 }),
        eGlowGiant:new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xe60023, emissiveIntensity: 1.5 }),
        
        cannonBase: new THREE.MeshStandardMaterial({ color: 0x1570ac, roughness: 0.4, metalness: 0.2 }),
        cannonBrl:  new THREE.MeshStandardMaterial({ color: 0x1570ac, roughness: 0.4, metalness: 0.2 }),
        
        baseRed:   new THREE.MeshStandardMaterial({ color: 0xe60023, roughness: 0.6, metalness: 0.0 }),
        baseDark:  new THREE.MeshStandardMaterial({ color: 0x8a1c22, roughness: 0.6, metalness: 0.0 }),
        
        // Solid Transparent Gates (Not hazy physical glass)
        gateFrame: new THREE.MeshStandardMaterial({ color: 0xf5ecd2, roughness: 0.4, metalness: 0.0 }), // Wheatfield
        gateMul:   new THREE.MeshStandardMaterial({ color: 0x2c9fc7, transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.0 }),
        gateAdd:   new THREE.MeshStandardMaterial({ color: 0x2c9fc7, transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.0 }),
        gateSub:   new THREE.MeshStandardMaterial({ color: 0xe60023, transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.0 }),
        
        powerUp:   new THREE.MeshStandardMaterial({ color: 0xfbb728, roughness: 0.1, metalness: 0.4 }), // Orange Yellow
        barricade: new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.5 }), // Black Walls
        ramp:      new THREE.MeshStandardMaterial({ color: 0x1570ac, roughness: 0.3, metalness: 0.1 }),
        crusher:   new THREE.MeshStandardMaterial({ color: 0x1570ac, roughness: 0.2, metalness: 0.6 }),
        spike:     new THREE.MeshStandardMaterial({ color: 0xf5ecd2, roughness: 0.1, metalness: 0.8 })
    };
}

/* =======================================
   MOB
   ======================================= */
class Mob {
    constructor(scene, x, z, team, isGiant = false) {
        this.scene = scene;
        this.team = team; 
        this.isGiant = isGiant;
        this.dead = false;
        this.passedGates = new Set();
        
        this.x = x;
        this.y = 0;
        this.z = z;
        this.vx = Utils.rand(-2, 2);
        this.vy = 0; 
        this.vz = -team * (isGiant ? 16 : 26) + Utils.rand(-1, 1);
        
        this.pushX = 0;
        this.pushZ = 0;
        
        this.radius = isGiant ? 1.4 : 0.5;
        this.health = isGiant ? 30 : 1;
        this.maxHealth = this.health;
        
        this.lifeTime = Utils.rand(0, 100);
        this.popScale = 0.01;
        
        this._build();
        this.mesh.position.set(x, 0, z);
        scene.add(this.mesh);
    }
    
    _build() {
        this.mesh = new THREE.Group();
        
        // Clean Pill Shape Body
        const bodyGeo = new THREE.CapsuleGeometry(0.45, 0.6, 8, 16);
        const bodyMat = this.team === 1 ? MAT.mobBody : MAT.enemyBody;
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.75; 
        body.castShadow = true;
        
        // Glowing vertical visor slit
        const glowMat = this.team === 1 ? (this.isGiant ? MAT.pGlowGiant : MAT.pGlow) : (this.isGiant ? MAT.eGlowGiant : MAT.eGlow);
        const visorGeo = new THREE.BoxGeometry(0.12, 0.5, 0.2);
        const visor = new THREE.Mesh(visorGeo, glowMat);
        visor.position.set(0, 0.8, -0.4); 
        
        // Chrome wings/accents
        const wingGeo = new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
        const wingL = new THREE.Mesh(wingGeo, MAT.chrome);
        wingL.position.set(-0.45, 0.75, 0);
        wingL.rotation.z = -0.2;
        const wingR = new THREE.Mesh(wingGeo, MAT.chrome);
        wingR.position.set(0.45, 0.75, 0);
        wingR.rotation.z = 0.2;
        
        this.mesh.add(body, visor, wingL, wingR);
    }
    
    update(dt, boundsX) {
        this.lifeTime += dt;
        if (this.popScale < 1) this.popScale = Math.min(1, this.popScale + dt * 15);
        
        this.x += (this.vx + this.pushX) * dt;
        this.z += (this.vz + this.pushZ) * dt;
        
        if (this.y > 0 || this.vy !== 0) {
            this.vy -= 45 * dt; 
            this.y += this.vy * dt;
            if (this.y <= 0) { this.y = 0; this.vy = 0; }
        }
        
        this.pushX *= 0.8;
        this.pushZ *= 0.8;
        
        if (this.x < -boundsX) { this.x = -boundsX; this.vx = Math.abs(this.vx); }
        if (this.x > boundsX)  { this.x = boundsX;  this.vx = -Math.abs(this.vx); }
        
        const bounce = this.y > 0 ? this.y : Math.abs(Math.sin(this.lifeTime * 20)) * 0.25;
        const s = this.popScale * (this.isGiant ? 2.0 : 1.0);
        
        this.mesh.scale.setScalar(s);
        this.mesh.position.set(this.x, bounce, this.z);
        this.mesh.rotation.x = this.team === 1 ? -0.15 : 0.15; // Lean forward
        this.mesh.rotation.y = this.vx * 0.1; // Lean into turns
        this.mesh.rotation.z = Utils.clamp(-this.vx * 0.08, -0.4, 0.4);
        
        // Wing animation
        if (this.mesh.children.length >= 4) {
            const flap = Math.sin(this.lifeTime * 25) * 0.3;
            this.mesh.children[2].rotation.x = flap;
            this.mesh.children[3].rotation.x = -flap;
        }
    }
}

/* =======================================
   CANNON
   ======================================= */
class Cannon {
    constructor(scene, upgrades) {
        this.x = 0; this.targetX = 0; this.z = 0;
        const frLvl = upgrades.fireRate || 1;
        this.fireInterval = Math.max(0.02, 0.12 - frLvl * 0.008);
        this.fireTimer = 0;
        this.shotCount = 0;
        this.buffType = null;
        this.buffTimer = 0;
        
        this._build();
        scene.add(this.mesh);
    }
    
    _build() {
        this.mesh = new THREE.Group();
        
        // Sleek silver base
        const baseGeo = new THREE.CylinderGeometry(2, 2.5, 1.2, 32);
        const base = new THREE.Mesh(baseGeo, MAT.chrome);
        base.position.y = 0.6; base.castShadow = true;
        
        // Blue glowing ring on base
        const baseRingGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 32);
        const baseRing = new THREE.Mesh(baseRingGeo, MAT.pGlow);
        baseRing.position.y = 1.0;
        baseRing.rotation.x = Math.PI/2;
        
        this.mesh.add(base, baseRing);
        
        // Smooth silver joint
        const jointGeo = new THREE.SphereGeometry(1.4, 32, 16);
        const joint = new THREE.Mesh(jointGeo, MAT.chrome);
        joint.position.y = 1.6;
        
        // Blue glowing accent on joint
        const jointDotGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.85, 16);
        const jointDot = new THREE.Mesh(jointDotGeo, MAT.pGlow);
        jointDot.position.y = 1.6;
        jointDot.rotation.z = Math.PI/2;
        
        this.mesh.add(joint, jointDot);
        
        // Sleek silver barrel
        this.barrel = new THREE.Group();
        const brlGeo = new THREE.CylinderGeometry(1.2, 1.2, 4.0, 32);
        const brl = new THREE.Mesh(brlGeo, MAT.chrome);
        brl.rotation.x = Math.PI/2; brl.position.set(0, 0, -1.8); brl.castShadow = true;
        
        // Glowing blue rings on barrel
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.08, 16, 32), MAT.pGlow);
        ring1.position.set(0, 0, -1.0);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.08, 16, 32), MAT.pGlow);
        ring2.position.set(0, 0, -3.2);
        
        // Dark metallic inner barrel for depth
        const innerBrl = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 4.05, 32), MAT.ramp);
        innerBrl.rotation.x = Math.PI/2; innerBrl.position.set(0, 0, -1.8);
        
        this.barrel.add(brl, ring1, ring2, innerBrl);
        this.barrel.position.set(0, 1.6, 0);
        this.mesh.add(this.barrel);
    }
    
    update(dt, input, boundsX) {
        if (input.dragging) this.targetX += input.dragDeltaX * 0.08;
        if (input.keys['ArrowLeft'] || input.keys['a'])  this.targetX -= 40 * dt;
        if (input.keys['ArrowRight'] || input.keys['d']) this.targetX += 40 * dt;
        
        this.targetX = Utils.clamp(this.targetX, -boundsX + 2, boundsX - 2);
        this.x += (this.targetX - this.x) * Math.min(1, 15 * dt);
        this.mesh.position.x = this.x;
        
        // Recoil recovery
        this.barrel.position.z += (0 - this.barrel.position.z) * 15 * dt;
        
        this.fireTimer -= dt;
        if (this.buffTimer > 0) {
            this.buffTimer -= dt;
            if (this.buffTimer <= 0) {
                this.buffType = null;
                document.getElementById('buffMsg').classList.add('hidden');
                this.fireInterval = Math.max(0.02, 0.12 - (this.shotCount > 0 ? 0.008 : 0));
            }
        }
    }
    
    tryFire(engine) {
        if (this.fireTimer > 0) return false;
        this.fireTimer = this.buffType === 'rapid' ? this.fireInterval / 2.5 : this.fireInterval;
        this.shotCount++;
        this.barrel.position.z = 1.0; // Stronger Recoil inwards
        if (window.Sound) Sound.shoot();
        if (engine) engine.shake(0.15); // Snappier shake
        return true;
    }
    
    applyBuff(type) {
        this.buffType = type;
        this.buffTimer = 6;
        const msg = document.getElementById('buffMsg');
        msg.textContent = type === 'rapid' ? '⚡ RAPID FIRE!' : '💥 SPREAD SHOT!';
        msg.classList.remove('hidden');
    }
}

/* =======================================
   GATE & BARRICADE & RAMP
   ======================================= */
class Gate {
    constructor(scene, id, x, z, w, type, val, moving = false) {
        this.id = id; this.baseX = x; this.x = x; this.z = z; this.width = w;
        this.type = type; this.val = val; this.moving = moving;
        this.time = Utils.rand(0, 10);
        this.speed = Utils.rand(1.5, 3.0);
        this.range = Math.min(12, (21 - w/2 - Math.abs(x)) * 0.8);
        this._build(scene);
    }
    
    _build(scene) {
        this.mesh = new THREE.Group();
        const paneMat = this.type === 'multiply' ? MAT.gateMul : (this.type === 'sub' ? MAT.gateSub : MAT.gateAdd);
        
        // Clean thick white border
        const hw = this.width / 2;
        const frameG = new THREE.CapsuleGeometry(0.3, this.width, 8, 16);
        const top = new THREE.Mesh(frameG, MAT.gateFrame); top.rotation.z = Math.PI/2; top.position.y = 8; top.castShadow = true;
        const bot = new THREE.Mesh(frameG, MAT.gateFrame); bot.rotation.z = Math.PI/2; bot.position.y = 0; bot.castShadow = true;
        
        const sideG = new THREE.CapsuleGeometry(0.3, 8, 8, 16);
        const lft = new THREE.Mesh(sideG, MAT.gateFrame); lft.position.set(-hw, 4, 0); lft.castShadow = true;
        const rgt = new THREE.Mesh(sideG, MAT.gateFrame); rgt.position.set(hw, 4, 0); rgt.castShadow = true;
        this.mesh.add(top, bot, lft, rgt);
        
        // Glass Pane
        const pane = new THREE.Mesh(new THREE.BoxGeometry(this.width, 8, 0.1), paneMat);
        pane.position.y = 4;
        this.mesh.add(pane);
        
        // Huge clean text
        const cv = document.createElement('canvas');
        cv.width = 256; cv.height = 128;
        const ctx = cv.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.font = '900 90px Poppins, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const txt = this.type === 'multiply' ? `×${this.val}` : (this.val > 0 ? `+${this.val}` : `${this.val}`);
        
        // Give text a subtle shadow for readability
        ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
        ctx.fillText(txt, 128, 64);
        
        const tex = new THREE.CanvasTexture(cv);
        const lbl = new THREE.Mesh(new THREE.PlaneGeometry(this.width * 0.8, this.width * 0.4), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
        lbl.position.set(0, 4, 0.06);
        this.mesh.add(lbl);
        
        this.mesh.position.set(this.x, 0, this.z);
        scene.add(this.mesh);
    }
    
    update(dt) {
        if (this.moving) {
            this.time += dt * this.speed;
            this.x = this.baseX + Math.sin(this.time) * this.range;
            this.mesh.position.x = this.x;
        }
        // Smooth scale recovery for juice
        this.mesh.scale.x += (1.0 - this.mesh.scale.x) * 15 * dt;
        this.mesh.scale.y = this.mesh.scale.x;
        this.mesh.scale.z = this.mesh.scale.x;
    }
    
    checkMob(mob) {
        if (mob.team !== 1) return 0;
        if (!mob.passedGates.has(this.id)) {
            const hitDist = (this.type === 'multiply') ? 0.8 : 0.6;
            if (mob.z < this.z + hitDist && mob.z > this.z - hitDist && Math.abs(mob.x - this.x) < this.width / 2) {
                mob.passedGates.add(this.id);
                if (this.type === 'multiply' || this.type === 'add') {
                    if (window.Sound) Sound.multiply();
                    this.mesh.scale.setScalar(1.3); // Juicy elastic bump
                } else {
                    if (window.Sound) Sound.hit();
                }
                return this.type === 'multiply' ? (this.val - 1) : (this.type === 'add' ? this.val : -this.val);
            }
        }
        return 0;
    }
}

class Barricade {
    constructor(scene, z, health) {
        this.z = z; this.maxHealth = health; this.health = health; this.destroyed = false;
        this.mesh = new THREE.Group();
        
        // Toy wooden blocks stacked like Jenga
        const blockGeo = new THREE.BoxGeometry(4, 2.5, 2.5);
        for(let r=0; r<3; r++) { // rows
            for(let c=-4; c<=4; c++) { // cols
                if ((r%2===0 && c%2!==0) || (r%2!==0 && c%2===0)) {
                    const b = new THREE.Mesh(blockGeo, MAT.barricade);
                    b.position.set(c*4.2, 1.25 + r*2.5, 0);
                    b.castShadow = true; b.receiveShadow = true;
                    this.mesh.add(b);
                }
            }
        }
        this.mesh.position.set(0, 0, z);
        scene.add(this.mesh);
    }
    
    takeDamage(dmg, particles) {
        if (this.destroyed) return;
        this.health -= dmg;
        this.mesh.position.z = this.z + Utils.rand(-0.2, 0.2); // shake
        if (this.health <= 0) {
            this.destroyed = true;
            particles.burst(0, this.z, 0xd97706, 40);
            this.mesh.visible = false;
        }
    }
}

class Ramp {
    constructor(scene, z) {
        this.z = z; this.mesh = new THREE.Group();
        
        // Smooth wedge
        const shape = new THREE.Shape();
        shape.moveTo(0, 0); shape.lineTo(0, 2); shape.lineTo(10, 0); shape.lineTo(0, 0);
        
        const wedgeGeo = new THREE.ExtrudeGeometry(shape, { depth: 44, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 });
        const wedge = new THREE.Mesh(wedgeGeo, MAT.ramp);
        wedge.rotation.y = -Math.PI/2; wedge.position.set(22, 0, 5);
        wedge.castShadow = true; wedge.receiveShadow = true;
        this.mesh.add(wedge);
        
        // White arrows
        for(let i=0; i<6; i++) {
            const arrowGeo = new THREE.PlaneGeometry(3, 3);
            const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, map: this._createArrowTex() });
            const arrow = new THREE.Mesh(arrowGeo, arrowMat);
            arrow.rotation.x = -Math.PI/2 - Math.atan(2/10); 
            arrow.position.set(-20 + i*8, 1.1, -0.5);
            this.mesh.add(arrow);
        }
        this.mesh.position.set(0, 0, z);
        scene.add(this.mesh);
    }
    
    _createArrowTex() {
        const cv = document.createElement('canvas'); cv.width=128; cv.height=128;
        const ctx = cv.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(64, 20); ctx.lineTo(108, 108); ctx.lineTo(64, 80); ctx.lineTo(20, 108); ctx.fill();
        return new THREE.CanvasTexture(cv);
    }
    
    checkMob(mob) {
        if (mob.team !== 1) return;
        if (Math.abs(mob.z - this.z) < 3.0 && mob.y < 0.5 && mob.vz < 0) {
            mob.vy = 22; // Satisfying high launch
            mob.y = 0.6; 
        }
    }
}

/* =======================================
   BASE
   ======================================= */
class EnemyBase {
    constructor(scene, z, level, isBoss) {
        this.z = z; this.isBoss = isBoss;
        this.maxHealth = isBoss ? 2000 + level * 500 : 300 + level * 100;
        this.health = this.maxHealth;
        this.spawnTimer = 0;
        this.spawnRate = isBoss ? 0.3 : Math.max(0.15, 1.0 - level * 0.05);
        this.time = 0; this.destroyed = false;
        
        this._build(scene);
    }
    
    _build(scene) {
        this.mesh = new THREE.Group();
        
        // Horizontal half-buried pipe
        const pipeGeo = new THREE.CylinderGeometry(this.isBoss ? 16 : 10, this.isBoss ? 16 : 10, this.isBoss ? 40 : 25, 32);
        const bMesh = new THREE.Mesh(pipeGeo, this.isBoss ? MAT.baseDark : MAT.baseRed);
        bMesh.rotation.z = Math.PI / 2;
        bMesh.position.y = 0;
        bMesh.castShadow = true;
        this.mesh.add(bMesh);
        
        // Black hole portal
        const holeGeo = new THREE.CircleGeometry(this.isBoss ? 15 : 9, 32);
        const hole = new THREE.Mesh(holeGeo, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        hole.position.set(0, 0, this.isBoss ? 10 : 8.1); // Slightly in front to avoid z-fighting
        this.mesh.add(hole);
        
        this.mesh.position.set(0, 0, this.z);
        scene.add(this.mesh);
    }
    
    update(dt) {
        if (this.destroyed) return;
        this.time += dt;
        this.spawnTimer -= dt;
        
        let targetX = 0;
        if (this.isBoss) {
            targetX = Math.sin(this.time * 0.5) * 10;
        }
        
        // Elastic shake recovery
        this.mesh.position.x += (targetX - this.mesh.position.x) * 15 * dt;
        this.mesh.position.z += (this.z - this.mesh.position.z) * 15 * dt;
        
        if (this.health < this.maxHealth * 0.3) {
            this.mesh.position.x += Utils.rand(-0.2, 0.2);
            this.mesh.position.z += Utils.rand(-0.2, 0.2);
        }
    }
    
    canSpawn() {
        if (this.destroyed) return false;
        if (this.spawnTimer <= 0) {
            this.spawnTimer = this.spawnRate;
            return true;
        }
        return false;
    }
    
    shake() {
        if (this.destroyed) return;
        this.mesh.position.x += Utils.rand(-2.0, 2.0);
        this.mesh.position.z += Utils.rand(-2.0, 2.0);
    }
    
    explode(scene, particles) {
        this.destroyed = true;
        particles.burst(0, this.z, 0xef4444, 20, true);
        scene.remove(this.mesh);
    }
}

class PowerUp {
    constructor(scene, x, z, type) {
        this.x = x; this.z = z; this.type = type;
        this.time = Utils.rand(0, 10);
        // Toy star / crystal
        this.mesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.5, 0), MAT.powerUp);
        this.mesh.position.set(x, 2.0, z);
        this.mesh.castShadow = true;
        scene.add(this.mesh);
    }
    update(dt) {
        this.time += dt;
        this.mesh.rotation.y = this.time * 3;
        this.mesh.position.y = 2.0 + Math.sin(this.time * 5) * 0.5;
    }
    remove(scene) { scene.remove(this.mesh); }
}

class Crusher {
    constructor(scene, z) {
        this.z = z; this.x = 0;
        this.time = Utils.rand(0, 10);
        this.speed = Utils.rand(2, 4);
        
        this.mesh = new THREE.Group();
        const roller = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 10, 16), MAT.crusher);
        roller.rotation.z = Math.PI/2; roller.castShadow = true;
        this.mesh.add(roller);
        
        // Simple white spikes
        const spikeGeo = new THREE.CylinderGeometry(0, 0.4, 2, 8);
        for(let i=0; i<10; i++) {
            const a = (i/10)*Math.PI*2;
            [-4, -2, 0, 2, 4].forEach(ox => {
                const sp = new THREE.Mesh(spikeGeo, MAT.spike);
                sp.position.set(ox, Math.cos(a)*2.0, Math.sin(a)*2.0);
                sp.rotation.z = Math.PI/2; sp.rotation.x = a;
                this.mesh.add(sp);
            });
        }
        
        this.mesh.position.set(0, 2.0, z);
        scene.add(this.mesh);
    }
    update(dt) {
        this.time += dt;
        this.x = Math.sin(this.time * this.speed) * 15;
        this.mesh.position.x = this.x;
        this.mesh.rotation.x -= dt * 15; // Fast spin
    }
}

/* =======================================
   SYSTEMS
   ======================================= */
class Particles {
    constructor(scene) {
        this.scene = scene;
        this.parts = [];
        this.geo = new THREE.BoxGeometry(0.8, 0.8, 0.8); // Satisfying blocky particles
    }
    burst(x, z, color, count=6, massive=false) {
        const m = new THREE.MeshStandardMaterial({ color, roughness: 0.1, metalness: 0.1 });
        for(let i=0; i<count; i++) {
            const p = new THREE.Mesh(this.geo, m);
            p.position.set(x + Utils.rand(-1,1), massive ? Utils.rand(1,5) : 0.5, z + Utils.rand(-1,1));
            this.scene.add(p);
            this.parts.push({ 
                m: p, 
                vx: Utils.rand(-5,5), vy: Utils.rand(5,15), vz: Utils.rand(-5,5), 
                rx: Utils.rand(-2,2), ry: Utils.rand(-2,2),
                life: massive ? 1.5 : 0.5 
            });
        }
    }
    update(dt) {
        for(let i = this.parts.length - 1; i >= 0; i--) {
            const p = this.parts[i];
            p.m.position.x += p.vx * dt; p.m.position.y += p.vy * dt; p.m.position.z += p.vz * dt;
            p.m.rotation.x += p.rx * dt; p.m.rotation.y += p.ry * dt;
            p.vy -= 50 * dt; 
            p.life -= dt;
            if (p.life <= 0) { this.scene.remove(p.m); this.parts.splice(i, 1); }
            else p.m.scale.setScalar(p.life / 0.5);
        }
    }
}

class SpatialGrid {
    constructor(width, height, cellSize) {
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.cells = new Map();
    }
    _hash(x, z) {
        let cx = Math.floor((x + 40) / this.cellSize);
        let cz = Math.floor((z + 180) / this.cellSize);
        cx = Utils.clamp(cx, 0, this.cols - 1);
        cz = Utils.clamp(cz, 0, this.rows - 1);
        return cx + cz * this.cols;
    }
    insert(mob) {
        const key = this._hash(mob.x, mob.z);
        if (!this.cells.has(key)) this.cells.set(key, []);
        this.cells.get(key).push(mob);
    }
    clear() { this.cells.clear(); }
    getNearby(mob) {
        const cx = Math.floor((mob.x + 40) / this.cellSize);
        const cz = Math.floor((mob.z + 180) / this.cellSize);
        const nearby = [];
        for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
                const key = (cx + x) + (cz + z) * this.cols;
                if (this.cells.has(key)) nearby.push(...this.cells.get(key));
            }
        }
        return nearby;
    }
}

class FloatingText {
    constructor(text, x, z, color) {
        this.el = document.createElement('div');
        this.el.className = 'float-text';
        this.el.textContent = text;
        this.el.style.color = color;
        document.getElementById('gameContainer').appendChild(this.el);
        this.x = x; this.y = 3; this.z = z;
        this.life = 1.0;
    }
    update(dt, camera) {
        if (this.life !== Infinity) {
            this.life -= dt;
            this.y += dt * 5;
        }
        if (this.life <= 0) {
            this.el.remove();
            return false;
        }
        const pos = new THREE.Vector3(this.x, this.y, this.z);
        pos.project(camera);
        const x = (pos.x * .5 + .5) * window.innerWidth;
        const y = (pos.y * -.5 + .5) * window.innerHeight;
        this.el.style.left = `${x}px`;
        this.el.style.top = `${y}px`;
        if (this.life !== Infinity) {
            this.el.style.opacity = this.life;
            this.el.style.transform = `translate(-50%, -50%) scale(${1 + (1-this.life)})`;
        }
        return true;
    }
}

/* =======================================
   LEVEL MANAGER
   ======================================= */
class LevelManager {
    constructor(scene, engine, level, upgrades, globalMultiplier = 1) {
        initMaterials();
        this.scene = scene; this.engine = engine; this.camera = engine.camera; this.level = level;
        this.upgrades = upgrades; this.globalMultiplier = globalMultiplier;
        
        this.mobs = []; this.gates = []; this.barricades = []; this.ramps = [];
        this.powerUps = []; this.crushers = []; this.particles = new Particles(scene);
        this.grid = new SpatialGrid(80, 200, 2.5);
        this.texts = [];
        
        this.boundsX = 21; this.victory = false; this.gameOver = false; this.earnedCoins = 0;
        this.isBoss = level % 5 === 0;
        
        this.cannon = new Cannon(scene, upgrades);
        this.base = new EnemyBase(scene, this.isBoss ? -130 : -80 - level * 5, level, this.isBoss);
        
        document.getElementById('baseHpFill').style.width = '100%';
        this._build();
    }
    
    _build() {
        const length = Math.abs(this.base.z) - 30;
        
        if (this.level > 1 && !this.isBoss) {
            if (Math.random() < 0.7) this.barricades.push(new Barricade(this.scene, -40, 50 + this.level * 10));
        }
        
        const numC = Utils.randI(0, Math.min(3, Math.floor(this.level/2)));
        for(let i=0; i<numC; i++) this.crushers.push(new Crusher(this.scene, -50 - i * 15));
        
        if (this.level > 2) {
            if (Math.random() < 0.6) this.ramps.push(new Ramp(this.scene, -20));
            if (this.isBoss) this.ramps.push(new Ramp(this.scene, -80));
        }
        
        const numGates = this.isBoss ? 5 : Utils.randI(2, Math.min(6, 2 + Math.floor(this.level/3)));
        const zStep = length / (numGates + 1);
        
        for (let i = 0; i < numGates; i++) {
            const z = -25 - (i+1) * zStep;
            if (this.barricades.some(b => Math.abs(b.z - z) < 10)) continue;
            if (this.ramps.some(r => Math.abs(r.z - z) < 8)) continue;
            if (this.crushers.some(c => Math.abs(c.z - z) < 8)) continue;
            
            const w = Utils.rand(12, 18);
            const isMoving = this.level > 2 && Math.random() < 0.4;
            const isNeg = Math.random() < 0.2; 
            const type = isNeg ? 'sub' : (Math.random() < 0.5 ? 'multiply' : 'add');
            const val = type === 'multiply' ? Utils.randI(2,4) : (isNeg ? -Utils.randI(5,15) : Utils.randI(10,30));
            
            if (!isMoving && Math.random() < 0.35) {
                this.gates.push(new Gate(this.scene, i+'a', -9.5, z, 9, type, val, false));
                this.gates.push(new Gate(this.scene, i+'b',  9.5, z, 9, 'sub', -Utils.randI(10,25), false));
            } else {
                this.gates.push(new Gate(this.scene, i, Utils.rand(-8,8), z, w, type, val, isMoving));
            }
        }
        
        if (Math.random() < 0.6) {
            this.powerUps.push(new PowerUp(this.scene, Utils.rand(-15, 15), Utils.rand(-30, this.base.z + 20), Math.random() < 0.5 ? 'rapid' : 'spread'));
        }
        
        this.dangerLine = new THREE.Mesh(
            new THREE.PlaneGeometry(60, 1.2),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6, map: this._createDangerTex() })
        );
        this.dangerLine.rotation.x = -Math.PI / 2;
        this.dangerLine.position.set(0, 0.05, 5);
        this.scene.add(this.dangerLine);
    }
    
    _createDangerTex() {
        const cv = document.createElement('canvas'); cv.width=512; cv.height=64;
        const ctx = cv.getContext('2d');
        ctx.fillStyle = '#ff0000'; ctx.fillRect(0,0,512,64);
        ctx.fillStyle = '#000000';
        for(let i=0; i<20; i++) {
            ctx.beginPath(); ctx.moveTo(i*30, 0); ctx.lineTo(i*30+15, 0); ctx.lineTo(i*30+30, 64); ctx.lineTo(i*30+15, 64); ctx.fill();
        }
        const tex = new THREE.CanvasTexture(cv);
        tex.wrapS = THREE.RepeatWrapping; tex.repeat.set(4, 1);
        return tex;
    }
    
    spawnChampion() { this.mobs.push(new Mob(this.scene, this.cannon.x, this.cannon.z - 4, 1, true)); }
    
    update(dt, input) {
        if (this.victory || this.gameOver) return;
        
        this.cannon.update(dt, input, this.boundsX);
        if (this.cannon.tryFire(this.engine)) {
            const g = this.cannon.shotCount % 15 === 0;
            if (this.cannon.buffType === 'spread') {
                [-2.5, 0, 2.5].forEach(ox => this.mobs.push(new Mob(this.scene, this.cannon.x + ox, this.cannon.z - 3, 1, g)));
            } else {
                this.mobs.push(new Mob(this.scene, this.cannon.x, this.cannon.z - 3, 1, g));
            }
        }
        
        this.base.update(dt);
        if (this.base.canSpawn()) {
            const bx = this.base.mesh.position.x;
            const amt = this.isBoss ? 5 : Math.min(10, 3 + Math.floor(this.level/2));
            for(let i=0; i<amt; i++) this.mobs.push(new Mob(this.scene, bx + Utils.rand(-12,12), this.base.z + 5, -1, this.isBoss && Math.random()<0.3));
        }
        
        this.gates.forEach(g => g.update(dt));
        this.powerUps.forEach(p => p.update(dt));
        this.crushers.forEach(c => c.update(dt));
        this.particles.update(dt);
        
        for (let i = this.texts.length - 1; i >= 0; i--) {
            if (!this.texts[i].update(dt, this.camera)) this.texts.splice(i, 1);
        }
        
        if (this.dangerLine) {
            this.dangerLine.material.opacity = 0.4 + Math.sin(performance.now()*0.01)*0.3;
            this.dangerLine.material.map.offset.x -= dt * 2;
        }
        
        let pCount = 0;
        this.grid.clear();
        
        for (let i = this.mobs.length - 1; i >= 0; i--) {
            const m = this.mobs[i];
            m.update(dt, this.boundsX);
            if (m.team === 1) pCount++;
            if (m.z > 8 || m.z < this.base.z - 10) { m.dead = true; continue; }
            if (!m.dead) this.grid.insert(m);
            
            this.ramps.forEach(r => r.checkMob(m));
            
            if (m.team === 1 && !m.dead) {
                for (const g of this.gates) {
                    const c = g.checkMob(m);
                    if (c > 0) {
                        if (Math.random() < 0.1) this.texts.push(new FloatingText(g.type==='multiply'?`x${g.val}`:`+${g.val}`, m.x, m.z, "#4ade80"));
                        for(let k=0; k<c; k++) {
                            if (this.mobs.length > 400) break; // strict mobile cap
                            const nm = new Mob(this.scene, m.x + Utils.rand(-1,1), m.z + Utils.rand(0,1), 1, false);
                            nm.passedGates = new Set(m.passedGates);
                            this.mobs.push(nm);
                        }
                    } else if (c < 0) {
                        const kill = Math.min(Math.abs(c), pCount - 1);
                        let killed = 0;
                        for (let k = 0; k < this.mobs.length && killed < kill; k++) {
                            if (this.mobs[k].team === 1 && !this.mobs[k].dead) {
                                this.mobs[k].dead = true;
                                this.particles.burst(this.mobs[k].x, this.mobs[k].z, 0x2c9fc7, 4); // Curious Blue
                                killed++;
                            }
                        }
                    }
                }
                
                for (let k = this.powerUps.length - 1; k >= 0; k--) {
                    const pu = this.powerUps[k];
                    if (Math.hypot(m.x - pu.x, m.z - pu.z) < 3.0) {
                        this.cannon.applyBuff(pu.type);
                        this.particles.burst(pu.x, pu.z, 0xfde047, 20);
                        pu.remove(this.scene);
                        this.powerUps.splice(k, 1);
                    }
                }
                
                if (m.z < this.base.z + 8 && m.y < 2.0) {
                    const bx = this.base.mesh.position.x;
                    if (Math.abs(m.x - bx) < (this.isBoss ? 16 : 14)) {
                        m.dead = true;
                        const dmg = (m.isGiant ? 5 : 1) * (this.upgrades.health || 1);
                        this.base.health -= dmg;
                        this.base.shake();
                        this.engine.shake(0.3);
                        this.earnedCoins += dmg * this.globalMultiplier;
                        
                        this.texts.push(new FloatingText(`🟡 +${Math.floor(dmg * this.globalMultiplier)}`, m.x + Utils.rand(-1,1), m.z, "#fbb728"));
                        
                        if (window.onDealDamage) window.onDealDamage(dmg);
                        this.particles.burst(m.x, m.z, 0x2c9fc7, 8);
                        
                        document.getElementById('baseHpFill').style.width = Math.max(0, (this.base.health / this.base.maxHealth) * 100) + '%';
                        
                        if (this.base.health <= 0 && !this.base.destroyed) {
                            this.victory = true;
                            this.base.explode(this.scene, this.particles);
                            for(let c=0; c<15; c++) setTimeout(() => this.particles.burst(Utils.rand(-10,10), this.base.z+Utils.rand(-5,5), 0xe60023, 20), c*100);
                        }
                    }
                }
                
                for (const b of this.barricades) {
                    if (!b.destroyed && m.y < 1.0) {
                        if (Math.abs(m.z - b.z) < 3.0 && Math.abs(m.x - b.mesh.position.x) < 14) {
                            m.dead = true;
                            b.takeDamage(m.isGiant ? 5 : 1, this.particles);
                        }
                    }
                }
                
            } else if (m.team === -1 && !m.dead) {
                if (m.z > 5) { 
                    m.dead = true; this.gameOver = true; 
                    document.getElementById('gameContainer').style.boxShadow = 'inset 0 0 150px red';
                    setTimeout(() => document.getElementById('gameContainer').style.boxShadow = 'none', 1000);
                }
                for (const b of this.barricades) {
                    if (!b.destroyed && Math.abs(m.z - b.z) < 3.0 && Math.abs(m.x - b.mesh.position.x) < 14) {
                        m.dead = true;
                        b.takeDamage(10, this.particles);
                    }
                }
            }
            
            for (const c of this.crushers) {
                if (!m.dead && Math.abs(m.x - c.x) < 5.0 && Math.abs(m.z - c.z) < 2.5 && m.y < 1.0) {
                    m.dead = true;
                    this.particles.burst(m.x, m.z, m.team === 1 ? 0x2c9fc7 : 0xe60023, 8);
                }
            }
        }
        
        for (let i = 0; i < this.mobs.length; i++) {
            const m1 = this.mobs[i];
            if (m1.dead) continue;
            
            const nearby = this.grid.getNearby(m1);
            for (let j = 0; j < nearby.length; j++) {
                const m2 = nearby[j];
                if (m2.dead || m1 === m2) continue;
                if (Math.abs(m1.y - m2.y) > 1.5) continue;
                
                const dx = m1.x - m2.x, dz = m1.z - m2.z;
                const distSq = dx*dx + dz*dz;
                const min = m1.radius + m2.radius;
                
                if (distSq > 0.001 && distSq < min*min) {
                    const a = Math.atan2(dz, dx);
                    const weight1 = m1.isGiant ? 3 : 1;
                    const weight2 = m2.isGiant ? 3 : 1;
                    if (m1.team !== m2.team) {
                        m1.health -= 15 * dt; m2.health -= 15 * dt;
                        m1.pushX += Math.cos(a)*15 * (weight2/weight1); 
                        m2.pushX -= Math.cos(a)*15 * (weight1/weight2);
                        m1.pushZ += Math.sin(a)*10 * (weight2/weight1); 
                        m2.pushZ -= Math.sin(a)*10 * (weight1/weight2);
                        
                        if (m1.health <= 0) { m1.dead = true; this.particles.burst(m1.x, m1.z, 0x2c9fc7, 5); }
                        if (m2.health <= 0) { m2.dead = true; this.earnedCoins += this.globalMultiplier; this.particles.burst(m2.x, m2.z, 0xe60023, 5); }
                    } else {
                        const overlap = min - Math.sqrt(distSq);
                        const force = overlap * 6;
                        m1.pushX += Math.cos(a) * force * (weight2/weight1);
                        m2.pushX -= Math.cos(a) * force * (weight1/weight2);
                        m1.pushZ += Math.sin(a) * force * (weight2/weight1);
                        m2.pushZ -= Math.sin(a) * force * (weight1/weight2);
                    }
                }
            }
        }
        
        for (let i = this.mobs.length - 1; i >= 0; i--) {
            if (this.mobs[i].dead) {
                this.scene.remove(this.mobs[i].mesh);
                this.mobs.splice(i, 1);
            }
        }
        
        this.playerMobCount = pCount;
        document.getElementById('mobCount').textContent = pMobsCount(this.mobs);
    }
    
    destroy() {
        this.mobs.forEach(m => this.scene.remove(m.mesh));
        this.gates.forEach(g => this.scene.remove(g.mesh));
        this.barricades.forEach(b => this.scene.remove(b.mesh));
        this.ramps.forEach(r => this.scene.remove(r.mesh));
        this.powerUps.forEach(p => p.remove(this.scene));
        this.crushers.forEach(c => this.scene.remove(c.mesh));
        this.particles.parts.forEach(p => this.scene.remove(p.m));
        if (this.dangerLine) this.scene.remove(this.dangerLine);
        this.scene.remove(this.cannon.mesh);
        this.scene.remove(this.base.mesh);
    }
}

function pMobsCount(mobs) {
    let c = 0;
    for(let i=0; i<mobs.length; i++) if(mobs[i].team===1 && !mobs[i].dead) c++;
    return c;
}

window.LevelManager = LevelManager;
