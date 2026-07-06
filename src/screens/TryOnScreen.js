// AR Virtual Try-On Screen Component — Prompt 5 of 10
// Best-in-class real-time face tracking, Apple visionOS physics, exact sizes, frame switching & snapshot capture
const { useState, useEffect, useRef } = React;

// THE 4 SELECTABLE EYEWEAR FRAMES (Exact specifications from Prompt 5)
const FRAMES = [
  {
    id: 'aviator',
    name: 'Aviator Gold',
    price: '₹4,499',
    frameColor: '#2B303A',
    lensFill: 'rgba(50, 60, 70, 0.32)',
    hingeAccent: null,
    shape: 'hex-aviator',
    thumbnail: '🛩️'
  },
  {
    id: 'classic-black',
    name: 'Classic Black',
    price: '₹3,899',
    frameColor: '#0F172A',
    lensFill: 'rgba(10, 15, 40, 0.18)',
    hingeAccent: '#D4AF37', // Gold ribbed hinge accents
    shape: 'modern-rect',
    thumbnail: '👓'
  },
  {
    id: 'sunglasses-dark',
    name: 'Noir Shield',
    price: '₹5,199',
    frameColor: '#0A0A0A',
    lensFill: 'rgba(5, 5, 15, 0.78)', // High-density dark tint
    hingeAccent: null,
    shape: 'shield',
    thumbnail: '🕶️'
  },
  {
    id: 'tortoise',
    name: 'Elegant Cat-Eye',
    price: '₹3,499',
    frameColor: '#5C3317',
    lensFill: 'rgba(60, 30, 10, 0.2)',
    hingeAccent: null,
    shape: 'cat-eye',
    thumbnail: '◥'
  }
];

// Linear interpolation for Exponential Moving Average (EMA) smoothing
function lerp(a, b, t) {
  return a + (b - a) * t;
}

