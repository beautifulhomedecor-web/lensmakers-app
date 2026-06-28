/* =======================================
   Crowd Clash 3D — Engine, Input, Utils
   ======================================= */

class Engine3D {
    constructor(container) {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.Fog(0x000000, 30, 100);

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 150);
        this.camera.position.set(0, 16, 20);
        this.camera.lookAt(0, 0, -30);
        this.cameraBasePos = new THREE.Vector3(0, 16, 20);
        this.shakeAmount = 0;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25)); // Cap pixel ratio for mobile
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0; // Reduced to keep colors solid and not washed out
        container.appendChild(this.renderer.domElement);

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.65);
        this.scene.add(ambient);

        this.sun = new THREE.DirectionalLight(0xfff4e0, 1.0);
        this.sun.position.set(20, 50, 20);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.set(512, 512); // Optimized for mobile
        this.sun.shadow.camera.left   = -60;
        this.sun.shadow.camera.right  =  60;
        this.sun.shadow.camera.top    =  60;
        this.sun.shadow.camera.bottom = -120;
        this.scene.add(this.sun);

        const hemi = new THREE.HemisphereLight(0x87ceeb, 0x3a7a3a, 0.4);
        this.scene.add(hemi);

        this._buildTrack();
        window.addEventListener('resize', () => this._resize());
    }

    _buildTrack() {
        // Road surface
        this.matRoad = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
        const road = new THREE.Mesh(new THREE.BoxGeometry(44, 1.2, 300), this.matRoad);
        road.position.set(0, -0.6, -80);
        road.receiveShadow = true;
        this.scene.add(road);

        // Dashed centre line and Grid
        const dashMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
        for (let i = 0; i < 25; i++) {
            const dash = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 4), dashMat);
            dash.position.set(0, 0.02, -8 - i * 12);
            this.scene.add(dash);
        }
        
        // Tech Grid overlay
        const grid = new THREE.GridHelper(100, 50, 0x1e293b, 0x0f172a);
        grid.position.set(0, -0.58, -50);
        grid.material.opacity = 0.6;
        grid.material.transparent = true;
        this.scene.add(grid);

        // Guard rails
        this.matRail = new THREE.MeshStandardMaterial({ color: 0xb0c4d8, roughness: 0.4, metalness: 0.3 });
        const railGeo = new THREE.BoxGeometry(1.1, 2, 300);
        const railL = new THREE.Mesh(railGeo, this.matRail);
        railL.position.set(-22.5, 0.4, -80);
        railL.castShadow = true; railL.receiveShadow = true;
        this.scene.add(railL);
        const railR = new THREE.Mesh(railGeo, this.matRail);
        railR.position.set(22.5, 0.4, -80);
        railR.castShadow = true; railR.receiveShadow = true;
        this.scene.add(railR);

        // Grass strips on both sides
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 1 });
        const grassGeo = new THREE.PlaneGeometry(200, 300);
        const grassL = new THREE.Mesh(grassGeo, grassMat);
        grassL.rotation.x = -Math.PI / 2;
        grassL.position.set(-122, -0.01, -80);
        grassL.receiveShadow = true;
        this.scene.add(grassL);
        const grassR = new THREE.Mesh(grassGeo, grassMat);
        grassR.rotation.x = -Math.PI / 2;
        grassR.position.set(122, -0.01, -80);
        grassR.receiveShadow = true;
        this.scene.add(grassR);
    }

    buildTrack(levelIndex) {
        const t = Math.floor((levelIndex - 1) / 5) % 4;
        const themes = [
            { sky: 0x7dd3fc, fog: 0xbae6fd, road: 0xe2e8f0, rail: 0xb0c4d8, grass: 0x4ade80 }, // Sky
            { sky: 0x1a0800, fog: 0x3a1000, road: 0x292524, rail: 0x7c2d12, grass: 0x451a03 }, // Lava
            { sky: 0xdbeafe, fog: 0xe0f2fe, road: 0xf1f5f9, rail: 0xbae6fd, grass: 0xffffff }, // Snow
            { sky: 0x0f172a, fog: 0x1e1b4b, road: 0x1e293b, rail: 0x334155, grass: 0x0f2711 }, // Night
        ];
        const th = themes[t];
        this.scene.background.set(th.sky);
        this.scene.fog.color.set(th.fog);
        this.matRoad.color.set(th.road);
        this.matRail.color.set(th.rail);
    }

    _resize() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera.aspect = aspect;
        
        // Portrait mode optimizations
        if (aspect < 1.0) {
            this.camera.fov = 75; // Wider FOV for vertical screens
        } else {
            this.camera.fov = 55;
        }
        
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    update(cannonZ, dt = 0.016) {
        // Smooth camera follow via lerp
        const targetZ = cannonZ + 20;
        this.cameraBasePos.z += (targetZ - this.cameraBasePos.z) * Math.min(1, 10 * dt);
        
        // Apply Screen Shake
        this.camera.position.copy(this.cameraBasePos);
        if (this.shakeAmount > 0.01) {
            this.camera.position.x += (Math.random() - 0.5) * this.shakeAmount;
            this.camera.position.y += (Math.random() - 0.5) * this.shakeAmount;
            this.camera.position.z += (Math.random() - 0.5) * this.shakeAmount;
            this.shakeAmount *= 0.85;
        }
        
        this.sun.position.z = this.cameraBasePos.z;
    }
    
    shake(amount = 0.5) {
        this.shakeAmount = Math.max(this.shakeAmount || 0, amount);
        if (window.VibEnabled !== false && navigator.vibrate) {
            navigator.vibrate(amount > 0.2 ? 50 : 20);
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

/* =======================================
   InputManager
   ======================================= */
class InputManager {
    constructor() {
        this.dragging     = false;
        this.normalizedX  = 0;   // -1 to +1 screen position
        this.dragDeltaX   = 0;   // pixels moved since last frame
        this._lastX       = 0;
        this.justTapped   = false;
        this.keys         = {};
        this._setup();
    }

    _setup() {
        const px = e => e.touches ? e.touches[0].clientX : e.clientX;

        const onDown = e => {
            if (e.target.tagName === 'BUTTON') return;
            this.dragging    = true;
            this.justTapped  = true;
            this._lastX      = px(e);
            this.dragDeltaX  = 0;
            this.normalizedX = (this._lastX / window.innerWidth) * 2 - 1;
        };
        const onMove = e => {
            if (!this.dragging) return;
            const x = px(e);
            this.dragDeltaX  = x - this._lastX;
            this._lastX      = x;
            this.normalizedX = (x / window.innerWidth) * 2 - 1;
        };
        const onUp = () => { this.dragging = false; this.dragDeltaX = 0; };

        window.addEventListener('mousedown',  onDown, { passive: true });
        window.addEventListener('mousemove',  onMove, { passive: true });
        window.addEventListener('mouseup',    onUp);
        window.addEventListener('touchstart', onDown, { passive: true });
        window.addEventListener('touchmove',  onMove, { passive: true });
        window.addEventListener('touchend',   onUp);
        window.addEventListener('touchcancel',onUp);

        window.addEventListener('keydown', e => {
            this.keys[e.key] = true;
            if (e.key === ' ' || e.key === 'Enter') this.justTapped = true;
        });
        window.addEventListener('keyup', e => { this.keys[e.key] = false; });
    }

    endFrame() {
        this.justTapped = false;
        this.dragDeltaX = 0;
    }
}

/* =======================================
   Utils
   ======================================= */
const Utils = {
    clamp : (v, lo, hi) => Math.max(lo, Math.min(hi, v)),
    lerp  : (a, b, t)   => a + (b - a) * t,
    rand  : (lo, hi)    => lo + Math.random() * (hi - lo),
    randI : (lo, hi)    => Math.floor(lo + Math.random() * (hi - lo + 1)),
};

window.Engine3D    = Engine3D;
window.InputManager = InputManager;
window.Utils       = Utils;