const TryOnScreen = ({ onSelectTab }) => {
  // UI & Flow State
  const [status, setStatus] = useState('loading'); // 'loading' | 'active' | 'snapshot' | 'fallback'
  const [mode, setMode] = useState('camera'); // 'camera' | 'demo' | 'photo'
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(1); // Default Classic Black (#1)
  const [faceDetected, setFaceDetected] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [wishlist, setWishlist] = useState(['classic-black']);
  const [toastMessage, setToastMessage] = useState(null);
  const [lensCoating, setLensCoating] = useState('antireflective'); // 'antireflective' | 'bluelight' | 'polarized' | 'photochromic' | 'none'
  const [orbitAngle, setOrbitAngle] = useState(0); // 0 to 360 degrees for 360° 3D preview
  const [orbitPitch, setOrbitPitch] = useState(10); // -30 to +30 degrees vertical tilt
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [isFrameErased, setIsFrameErased] = useState(false);

  // Refs that mirror state for use in rAF/MediaPipe callbacks (avoids stale closure)
  const selectedFrameIdxRef = useRef(1);
  const faceDetectedRef = useRef(false);
  const statusRef = useRef('loading');
  const toastTimeoutRef = useRef(null);
  const lensCoatingRef = useRef('antireflective');
  const modeRef = useRef('camera');
  const uploadedPhotoRef = useRef(null);
  const orbitAngleRef = useRef(0);
  const orbitPitchRef = useRef(10);
  const isAutoSpinningRef = useRef(true);
  const isDragging360Ref = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const isFrameErasedRef = useRef(false);

  // Keep refs in sync whenever state changes
  useEffect(() => { selectedFrameIdxRef.current = selectedFrameIdx; }, [selectedFrameIdx]);
  useEffect(() => { faceDetectedRef.current = faceDetected; }, [faceDetected]);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { lensCoatingRef.current = lensCoating; }, [lensCoating]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { uploadedPhotoRef.current = uploadedPhoto; }, [uploadedPhoto]);
  useEffect(() => { orbitAngleRef.current = orbitAngle; }, [orbitAngle]);
  useEffect(() => { orbitPitchRef.current = orbitPitch; }, [orbitPitch]);
  useEffect(() => { isAutoSpinningRef.current = isAutoSpinning; }, [isAutoSpinning]);
  useEffect(() => { isFrameErasedRef.current = isFrameErased; }, [isFrameErased]);

  // References
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const cameraInstanceRef = useRef(null);
  const faceMeshRef = useRef(null);
  const lastFaceTimeRef = useRef(Date.now());
  const fileInputRef = useRef(null);

  // Smoothed tracking data (EMA alpha = 0.35)
  const smoothRef = useRef({
    frameCenterX: 640,
    frameCenterY: 360,
    frameWidth: 320,
    lensHeight: 104,
    bridgeWidth: 60,
    yawAngle: 0,
    pitchAngle: 0
  });

  const currentFrameStyle = FRAMES[selectedFrameIdx];

  const showToast = (msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3500);
  };

  // Fix: only run after status/mode/selectedFrameIdx/faceDetected changes, toast separately handled
  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) {
      setTimeout(() => window.lucide.createIcons(), 50);
    }
  }, [status, mode, selectedFrameIdx, faceDetected]);

  // ==========================================================================
  // HIGH-ACCURACY BIOMETRIC MESH & REALISTIC 3D GLASSES RENDERING ENGINE
  // ==========================================================================
  const drawGlassesFrame = (ctx, s, style) => {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Translate to frame center and apply yaw rotation for 3D glasses
    ctx.translate(s.frameCenterX, s.frameCenterY);
    ctx.rotate(s.yawAngle);

    const lw = (s.frameWidth - s.bridgeWidth) / 2; // Lens width
    const lh = s.lensHeight; // Lens height
    const bw = s.bridgeWidth; // Bridge width
    const bh = lh * 0.15; // Bridge height
    const r = lh * 0.22; // Corner radius
    const tw = s.frameWidth * 0.38; // Temple arm length
    const strokeW = Math.max(3.5, lw * 0.048); // Frame thickness
    const cornerAccentSize = strokeW * 2.5;

    const lx = -s.frameWidth / 2;
    const ly = -lh / 2;
    const rx = s.bridgeWidth / 2;

    // Helper for custom frame shape profiles (Aviator Hex, Modern Rect, Shield, Cat-Eye)
    const drawLensPath = (x, y, width, height, radius, isLeft) => {
      ctx.beginPath();
      const shape = style.shape || 'modern-rect';
      if (shape === 'hex-aviator') {
        // Hexagonal / Geometric Aviator like Screenshot 1
        const ch = width * 0.22;
        ctx.moveTo(x + ch, y);
        ctx.lineTo(x + width - ch, y);
        ctx.lineTo(x + width, y + height * 0.38);
        ctx.lineTo(x + width - ch * 0.65, y + height);
        ctx.lineTo(x + ch * 0.65, y + height);
        ctx.lineTo(x, y + height * 0.38);
        ctx.closePath();
      } else if (shape === 'cat-eye') {
        // Elegant Cat-Eye with flared outer top corners
        if (isLeft) {
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius * 0.5, y - height * 0.14);
          ctx.arcTo(x + width, y - height * 0.14, x + width, y + radius, radius * 0.7);
          ctx.lineTo(x + width, y + height - radius);
          ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
          ctx.lineTo(x + radius, y + height);
          ctx.arcTo(x, y + height, x, y + height - radius, radius);
          ctx.lineTo(x, y + radius);
          ctx.arcTo(x, y, x + radius, y, radius);
        } else {
          ctx.moveTo(x + radius * 0.5, y - height * 0.14);
          ctx.lineTo(x + width - radius, y);
          ctx.arcTo(x + width, y, x + width, y + radius, radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
          ctx.lineTo(x + radius, y + height);
          ctx.arcTo(x, y + height, x, y + height - radius, radius);
          ctx.lineTo(x, y + radius);
          ctx.arcTo(x, y - height * 0.14, x + radius * 0.5, y - height * 0.14, radius * 0.7);
        }
      } else if (shape === 'shield') {
        // Shield / Sport contour
        ctx.roundRect(x, y, width, height, [radius * 0.4, radius * 1.5, radius * 1.2, radius * 0.4]);
      } else {
        // Modern Rounded Rectangular (like Screenshot 2)
        ctx.roundRect(x, y, width, height, radius);
      }
    };

    // ------------------------------------------------------------------------
    // LAYER 2: REALISTIC AMBIENT OCCLUSION SHADOW CAST ONTO CHEEKBONES
    // ------------------------------------------------------------------------
    ctx.save();
    ctx.translate(0, lh * 0.14);
    ctx.filter = 'blur(12px)';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    drawLensPath(lx, ly, lw, lh, r, true);
    ctx.fill();
    drawLensPath(rx, ly, lw, lh, r, false);
    ctx.fill();
    ctx.restore();

    ctx.lineWidth = strokeW;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Helper for optical lens rendering with selectable coatings
    const renderCoatedLens = (x, y, width, height, radius, isLeft) => {
      ctx.save();
      drawLensPath(x, y, width, height, radius, isLeft);

      const coating = lensCoatingRef.current;
      if (coating === 'antireflective') {
        const grad = ctx.createLinearGradient(x, y, x + width, y + height);
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.22)');
        grad.addColorStop(0.5, style.lensFill || 'rgba(10,15,40,0.2)');
        grad.addColorStop(1, 'rgba(40, 220, 160, 0.25)');
        ctx.fillStyle = grad;
      } else if (coating === 'bluelight') {
        const grad = ctx.createLinearGradient(x, y, x + width, y + height);
        grad.addColorStop(0, 'rgba(0, 140, 255, 0.28)');
        grad.addColorStop(0.6, 'rgba(15, 20, 40, 0.18)');
        grad.addColorStop(1, 'rgba(255, 170, 0, 0.22)');
        ctx.fillStyle = grad;
      } else if (coating === 'polarized') {
        const grad = ctx.createLinearGradient(x, y, x, y + height);
        grad.addColorStop(0, 'rgba(5, 5, 15, 0.85)');
        grad.addColorStop(1, 'rgba(30, 40, 60, 0.35)');
        ctx.fillStyle = grad;
      } else if (coating === 'photochromic') {
        ctx.fillStyle = 'rgba(15, 20, 35, 0.65)';
      } else {
        ctx.fillStyle = style.lensFill || 'rgba(10,15,40,0.25)';
      }
      ctx.fill();

      // Outer 3D acetate/metallic frame rim
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = style.frameColor || '#1C1C1E';
      ctx.stroke();

      // Inner 3D bevel highlight for realistic depth
      ctx.lineWidth = strokeW * 0.35;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
      ctx.save();
      ctx.translate(isLeft ? strokeW * 0.3 : -strokeW * 0.3, strokeW * 0.3);
      ctx.scale(0.96, 0.96);
      drawLensPath(x, y, width, height, radius, isLeft);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    // 1. LEFT LENS & RIGHT LENS WITH OPTICAL COATINGS
    renderCoatedLens(lx, ly, lw, lh, r, true);
    renderCoatedLens(rx, ly, lw, lh, r, false);

    // 3. NOSE BRIDGE & OPTIONAL DOUBLE BRIDGE WITH 3D HIGHLIGHT
    ctx.beginPath();
    if (style.shape === 'hex-aviator') {
      // Aviator Double Bridge (top straight bar + lower nose curve)
      ctx.moveTo(-bw / 2, -bh * 0.4);
      ctx.lineTo(bw / 2, -bh * 0.4);
      ctx.moveTo(-bw / 2, -lh * 0.25);
      ctx.quadraticCurveTo(0, -lh * 0.38, bw / 2, -lh * 0.25);
    } else {
      ctx.moveTo(-bw / 2, -bh / 2);
      ctx.quadraticCurveTo(0, -bh * 1.6, bw / 2, -bh / 2);
    }
    ctx.lineWidth = strokeW * 0.85;
    ctx.strokeStyle = style.frameColor || '#1C1C1E';
    ctx.stroke();

    // 4. GOLD HINGE ACCENTS (4 horizontal ridges at outer hinges)
    if (style.hingeAccent) {
      const drawHingeAccent = (hx, hy) => {
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.roundRect(
            hx - cornerAccentSize / 2,
            hy - cornerAccentSize / 2 + i * (cornerAccentSize * 0.55),
            cornerAccentSize * 1.8,
            cornerAccentSize * 0.35,
            2
          );
          ctx.fillStyle = style.hingeAccent;
          ctx.fill();
        }
      };
      drawHingeAccent(lx + lw - 2, ly + lh * 0.2);
      drawHingeAccent(rx - 2, ly + lh * 0.2);
    }

    // 5. TEMPLE ARMS WITH REALISTIC SHORTENING
    ctx.beginPath();
    ctx.moveTo(lx, ly + lh * 0.35);
    ctx.lineTo(lx - tw, ly + lh * 0.52);
    ctx.lineWidth = strokeW * 0.85;
    ctx.strokeStyle = style.frameColor || '#1C1C1E';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rx + lw, ly + lh * 0.35);
    ctx.lineTo(rx + lw + tw, ly + lh * 0.52);
    ctx.stroke();

    // 6. REALISTIC SPECULAR LENS GLARE & REFLECTION HIGHLIGHTS
    ctx.beginPath();
    ctx.moveTo(lx + lw * 0.15, ly + lh * 0.15);
    ctx.lineTo(lx + lw * 0.35, ly + lh * 0.85);
    ctx.lineWidth = strokeW * 0.45;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rx + lw * 0.15, ly + lh * 0.15);
    ctx.lineTo(rx + lw * 0.35, ly + lh * 0.85);
    ctx.stroke();

    ctx.restore();
  };

  // ==========================================================================
  // HIGH-ACCURACY 3D 360-DEGREE INTERACTIVE EYEWEAR TURNTABLE RENDERING ENGINE
  // ==========================================================================
  const draw360Frame = (ctx, style, angleDeg, pitchDeg, w, h) => {
    ctx.save();
    const centerX = w / 2;
    const centerY = h * 0.44;
    const theta = (angleDeg * Math.PI) / 180;
    const phi = (pitchDeg * Math.PI) / 180;
    const fovDist = 900;

    // Helper to project 3D coordinates (x, y, z) to 2D canvas with perspective
    const project = (x, y, z) => {
      // Yaw around Y
      const x1 = x * Math.cos(theta) + z * Math.sin(theta);
      const z1 = -x * Math.sin(theta) + z * Math.cos(theta);
      // Pitch around X
      const y2 = y * Math.cos(phi) - z1 * Math.sin(phi);
      const z2 = y * Math.sin(phi) + z1 * Math.cos(phi);
      const scale = fovDist / (fovDist - z2);
      return {
        x: centerX + x1 * scale,
        y: centerY + y2 * scale,
        scale: scale,
        z: z2
      };
    };

    // 1. DRAW 3D GLOWING TURNTABLE PEDESTAL UNDERNEATH GLASSES
    const pCenter = project(0, 140, 0);
    ctx.save();
    ctx.translate(pCenter.x, pCenter.y);
    ctx.scale(1, 0.28);
    const pedGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 240 * pCenter.scale);
    pedGrad.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
    pedGrad.addColorStop(0.5, 'rgba(255, 77, 141, 0.18)');
    pedGrad.addColorStop(1, 'rgba(15, 21, 53, 0)');
    ctx.fillStyle = pedGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 240 * pCenter.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
    ctx.stroke();
    ctx.restore();

    // 2. DEFINE 3D EYEWEAR GEOMETRY & EXACT DEPTH SORTING
    const strokeW = 9;
    const lw = 132;
    const lh = 94;
    const lx = -78;
    const rx = 78;
    const templeLen = 260;

    // Center Z depth calculations for each structural primitive
    const leftTempleZ = project(-140, 0, -templeLen / 2).z;
    const rightTempleZ = project(140, 0, -templeLen / 2).z;
    const rimBackZ = project(0, 0, -8).z;
    const rimMidZ = project(0, 0, -4).z;
    const rimFrontZ = project(0, 0, 2).z;
    const bridgeZ = project(0, -12, 6).z;

    const components = [
      { id: 'leftTemple', z: leftTempleZ },
      { id: 'rightTemple', z: rightTempleZ },
      { id: 'rimBack', z: rimBackZ },
      { id: 'rimMid', z: rimMidZ },
      { id: 'rimFront', z: rimFrontZ },
      { id: 'bridge', z: bridgeZ }
    ];

    // Sort ascending by z: furthest elements draw first, nearest draw on top (painters algorithm)
    components.sort((a, b) => a.z - b.z);

    // Render solid shaded temple arm with realistic earpiece curve and metallic hinge
    const renderTemple = (isLeft) => {
      const xSide = isLeft ? -142 : 142;
      const xEar = isLeft ? -134 : 134;
      const pHinge = project(xSide, -12, 0);
      const pMid = project(xSide, -8, -templeLen * 0.65);
      const pEarTop = project(xEar, 6, -templeLen * 0.9);
      const pEarEnd = project(xEar, 44, -templeLen);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pHinge.x, pHinge.y);
      ctx.lineTo(pMid.x, pMid.y);
      ctx.quadraticCurveTo(pEarTop.x, pEarTop.y, pEarEnd.x, pEarEnd.y);
      
      // Arm width scales with perspective
      const armW = Math.max(3, strokeW * ((pHinge.scale + pMid.scale) / 2) * 0.95);
      ctx.lineWidth = armW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Gradient shading along temple depth
      const grad = ctx.createLinearGradient(pHinge.x, pHinge.y, pEarEnd.x, pEarEnd.y);
      grad.addColorStop(0, style.frameColor || '#1C1C1E');
      grad.addColorStop(0.6, style.frameColor || '#1C1C1E');
      grad.addColorStop(1, '#0A0D1A'); // Shaded earpiece tip
      ctx.strokeStyle = grad;
      ctx.stroke();

      // Metallic barrel hinge joint at frame connection
      ctx.beginPath();
      ctx.arc(pHinge.x, pHinge.y, armW * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = style.hingeAccent || '#FFD700';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();
      ctx.restore();
    };

    // Helper to draw extruded 3D lens rim at specific z offset
    const renderRimLayer = (zOffset, isFront) => {
      const pLeft = project(lx, 0, zOffset);
      const pRight = project(rx, 0, zOffset);

      const drawRim = (centerP) => {
        ctx.save();
        ctx.translate(centerP.x, centerP.y);
        const foreshortenX = Math.max(0.12, Math.abs(Math.cos(theta)));
        ctx.scale(foreshortenX * centerP.scale, centerP.scale);

        ctx.beginPath();
        ctx.roundRect(-lw / 2, -lh / 2, lw, lh, 22);

        if (isFront) {
          // Fill optical lens coating gradient on front face
          const coating = lensCoatingRef.current;
          if (coating === 'antireflective') {
            const grad = ctx.createLinearGradient(-lw / 2, -lh / 2, lw / 2, lh / 2);
            grad.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
            grad.addColorStop(0.5, style.lensFill || 'rgba(10,15,40,0.25)');
            grad.addColorStop(1, 'rgba(40, 220, 160, 0.35)');
            ctx.fillStyle = grad;
          } else if (coating === 'bluelight') {
            const grad = ctx.createLinearGradient(-lw / 2, -lh / 2, lw / 2, lh / 2);
            grad.addColorStop(0, 'rgba(0, 140, 255, 0.4)');
            grad.addColorStop(0.6, 'rgba(15, 20, 40, 0.22)');
            grad.addColorStop(1, 'rgba(255, 170, 0, 0.3)');
            ctx.fillStyle = grad;
          } else if (coating === 'polarized') {
            ctx.fillStyle = 'rgba(10, 15, 25, 0.88)';
          } else if (coating === 'photochromic') {
            ctx.fillStyle = 'rgba(20, 25, 45, 0.72)';
          } else {
            ctx.fillStyle = style.lensFill || 'rgba(10,15,40,0.3)';
          }
          ctx.fill();

          // Specular diagonal glare streak on glass
          ctx.beginPath();
          ctx.moveTo(-lw * 0.25, -lh * 0.3);
          ctx.lineTo(lw * 0.2, lh * 0.35);
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.stroke();
        }

        // Rim thickness and shading
        ctx.lineWidth = isFront ? strokeW : strokeW * 0.95;
        if (isFront) {
          ctx.strokeStyle = style.frameColor || '#1C1C1E';
        } else {
          // Darker shading for extruded back edges to create depth
          ctx.strokeStyle = 'rgba(10, 14, 30, 0.85)';
        }
        ctx.stroke();
        ctx.restore();
      };

      drawRim(pLeft);
      drawRim(pRight);
    };

    // Render sculpted 3D bridge and silicone nose pads
    const renderBridge = () => {
      const pBridge = project(0, -12, 6);
      const bLeft = project(lx + lw * 0.46, -8, 2);
      const bRight = project(rx - lw * 0.46, -8, 2);

      ctx.save();
      // Nose pads behind bridge
      const padL = project(-16, 4, -4);
      const padR = project(16, 4, -4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath(); ctx.ellipse(padL.x, padL.y, 4 * padL.scale, 7 * padL.scale, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(padR.x, padR.y, 4 * padR.scale, 7 * padR.scale, -0.2, 0, Math.PI * 2); ctx.fill();

      // Main bridge arch
      ctx.beginPath();
      ctx.moveTo(bLeft.x, bLeft.y);
      ctx.quadraticCurveTo(pBridge.x, pBridge.y - 18 * pBridge.scale, bRight.x, bRight.y);
      ctx.lineWidth = strokeW * pBridge.scale * 0.9;
      ctx.lineCap = 'round';
      ctx.strokeStyle = style.frameColor || '#1C1C1E';
      ctx.stroke();
      ctx.restore();
    };

    // Execute depth-sorted rendering queue
    components.forEach((comp) => {
      if (comp.id === 'leftTemple') renderTemple(true);
      else if (comp.id === 'rightTemple') renderTemple(false);
      else if (comp.id === 'rimBack') renderRimLayer(-8, false);
      else if (comp.id === 'rimMid') renderRimLayer(-3, false);
      else if (comp.id === 'rimFront') renderRimLayer(2, true);
      else if (comp.id === 'bridge') renderBridge();
    });

    ctx.save();
    ctx.font = '900 13px Inter, system-ui, -apple-system';
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText(`🔄 360° TURNTABLE: ${Math.round((angleDeg + 360) % 360)}°`, centerX, h * 0.84);
    ctx.restore();

    ctx.restore();
  };

  // ==========================================================================
  // MODE 1: LIVE AI SIMULATION LOOP (For Desktop / Immediate Testing)
  // ==========================================================================
  const startDemoSimulation = () => {
    setStatus('active');
    setMode('demo');
    setFaceDetected(true);

    const startTime = Date.now();
    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }
      const ctx = canvas.getContext('2d');
      const w = canvas.width || 1280;
      const h = canvas.height || 720;

      ctx.clearRect(0, 0, w, h);

      // Draw simulated studio mirror gradient background
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w * 0.7);
      bgGrad.addColorStop(0, '#1B1F4A');
      bgGrad.addColorStop(1, '#0A0D22');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Calculate natural sinusoidal head oscillation (breathing / tilting)
      const elapsed = (Date.now() - startTime) * 0.0018;
      const simX = w / 2 + Math.sin(elapsed * 0.8) * (w * 0.04);
      const simY = h * 0.46 + Math.cos(elapsed * 1.2) * (h * 0.02);
      const simYaw = Math.sin(elapsed * 0.6) * 0.12; // +- 7 degrees tilt
      const simScale = 1 + Math.sin(elapsed * 0.5) * 0.03;
      const simWidth = (w * 0.32) * simScale;

      // Draw stylized 3D facial mesh silhouette behind glasses
      ctx.save();
      ctx.translate(simX, simY);
      ctx.rotate(simYaw);

      // Face silhouette oval
      ctx.beginPath();
      ctx.ellipse(0, 0, simWidth * 0.65, simWidth * 0.9, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 77, 141, 0.25)';
      ctx.stroke();

      // Eye contour markers
      ctx.beginPath();
      ctx.ellipse(-simWidth * 0.25, -simWidth * 0.12, 18, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(simWidth * 0.25, -simWidth * 0.12, 18, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(30, 136, 229, 0.3)';
      ctx.fill();

      // Nose bridge line
      ctx.beginPath();
      ctx.moveTo(0, -simWidth * 0.12);
      ctx.lineTo(0, simWidth * 0.2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      ctx.restore();

      // Update smooth tracking parameters
      const s = smoothRef.current;
      s.frameCenterX = lerp(s.frameCenterX, simX, 0.35);
      s.frameCenterY = lerp(s.frameCenterY, simY - simWidth * 0.1, 0.35);
      s.frameWidth = lerp(s.frameWidth, simWidth, 0.35);
      s.bridgeWidth = lerp(s.bridgeWidth, simWidth * 0.18, 0.35);
      s.lensHeight = lerp(s.lensHeight, ((simWidth - s.bridgeWidth) / 2) * 0.65, 0.35);
      s.yawAngle = lerp(s.yawAngle, simYaw, 0.35);

      // RENDER THE GLASSES FRAME — uses ref to always get current frame without stale closure
      if (!isFrameErasedRef.current) {
        drawGlassesFrame(ctx, s, FRAMES[selectedFrameIdxRef.current]);
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);
  };

  // ==========================================================================
  // MODE 3: PHOTO UPLOAD VIRTUAL TRY-ON (AI Facial Mapping on Uploaded Selfie)
  // ==========================================================================
  const startPhotoSimulation = (img) => {
    if (cameraInstanceRef.current && cameraInstanceRef.current.stop) {
      try { cameraInstanceRef.current.stop(); } catch (_) {}
      cameraInstanceRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setStatus('active');
    setMode('photo');
    setFaceDetected(true);
    modeRef.current = 'photo';
    uploadedPhotoRef.current = img;

    const startTime = Date.now();
    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }
      const ctx = canvas.getContext('2d');
      const w = canvas.width || 1280;
      const h = canvas.height || 720;

      ctx.clearRect(0, 0, w, h);

      // Draw uploaded photo preserving aspect ratio and centering
      if (uploadedPhotoRef.current) {
        ctx.save();
        const imgObj = uploadedPhotoRef.current;
        const imgRatio = imgObj.width / imgObj.height;
        const canvasRatio = w / h;
        let drawW = w, drawH = h, offsetX = 0, offsetY = 0;
        if (imgRatio > canvasRatio) {
          drawH = h;
          drawW = h * imgRatio;
          offsetX = (w - drawW) / 2;
        } else {
          drawW = w;
          drawH = w / imgRatio;
          offsetY = (h - drawH) / 2;
        }
        ctx.drawImage(imgObj, offsetX, offsetY, drawW, drawH);
        ctx.restore();
      }

      // Position eyewear frame naturally on face in uploaded photo
      const s = smoothRef.current;
      if (!s.isPhotoMapped) {
        const simX = w / 2;
        const simY = h * 0.44;
        const simWidth = w * 0.36;
        s.frameCenterX = lerp(s.frameCenterX, simX, 0.4);
        s.frameCenterY = lerp(s.frameCenterY, simY - simWidth * 0.1, 0.4);
        s.frameWidth = lerp(s.frameWidth, simWidth, 0.4);
        s.bridgeWidth = lerp(s.bridgeWidth, simWidth * 0.18, 0.4);
        s.lensHeight = lerp(s.lensHeight, ((simWidth - s.bridgeWidth) / 2) * 0.65, 0.4);
        s.yawAngle = 0;
      }

      if (!isFrameErasedRef.current) {
        drawGlassesFrame(ctx, s, FRAMES[selectedFrameIdxRef.current]);
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        setUploadedPhoto(img);
        smoothRef.current.isPhotoMapped = false;
        startPhotoSimulation(img);
        showToast('📸 Photo Loaded! Scanning AI Facial Landmarks...');
        if (faceMeshRef.current) {
          try {
            await faceMeshRef.current.send({ image: img });
            showToast('AI Facial Mapping Complete!');
          } catch (err) {
            console.warn('Photo face mesh error:', err);
          }
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ==========================================================================
  // MODE 4: INTERACTIVE 360° 3D EYEWEAR TURNTABLE PREVIEW MODE
  // ==========================================================================
  const start360Simulation = () => {
    if (cameraInstanceRef.current && cameraInstanceRef.current.stop) {
      try { cameraInstanceRef.current.stop(); } catch (_) {}
      cameraInstanceRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setStatus('active');
    setMode('360');
    setFaceDetected(true);
    modeRef.current = '360';
    smoothRef.current.isPhotoMapped = false;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }
      const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
      const w = canvas.width || 1280;
      const h = canvas.height || 720;

      ctx.clearRect(0, 0, w, h);

      // Draw premium 3D studio gradient background
      const bgGrad = ctx.createRadialGradient(w / 2, h * 0.44, 60, w / 2, h * 0.44, w * 0.75);
      bgGrad.addColorStop(0, '#151C48');
      bgGrad.addColorStop(0.6, '#0B0F2A');
      bgGrad.addColorStop(1, '#050716');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Advance auto-spin rotation if active and not dragging
      if (isAutoSpinningRef.current && !isDragging360Ref.current) {
        orbitAngleRef.current = (orbitAngleRef.current + 0.65) % 360;
        setOrbitAngle(orbitAngleRef.current);
      }

      draw360Frame(
        ctx,
        FRAMES[selectedFrameIdxRef.current],
        orbitAngleRef.current,
        orbitPitchRef.current,
        w,
        h
      );

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);
  };

  // ==========================================================================
  // MODE 2: REAL MEDIAPIPE FACEMESH WEBCAM STREAM
  // ==========================================================================
  const startRealCamera = async () => {
    // Stop previous MediaPipe camera and tracks before starting fresh
    if (cameraInstanceRef.current && cameraInstanceRef.current.stop) {
      try { cameraInstanceRef.current.stop(); } catch (_) {}
      cameraInstanceRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }

    setStatus('loading');
    setMode('camera');
    modeRef.current = 'camera';
    smoothRef.current.isPhotoMapped = false;

    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not accessible in this environment.');
      }

      // Request live camera stream with optimized high framerate for lag-free AR try-on
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: facingMode, frameRate: { ideal: 60, max: 60 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadedmetadata', () => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth || 1280;
            canvasRef.current.height = videoRef.current.videoHeight || 720;
          }
        });
        await videoRef.current.play();
      }

      if (!faceMeshRef.current) {
        const faceMesh = new window.FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true, // Enables refined iris tracking
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.65
        });

        faceMesh.onResults((results) => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            // Check if face lost for > 1.5 seconds
            if (Date.now() - lastFaceTimeRef.current > 1500) {
              setFaceDetected(false);
            }
            return;
          }

          lastFaceTimeRef.current = Date.now();
          if (!faceDetectedRef.current) {
            faceDetectedRef.current = true;
            setFaceDetected(true);
          }
          if (statusRef.current === 'loading') {
            statusRef.current = 'active';
            setStatus('active');
          }

          const lm = results.multiFaceLandmarks[0];
          if (!lm || !lm[33] || !lm[263] || !lm[133] || !lm[362]) return;

          let toPixel;
          if (modeRef.current === 'photo' && uploadedPhotoRef.current) {
            const imgObj = uploadedPhotoRef.current;
            const imgRatio = imgObj.width / imgObj.height;
            const canvasRatio = canvas.width / canvas.height;
            let drawW = canvas.width, drawH = canvas.height, offsetX = 0, offsetY = 0;
            if (imgRatio > canvasRatio) {
              drawH = canvas.height;
              drawW = canvas.height * imgRatio;
              offsetX = (canvas.width - drawW) / 2;
            } else {
              drawW = canvas.width;
              drawH = canvas.width / imgRatio;
              offsetY = (canvas.height - drawH) / 2;
            }
            toPixel = (pt) => ({ x: offsetX + pt.x * drawW, y: offsetY + pt.y * drawH });
            smoothRef.current.isPhotoMapped = true;
          } else {
            if (videoRef.current && videoRef.current.videoWidth > 0 && (canvas.width !== videoRef.current.videoWidth || canvas.height !== videoRef.current.videoHeight)) {
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
            }
            toPixel = (pt) => ({ x: pt.x * canvas.width, y: pt.y * canvas.height });
          }

          // Landmark indices: Left eye outer: 33, inner: 133; Right eye outer: 263, inner: 362
          const leftOuter = toPixel(lm[33]);
          const rightOuter = toPixel(lm[263]);
          const leftInner = toPixel(lm[133]);
          const rightInner = toPixel(lm[362]);

          // Calculate exact eye centerline to prevent glasses from sitting too high on mobile
          const leftEyeCenterY = (leftOuter.y + leftInner.y) / 2;
          const rightEyeCenterY = (rightOuter.y + rightInner.y) / 2;

          // Frame width = outer-to-outer eye span × 1.72 multiplier
          const eyeSpanWidth = Math.hypot(rightOuter.x - leftOuter.x, rightOuter.y - leftOuter.y);
          const frameWidth = eyeSpanWidth * 1.72;

          // Frame center X & Y anchored directly to horizontal eye line with nose bridge calibration
          const frameCenterX = (leftOuter.x + rightOuter.x) / 2;
          const frameCenterY = (leftEyeCenterY + rightEyeCenterY) / 2 + lensHeight * 0.12;

          // Bridge width = inner corner distance × 1.1
          const bridgeWidth = Math.hypot(rightInner.x - leftInner.x, rightInner.y - leftInner.y) * 1.1;

          // Individual lens height
          const lensWidth = (frameWidth - bridgeWidth) / 2;
          const lensHeight = lensWidth * 0.65;

          // Head yaw rotation angle
          const yawAngle = Math.atan2(rightOuter.y - leftOuter.y, rightOuter.x - leftOuter.x);

          // Apply EMA smoothing (alpha = 0.35)
          const s = smoothRef.current;
          s.frameCenterX = lerp(s.frameCenterX, frameCenterX, 0.35);
          s.frameCenterY = lerp(s.frameCenterY, frameCenterY, 0.35);
          s.frameWidth = lerp(s.frameWidth, frameWidth, 0.35);
          s.bridgeWidth = lerp(s.bridgeWidth, bridgeWidth, 0.35);
          s.lensHeight = lerp(s.lensHeight, lensHeight, 0.35);
          s.yawAngle = lerp(s.yawAngle, yawAngle, 0.35);

          if (modeRef.current !== 'photo') {
            const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!isFrameErasedRef.current) {
              drawGlassesFrame(ctx, s, FRAMES[selectedFrameIdxRef.current]);
            }
          }
        });

        faceMeshRef.current = faceMesh;
      }

      if (videoRef.current) {
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && faceMeshRef.current) {
              await faceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 720,
          facingMode: facingMode
        });
        camera.start();
        cameraInstanceRef.current = camera;
      }
    } catch (err) {
      console.warn('MediaPipe init error:', err);
      startDemoSimulation();
    }
  };

  // Auto-launch camera directly upon activation & cleanup on unmount
  useEffect(() => {
    startRealCamera();
    return () => {
      // 1. Cancel animation frame
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      // 2. Stop MediaPipe camera
      if (cameraInstanceRef.current && cameraInstanceRef.current.stop) cameraInstanceRef.current.stop();
      // 3. Stop all camera stream tracks
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      // 4. Close FaceMesh instance
      if (faceMeshRef.current && faceMeshRef.current.close) {
        faceMeshRef.current.close();
      }
      // 5. Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      // 6. Clear toast timer
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally runs only on unmount

  // ==========================================================================
  // SNAPSHOT CAPTURE LOGIC
  // ==========================================================================
  const handleTakeSnapshot = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create offscreen composite canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = canvas.width || 1280;
    offCanvas.height = canvas.height || 720;
    const offCtx = offCanvas.getContext('2d');

    // Draw background (either video frame or studio background)
    if (mode === 'camera' && videoRef.current && videoRef.current.readyState >= 2) {
      offCtx.save();
      offCtx.scale(-1, 1);
      offCtx.drawImage(videoRef.current, -offCanvas.width, 0, offCanvas.width, offCanvas.height);
      offCtx.restore();
    } else {
      // Draw dark studio background
      const bgGrad = offCtx.createRadialGradient(offCanvas.width / 2, offCanvas.height / 2, 50, offCanvas.width / 2, offCanvas.height / 2, offCanvas.width * 0.7);
      bgGrad.addColorStop(0, '#1B1F4A');
      bgGrad.addColorStop(1, '#0A0D22');
      offCtx.fillStyle = bgGrad;
      offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);
    }

    // Draw overlay glasses canvas on top
    offCtx.drawImage(canvas, 0, 0);

    // Add Lens Makers watermarked badge in corner
    offCtx.fillStyle = 'rgba(15, 21, 53, 0.8)';
    offCtx.roundRect(24, offCanvas.height - 60, 210, 36, 18);
    offCtx.fill();
    offCtx.fillStyle = '#FFFFFF';
    offCtx.font = 'bold 15px sans-serif';
    offCtx.fillText('Lens Makers AR Studio', 40, offCanvas.height - 37);

    // Save data URL
    const dataUrl = offCanvas.toDataURL('image/png');
    setSnapshotUrl(dataUrl);
    setStatus('snapshot');
    showToast('📸 Snapshot captured successfully!');
  };

  // Download Snapshot image to user device
  const handleDownloadSnapshot = () => {
    if (!snapshotUrl) return;
    const link = document.createElement('a');
    link.href = snapshotUrl;
    link.download = `lensmakers-tryon-${currentFrameStyle.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('💾 Snapshot saved to your photo gallery!');
  };

  // Toggle wishlist
  const handleToggleWishlist = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setWishlist((prev) => {
      const exists = prev.includes(currentFrameStyle.id);
      if (exists) {
        showToast('💔 Removed from Wishlist');
        return prev.filter((id) => id !== currentFrameStyle.id);
      } else {
        showToast('❤️ Saved to Wishlist!');
        return [...prev, currentFrameStyle.id];
      }
    });
  };

  // Reset Try-On to defaults
  const handleResetTryOn = () => {
    setSelectedFrameIdx(1); // Reset to Classic Black
    setLensCoating('antireflective');
    setOrbitAngle(0);
    setOrbitPitch(10);
    setIsAutoSpinning(true);
    smoothRef.current = {
      frameCenterX: 640,
      frameCenterY: 360,
      frameWidth: 320,
      lensHeight: 104,
      bridgeWidth: 60,
      yawAngle: 0,
      pitchAngle: 0
    };
    showToast('↺ Reset frame, optical coating & 360° position to defaults!');
  };

  // 360° Interactive Orbit Drag Handlers
  const handle360MouseDown = (e) => {
    if (modeRef.current !== '360') return;
    isDragging360Ref.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };
  const handle360MouseMove = (e) => {
    if (modeRef.current !== '360' || !isDragging360Ref.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    orbitAngleRef.current = (orbitAngleRef.current + deltaX * 0.75 + 360) % 360;
    orbitPitchRef.current = Math.max(-30, Math.min(30, orbitPitchRef.current + deltaY * 0.45));
    setOrbitAngle(orbitAngleRef.current);
    setOrbitPitch(orbitPitchRef.current);
  };
  const handle360MouseUp = () => {
    isDragging360Ref.current = false;
  };
  const handle360TouchStart = (e) => {
    if (modeRef.current !== '360' || !e.touches || !e.touches[0]) return;
    isDragging360Ref.current = true;
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handle360TouchMove = (e) => {
    if (modeRef.current !== '360' || !isDragging360Ref.current || !e.touches || !e.touches[0]) return;
    const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    orbitAngleRef.current = (orbitAngleRef.current + deltaX * 0.75 + 360) % 360;
    orbitPitchRef.current = Math.max(-30, Math.min(30, orbitPitchRef.current + deltaY * 0.45));
    setOrbitAngle(orbitAngleRef.current);
    setOrbitPitch(orbitPitchRef.current);
  };
  const handle360TouchEnd = () => {
    isDragging360Ref.current = false;
  };

  return (
    <div className="tryon-full-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="lens-toast" style={{ zIndex: 9999 }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* White Flash Animation Overlay */}
      {isFlashing && <div className="tryon-flash-overlay" />}

      {/* Hidden File Input for Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
      />

      {/* ==========================================================================
         SCREEN 2: LOADING STATE (While FaceMesh Initializes)
         ========================================================================== */}
      {status === 'loading' && !faceDetected && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#FF4D8D', animation: 'spin 1s infinite linear', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '32px' }}>👓</span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>Setting up your mirror...</h2>
          <p style={{ fontSize: '13px', color: '#A0A4C8', marginTop: '8px' }}>Calibrating 468 facial mesh landmarks</p>
        </div>
      )}

      {/* ==========================================================================
         SCREEN 3: FALLBACK / ERROR SCREEN
         ========================================================================== */}
      {status === 'fallback' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
          <span style={{ fontSize: '64px', marginBottom: '16px' }}>🕶️</span>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', marginBottom: '10px' }}>Camera Offline or Denied</h2>
          <p style={{ fontSize: '13px', color: '#A0A4C8', maxWidth: '300px', lineHeight: '1.6', marginBottom: '28px' }}>
            Your browser doesn't support live try-on or webcam permission was blocked. You can still test frames using our interactive AI simulation!
          </p>
          <button
            type="button"
            className="btn-primary-pill mb-3"
            style={{ padding: '14px 32px' }}
            onClick={() => {
              showToast('Starting simulation mode');
              startDemoSimulation();
            }}
          >
            Launch AI Simulation Mode
          </button>
          <button
            type="button"
            className="photo-upload-btn-premium mb-3"
            style={{ padding: '12px 28px' }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            📁 Upload Photo / Selfie
          </button>
          <button
            type="button"
            className="btn-secondary-pill"
            style={{ padding: '12px 28px' }}
            onClick={() => {
              if (onSelectTab) onSelectTab('shop');
            }}
          >
            Browse Frame Gallery
          </button>
        </div>
      )}

      {/* ==========================================================================
         SCREEN 4: LIVE TRY-ON AR STUDIO (Active Mode)
         ========================================================================== */}
      {(status === 'active' || status === 'loading') && (
        <div
          style={{
            flex: 1,
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: mode === '360' ? (isDragging360Ref.current ? 'grabbing' : 'grab') : 'default',
            touchAction: mode === '360' ? 'none' : 'auto'
          }}
          onMouseDown={handle360MouseDown}
          onMouseMove={handle360MouseMove}
          onMouseUp={handle360MouseUp}
          onMouseLeave={handle360MouseUp}
          onTouchStart={handle360TouchStart}
          onTouchMove={handle360TouchMove}
          onTouchEnd={handle360TouchEnd}
        >
          {/* Mirrored Video Stream Layer (hidden in demo/360 mode) */}
          <video
            ref={videoRef}
            className="tryon-media-layer"
            style={{ display: mode === 'camera' ? 'block' : 'none' }}
            playsInline
            muted
            autoPlay
          />

          {/* High-precision Glasses Drawing Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="tryon-canvas-layer"
            width={1280}
            height={720}
            style={{ transform: mode === 'camera' ? 'scaleX(-1)' : 'none' }}
          />

          {/* TOP TRANSPARENT BAR CONTROLS */}
          <div className="tryon-top-bar">
            {/* Far Left: Sleek Modern Close Button */}
            <button
              type="button"
              className="tryon-sleek-btn"
              onClick={() => {
                if (onSelectTab) onSelectTab('home');
              }}
              title="Close Try-On"
            >
              <i data-lucide="x" style={{ width: '18px', height: '18px' }} />
              <span>Close</span>
            </button>

            {/* Center: Segmented 3-Mode Switcher & Conditional Photo Upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div className="tryon-mode-pill">
                <button
                  type="button"
                  className={`tryon-mode-option ${mode === 'camera' ? 'active' : ''}`}
                  onClick={() => {
                    showToast('🪞 Launching Live AR Camera');
                    startRealCamera();
                  }}
                >
                  <span>🪞 Live AR</span>
                </button>
                <button
                  type="button"
                  className={`tryon-mode-option ${mode === 'demo' || mode === 'photo' ? 'active' : ''}`}
                  onClick={() => {
                    showToast('Switched to 3D AI Simulation');
                    startDemoSimulation();
                  }}
                >
                  <span>✨ Simulation</span>
                </button>
                <button
                  type="button"
                  className={`tryon-mode-option ${mode === '360' ? 'active' : ''}`}
                  onClick={() => {
                    showToast('🌐 360° Interactive Turntable Active!');
                    start360Simulation();
                  }}
                >
                  <span>🌐 360°</span>
                </button>
              </div>

              {mode !== 'camera' && (
                <button
                  type="button"
                  className="photo-upload-btn-premium"
                  style={{ padding: '6px 14px', fontSize: '12px', height: '36px' }}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  title="Upload a new selfie or photo"
                >
                  <span>📁 Upload Photo</span>
                </button>
              )}
            </div>

            {/* Far Right: Sleek Modern Reset & Flip Camera Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="tryon-sleek-btn"
                onClick={handleResetTryOn}
                title="Reset Try-On Frame & Angle"
              >
                <i data-lucide="rotate-ccw" style={{ width: '18px', height: '18px' }} />
                <span>Reset</span>
              </button>

              <button
                type="button"
                className="tryon-sleek-btn"
                onClick={() => {
                  const nextMode = facingMode === 'user' ? 'environment' : 'user';
                  setFacingMode(nextMode);
                  showToast(`🔄 Switched to ${nextMode === 'user' ? 'Front' : 'Rear'} Camera`);
                  if (mode === 'camera') {
                    if (videoRef.current && videoRef.current.srcObject) {
                      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
                    }
                    startRealCamera();
                  }
                }}
                title="Flip Camera"
              >
                <i data-lucide="refresh-cw" style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>

          {/* 360° TURNTABLE ANGLE PRESET CONTROLS (Only visible in 360 mode) */}
          {mode === '360' && (
            <div className="tryon-360-controls">
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#00E5FF', marginRight: '4px' }}>📐 Angle Presets:</span>
              <button
                type="button"
                className={`tryon-360-chip ${orbitAngle === 0 ? 'active' : ''}`}
                onClick={() => {
                  setOrbitAngle(0);
                  setOrbitPitch(10);
                  setIsAutoSpinning(false);
                }}
              >
                👁️ Front 0°
              </button>
              <button
                type="button"
                className={`tryon-360-chip ${orbitAngle === 45 ? 'active' : ''}`}
                onClick={() => {
                  setOrbitAngle(45);
                  setOrbitPitch(20);
                  setIsAutoSpinning(false);
                }}
              >
                💎 Isometric 45°
              </button>
              <button
                type="button"
                className={`tryon-360-chip ${orbitAngle === 90 ? 'active' : ''}`}
                onClick={() => {
                  setOrbitAngle(90);
                  setOrbitPitch(0);
                  setIsAutoSpinning(false);
                }}
              >
                📐 Side 90°
              </button>
              <button
                type="button"
                className={`tryon-360-chip ${orbitAngle === 180 ? 'active' : ''}`}
                onClick={() => {
                  setOrbitAngle(180);
                  setOrbitPitch(10);
                  setIsAutoSpinning(false);
                }}
              >
                🔄 Rear 180°
              </button>
              <button
                type="button"
                className={`tryon-360-chip ${isAutoSpinning ? 'active' : ''}`}
                style={{ background: isAutoSpinning ? '#FF4D8D' : undefined, borderColor: isAutoSpinning ? '#FF4D8D' : undefined, color: isAutoSpinning ? '#FFFFFF' : undefined }}
                onClick={() => {
                  setIsAutoSpinning(!isAutoSpinning);
                }}
              >
                {isAutoSpinning ? '⏸️ Pause Auto-Spin' : '▶️ Auto-Spin 360°'}
              </button>
            </div>
          )}

          {/* "NO FACE DETECTED" GUIDE OVAL (When face lost or calibrating) */}
          {mode !== '360' && !faceDetected && (
            <div className="tryon-face-guide">
              <div className="tryon-oval-outline" />
              <div className="tryon-guide-text">
                Position your face within the frame
              </div>
            </div>
          )}

          {/* BOTTOM CONTROL RIBBON (Minimalist landscape aesthetic) */}
          <div className="tryon-bottom-panel tryon-landscape-ribbon">
            {/* Minimal floating frame name & price badge */}
            <div className="tryon-frame-badge">
              <span style={{ fontWeight: '800', color: '#FFFFFF', fontSize: '13px' }}>{currentFrameStyle.name}</span>
              <span style={{ fontWeight: '900', color: '#00E5FF', marginLeft: '6px', fontSize: '13px' }}>{currentFrameStyle.price}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
              {/* Left Side: Wishlist & Cart Icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  className="tryon-sleek-btn"
                  style={{ width: '42px', height: '42px', padding: 0 }}
                  onClick={handleToggleWishlist}
                  title="Save to Wishlist"
                >
                  <span style={{ fontSize: '18px', color: wishlist.includes(currentFrameStyle.id) ? '#FF4D8D' : '#FFFFFF' }}>
                    {wishlist.includes(currentFrameStyle.id) ? '♥' : '♡'}
                  </span>
                </button>
                <button
                  type="button"
                  className="tryon-sleek-btn"
                  style={{ width: '42px', height: '42px', padding: 0 }}
                  onClick={() => {
                    showToast(`🛍️ Added ${currentFrameStyle.name} to Cart!`);
                    try {
                      const prevCart = parseInt(localStorage.getItem('lensmakers_cart_count') || '2', 10);
                      localStorage.setItem('lensmakers_cart_count', String(prevCart + 1));
                    } catch (err) {}
                  }}
                  title="Add to Cart"
                >
                  <span style={{ fontSize: '18px' }}>🛒</span>
                </button>
              </div>

              {/* Center: Horizontal Frame Thumbnails Ribbon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', flex: 1, padding: '2px 0', scrollbarWidth: 'none', justifyContent: 'center' }}>
                {FRAMES.map((frame, idx) => {
                  const isSel = selectedFrameIdx === idx;
                  return (
                    <div
                      key={frame.id}
                      className={`tryon-thumb-circle ${isSel ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedFrameIdx(idx);
                        showToast(`👓 Switched to ${frame.name}`);
                      }}
                      title={frame.name}
                    >
                      <span>{frame.thumbnail}</span>
                    </div>
                  );
                })}
              </div>

              {/* Right Side: Prominent Snapshot Camera Button */}
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <button
                  type="button"
                  className="tryon-capture-btn"
                  onClick={handleTakeSnapshot}
                  title="Take AR Snapshot"
                >
                  <i data-lucide="camera" style={{ width: '22px', height: '22px', color: '#FFFFFF' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         SCREEN 5: SNAPSHOT RESULT PREVIEW
         ========================================================================== */}
      {status === 'snapshot' && snapshotUrl && (
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Captured Image Display */}
          <img
            src={snapshotUrl}
            alt="AR Try-On Snapshot"
            style={{ width: '100%', height: '100%', objectFit: 'cover', flex: 1 }}
          />

          {/* Top Dismiss Button */}
          <div className="flex-between" style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 20 }}>
            <button
              type="button"
              style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(15, 21, 53, 0.75)', border: '1px solid rgba(255,255,255,0.25)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
              onClick={() => setStatus('active')}
              title="Retake Snapshot"
            >
              ✕
            </button>
            <button
              type="button"
              style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(15, 21, 53, 0.75)', border: '1px solid rgba(255,255,255,0.25)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
              onClick={() => showToast('📤 Opening native share sheet...')}
              title="Share Snapshot"
            >
              <i data-lucide="share-2" style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {/* BOTTOM ACTION BAR (3 Buttons in Glass Panel) */}
          <div className="tryon-bottom-panel" style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Button 1: Retake */}
            <button
              type="button"
              className="btn-secondary-pill"
              style={{ flex: '0 0 85px', height: '48px', fontSize: '13px', fontWeight: '700', padding: '0' }}
              onClick={() => setStatus('active')}
            >
              <span>Retake</span>
            </button>

            {/* Button 2: Save to Gallery */}
            <button
              type="button"
              style={{ flex: 1, height: '48px', borderRadius: '999px', background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)', border: 'none', color: '#FFFFFF', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(30,136,229,0.4)' }}
              onClick={handleDownloadSnapshot}
            >
              <i data-lucide="download" style={{ width: '16px', height: '16px' }} />
              <span>Save to Gallery</span>
            </button>

            {/* Button 3: Buy This Frame */}
            <button
              type="button"
              className="btn-primary-pill"
              style={{ flex: 1, height: '48px', fontSize: '13px', fontWeight: '800' }}
              onClick={() => {
                showToast(`🛒 Proceeding to buy ${currentFrameStyle.name}!`);
                if (onSelectTab) onSelectTab('shop');
              }}
            >
              <span>Buy This Frame →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

window.TryOnScreen = TryOnScreen;
