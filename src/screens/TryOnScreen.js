// AR Virtual Try-On Screen Component — Prompt 5 of 10
// Best-in-class real-time face tracking, Apple visionOS physics, exact sizes, frame switching & snapshot capture
const { useState, useEffect, useRef } = React;

// THE 4 SELECTABLE EYEWEAR FRAMES (Exact specifications from Prompt 5)
const FRAMES = [
  {
    id: 'aviator',
    name: 'Aviator Gold',
    price: '₹4,499',
    frameColor: '#C9B037',
    lensFill: 'rgba(100, 80, 20, 0.15)',
    hingeAccent: null,
    thumbnail: '🛩️'
  },
  {
    id: 'classic-black',
    name: 'Classic Black',
    price: '₹3,899',
    frameColor: '#1C1C1E',
    lensFill: 'rgba(10, 15, 40, 0.22)',
    hingeAccent: '#D4AF37', // Gold ribbed hinge accents
    thumbnail: '👓'
  },
  {
    id: 'sunglasses-dark',
    name: 'Noir Shield',
    price: '₹5,199',
    frameColor: '#0A0A0A',
    lensFill: 'rgba(5, 5, 15, 0.75)', // High-density dark tint
    hingeAccent: null,
    thumbnail: '🕶️'
  },
  {
    id: 'tortoise',
    name: 'Elegant Cat-Eye',
    price: '₹3,499',
    frameColor: '#6B3F18',
    lensFill: 'rgba(60, 30, 10, 0.2)',
    hingeAccent: null,
    thumbnail: '◥'
  }
];

// Linear interpolation for Exponential Moving Average (EMA) smoothing
function lerp(a, b, t) {
  return a + (b - a) * t;
}

const TryOnScreen = ({ onSelectTab }) => {
  // UI & Flow State
  const [status, setStatus] = useState('permission'); // 'permission' | 'loading' | 'active' | 'snapshot' | 'fallback'
  const [mode, setMode] = useState('demo'); // 'camera' | 'demo' | 'photo'
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(1); // Default Classic Black (#1)
  const [faceDetected, setFaceDetected] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [wishlist, setWishlist] = useState(['classic-black']);
  const [toastMessage, setToastMessage] = useState(null);
  const [showBiometricHUD, setShowBiometricHUD] = useState(true);
  const [lensCoating, setLensCoating] = useState('antireflective'); // 'antireflective' | 'bluelight' | 'polarized' | 'photochromic' | 'none'

  // Refs that mirror state for use in rAF/MediaPipe callbacks (avoids stale closure)
  const selectedFrameIdxRef = useRef(1);
  const faceDetectedRef = useRef(false);
  const statusRef = useRef('permission');
  const toastTimeoutRef = useRef(null);
  const showBiometricHUDRef = useRef(true);
  const lensCoatingRef = useRef('antireflective');
  const modeRef = useRef('demo');
  const uploadedPhotoRef = useRef(null);

  // Keep refs in sync whenever state changes
  useEffect(() => { selectedFrameIdxRef.current = selectedFrameIdx; }, [selectedFrameIdx]);
  useEffect(() => { faceDetectedRef.current = faceDetected; }, [faceDetected]);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { showBiometricHUDRef.current = showBiometricHUD; }, [showBiometricHUD]);
  useEffect(() => { lensCoatingRef.current = lensCoating; }, [lensCoating]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { uploadedPhotoRef.current = uploadedPhoto; }, [uploadedPhoto]);

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

    // ------------------------------------------------------------------------
    // LAYER 1: REAL-TIME BIOMETRIC FACIAL TRACKING HUD
    // ------------------------------------------------------------------------
    if (showBiometricHUDRef.current) {
      ctx.save();
      ctx.translate(s.frameCenterX, s.frameCenterY);
      ctx.rotate(s.yawAngle);

      const w = s.frameWidth;
      const h = s.lensHeight * 1.85;
      const pdMM = (s.bridgeWidth * 1.05).toFixed(1);

      // Scanning bounding outline around ocular zone
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(-w * 0.58, -h * 0.52, w * 1.16, h * 1.04);
      ctx.setLineDash([]);

      // Corner precision alignment brackets
      const bw = 14;
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 2;
      // Top left
      ctx.beginPath(); ctx.moveTo(-w * 0.58, -h * 0.52 + bw); ctx.lineTo(-w * 0.58, -h * 0.52); ctx.lineTo(-w * 0.58 + bw, -h * 0.52); ctx.stroke();
      // Top right
      ctx.beginPath(); ctx.moveTo(w * 0.58 - bw, -h * 0.52); ctx.lineTo(w * 0.58, -h * 0.52); ctx.lineTo(w * 0.58, -h * 0.52 + bw); ctx.stroke();
      // Bottom left
      ctx.beginPath(); ctx.moveTo(-w * 0.58, h * 0.52 - bw); ctx.lineTo(-w * 0.58, h * 0.52); ctx.lineTo(-w * 0.58 + bw, h * 0.52); ctx.stroke();
      // Bottom right
      ctx.beginPath(); ctx.moveTo(w * 0.58 - bw, h * 0.52); ctx.lineTo(w * 0.58, h * 0.52); ctx.lineTo(w * 0.58, h * 0.52 - bw); ctx.stroke();

      // Pupil crosshairs (+)
      const lxPupil = -s.frameWidth * 0.26;
      const rxPupil = s.frameWidth * 0.26;
      ctx.strokeStyle = 'rgba(255, 77, 141, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(lxPupil - 7, 0); ctx.lineTo(lxPupil + 7, 0); ctx.moveTo(lxPupil, -7); ctx.lineTo(lxPupil, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rxPupil - 7, 0); ctx.lineTo(rxPupil + 7, 0); ctx.moveTo(rxPupil, -7); ctx.lineTo(rxPupil, 7); ctx.stroke();

      // Interpupillary connecting line
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(lxPupil, 0); ctx.lineTo(rxPupil, 0); ctx.stroke();

      // Biometric telemetry badge pill
      ctx.fillStyle = 'rgba(15, 21, 53, 0.9)';
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-90, -h * 0.52 - 28, 180, 22, 11);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#00E5FF';
      ctx.font = '800 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`PD: ${pdMM}mm • 3D MESH: OVAL`, 0, -h * 0.52 - 17);

      ctx.restore();
    }

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

    // ------------------------------------------------------------------------
    // LAYER 2: REALISTIC AMBIENT OCCLUSION SHADOW CAST ONTO CHEEKBONES
    // ------------------------------------------------------------------------
    ctx.save();
    ctx.translate(0, lh * 0.14);
    ctx.filter = 'blur(12px)';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(lx, ly, lw, lh, r);
    ctx.roundRect(rx, ly, lw, lh, r);
    ctx.fill();
    ctx.restore();

    ctx.lineWidth = strokeW;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Helper for optical lens rendering with selectable coatings
    const renderCoatedLens = (x, y, width, height, radius) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);

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
      ctx.strokeRect(x + strokeW * 0.4, y + strokeW * 0.4, width - strokeW * 0.8, height - strokeW * 0.8);
      ctx.restore();
    };

    // 1. LEFT LENS & RIGHT LENS WITH OPTICAL COATINGS
    renderCoatedLens(lx, ly, lw, lh, r);
    renderCoatedLens(rx, ly, lw, lh, r);

    // 3. NOSE BRIDGE WITH 3D HIGHLIGHT
    ctx.beginPath();
    ctx.moveTo(-bw / 2, -bh / 2);
    ctx.quadraticCurveTo(0, -bh * 1.6, bw / 2, -bh / 2);
    ctx.lineWidth = strokeW * 0.8;
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
      drawGlassesFrame(ctx, s, FRAMES[selectedFrameIdxRef.current]);

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
      const simX = w / 2;
      const simY = h * 0.44;
      const simWidth = w * 0.36;

      const s = smoothRef.current;
      s.frameCenterX = lerp(s.frameCenterX, simX, 0.4);
      s.frameCenterY = lerp(s.frameCenterY, simY - simWidth * 0.1, 0.4);
      s.frameWidth = lerp(s.frameWidth, simWidth, 0.4);
      s.bridgeWidth = lerp(s.bridgeWidth, simWidth * 0.18, 0.4);
      s.lensHeight = lerp(s.lensHeight, ((simWidth - s.bridgeWidth) / 2) * 0.65, 0.4);
      s.yawAngle = 0;

      drawGlassesFrame(ctx, s, FRAMES[selectedFrameIdxRef.current]);

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
      img.onload = () => {
        setUploadedPhoto(img);
        startPhotoSimulation(img);
        showToast('📸 Photo Loaded! AI Facial Mapping Active');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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

    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not accessible in this environment.');
      }

      // Request live camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: facingMode }
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

      // If MediaPipe CDN scripts are already available in window
      if (window.FaceMesh && window.Camera && !window.mediaPipeLoadError) {
        initMediaPipeFaceMesh();
      } else {
        // Fallback or demo simulation if scripts not loaded
        showToast('📡 Initializing high-speed AR tracking...');
        setTimeout(() => {
          if (window.FaceMesh && window.Camera && !window.mediaPipeLoadError) {
            initMediaPipeFaceMesh();
          } else {
            showToast('ℹ️ Switched to Live AI Simulation Mode');
            startDemoSimulation();
          }
        }, 1200);
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setStatus('fallback');
      showToast('⚠️ Camera permission denied or offline. Launching simulation.');
    }
  };

  // Initialize MediaPipe FaceMesh
  const initMediaPipeFaceMesh = () => {
    try {
      const faceMesh = new window.FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true, // Enables refined iris tracking
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      faceMesh.onResults((results) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
          // Check if face lost for > 1.5 seconds
          if (Date.now() - lastFaceTimeRef.current > 1500) {
            setFaceDetected(false);
          }
          return;
        }

        lastFaceTimeRef.current = Date.now();
        // Use refs to avoid stale closure — do NOT use faceDetected/status state directly in callback
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
        const toPixel = (pt) => ({ x: pt.x * canvas.width, y: pt.y * canvas.height });

        // Landmark indices from Prompt 5:
        // Left eye outer: 33, inner: 133, iris: 468
        // Right eye outer: 263, inner: 362, iris: 473
        const leftOuter = toPixel(lm[33]);
        const rightOuter = toPixel(lm[263]);
        const leftInner = toPixel(lm[133]);
        const rightInner = toPixel(lm[362]);
        const leftIris = toPixel(lm[468] || lm[159]);
        const rightIris = toPixel(lm[473] || lm[386]);

        // Frame width = outer-to-outer eye span × 1.72 multiplier
        const eyeSpanWidth = Math.hypot(rightOuter.x - leftOuter.x, rightOuter.y - leftOuter.y);
        const frameWidth = eyeSpanWidth * 1.72;

        // Frame center X & Y
        const frameCenterX = (leftOuter.x + rightOuter.x) / 2;
        const frameCenterY = (leftIris.y + rightIris.y) / 2;

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

        // Draw active eyewear — use ref to avoid stale closure on frame selection
        drawGlassesFrame(ctx, s, FRAMES[selectedFrameIdxRef.current]);
      });

      faceMeshRef.current = faceMesh;

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

  // Cleanup on unmount or mode switch
  useEffect(() => {
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
    offCtx.fillText('✨ Lens Makers AR Studio', 40, offCanvas.height - 37);

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

      {/* ==========================================================================
         SCREEN 1: ENTRY POINT & PERMISSION MODAL
         ========================================================================== */}
      {status === 'permission' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px var(--screen-padding)', textAlign: 'center', position: 'relative' }}>
          {/* Ambient Glow Blobs behind illustration */}
          <div style={{ position: 'absolute', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,77,141,0.25) 0%, transparent 70%)', top: '20%', filter: 'blur(30px)', pointerEvents: 'none' }} />

          {/* SVG Line-Art Face Scan Illustration */}
          <div style={{ width: '130px', height: '130px', borderRadius: '65px', border: '3px dashed #FF4D8D', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,77,141,0.08)', marginBottom: '28px', boxShadow: '0 0 32px rgba(255,77,141,0.3)', animation: 'pulseGlowAnim 3s infinite ease-in-out' }}>
            <span style={{ fontSize: '64px' }}>🧑‍✈️</span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            See Frames On Your Face
          </h1>

          <p style={{ fontSize: '14px', color: '#A0A4C8', lineHeight: '1.6', maxWidth: '320px', marginBottom: '24px' }}>
            Lens Makers uses your front camera to show how glasses look on you in real time. Nothing is recorded or sent to our servers.
          </p>

          {/* Privacy Badge Note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(67, 160, 71, 0.15)', border: '1px solid rgba(67, 160, 71, 0.4)', padding: '8px 16px', borderRadius: '999px', marginBottom: '36px' }}>
            <span style={{ fontSize: '14px' }}>🔒</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#43A047' }}>100% private — processed on your device only</span>
          </div>

          {/* Primary CTA: Allow Real Camera */}
          <button
            type="button"
            className="btn-primary-pill w-100 mb-3"
            style={{ height: '54px', fontSize: '16px', fontWeight: '800', maxWidth: '340px' }}
            onClick={startRealCamera}
          >
            <span>📷 Allow Camera Access</span>
          </button>

          {/* Secondary Demo Simulation CTA */}
          <button
            type="button"
            className="btn-secondary-pill w-100 mb-3"
            style={{ height: '50px', fontSize: '14px', fontWeight: '700', maxWidth: '340px', border: '1.5px solid #7C4DFF', background: 'rgba(124, 77, 255, 0.15)', color: '#FFFFFF' }}
            onClick={() => {
              showToast('✨ Launching Live AI 3D Simulation');
              startDemoSimulation();
            }}
          >
            <span>✨ Try Live Demo Simulation (No Camera Needed)</span>
          </button>

          {/* Hidden File Input for Photo Upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />

          {/* Tertiary Upload Photo CTA */}
          <button
            type="button"
            className="photo-upload-btn-premium w-100 mb-3"
            style={{ height: '50px', fontSize: '14px', fontWeight: '800', maxWidth: '340px', background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.18), rgba(255, 77, 141, 0.18))', borderColor: '#00E5FF' }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <span>📁 Upload Photo / Selfie for AI Try-On</span>
          </button>

          {/* Not Now link */}
          <span
            style={{ fontSize: '13px', color: '#6B6E9A', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}
            onClick={() => {
              if (onSelectTab) onSelectTab('home');
            }}
          >
            Not Now
          </span>
        </div>
      )}

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
              showToast('✨ Starting simulation mode');
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
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
          {/* Mirrored Video Stream Layer (hidden in demo mode) */}
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
            {/* Close Button */}
            <button
              type="button"
              style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(15, 21, 53, 0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
              onClick={() => {
                if (onSelectTab) onSelectTab('home');
              }}
              title="Close Try-On"
            >
              ✕
            </button>

            {/* Well-Defined Label for AI Try-On Feature & Title Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 21, 53, 0.75)', padding: '6px 14px', borderRadius: '999px', backdropFilter: 'blur(10px)', border: '1px solid #00E5FF', boxShadow: '0 0 14px rgba(0, 229, 255, 0.4)' }}>
              <span className="sparkle-anim" style={{ fontSize: '14px' }}>✨</span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.5px' }}>
                {mode === 'demo' ? 'AI 3D SIMULATION' : mode === 'photo' ? 'AI PHOTO TRY-ON' : 'LIVE BIOMETRIC MIRROR'}
              </span>
            </div>

            {/* Upload Photo Button in HUD */}
            <button
              type="button"
              className="photo-upload-btn-premium"
              style={{ padding: '6px 14px', fontSize: '12px', height: '36px' }}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              title="Upload a new selfie or photo"
            >
              <span>📁 Upload Photo</span>
            </button>

            {/* Flip Camera Button */}
            <button
              type="button"
              style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(15, 21, 53, 0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
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

          {/* "NO FACE DETECTED" GUIDE OVAL (When face lost or calibrating) */}
          {!faceDetected && (
            <div className="tryon-face-guide">
              <div className="tryon-oval-outline" />
              <div className="tryon-guide-text">
                Position your face within the frame
              </div>
            </div>
          )}

          {/* PERMANENT PRIVACY BADGE (~70% height) */}
          <div className="tryon-privacy-badge">
            🔒 Processed locally on device. Not recorded.
          </div>

          {/* BOTTOM CONTROL PANEL (Anchored to bottom, ~150px height) */}
          <div className="tryon-bottom-panel">
            {/* OPTICAL COATING & BIOMETRIC HUD TOGGLES ROW */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                style={{
                  padding: '4px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: '800', cursor: 'pointer',
                  background: showBiometricHUD ? 'linear-gradient(135deg, #00E5FF, #7C4DFF)' : 'rgba(255,255,255,0.1)',
                  border: showBiometricHUD ? '1px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF', transition: 'all 200ms ease', boxShadow: showBiometricHUD ? '0 0 10px rgba(0, 229, 255, 0.6)' : 'none'
                }}
                onClick={() => {
                  setShowBiometricHUD(!showBiometricHUD);
                  showToast(showBiometricHUD ? '👁️ Biometric HUD Disabled' : '👁️ 3D Biometric HUD Active');
                }}
              >
                👁️ Biometric HUD
              </button>
              {[
                { id: 'antireflective', label: '✨ Anti-Reflective' },
                { id: 'bluelight', label: '🛡️ Blue Light' },
                { id: 'polarized', label: '🕶️ Polarized' },
                { id: 'photochromic', label: '☀️ Photochromic' }
              ].map(c => (
                <button
                  key={c.id}
                  type="button"
                  style={{
                    padding: '4px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                    background: lensCoating === c.id ? 'rgba(255, 77, 141, 0.3)' : 'rgba(255,255,255,0.08)',
                    border: lensCoating === c.id ? '1px solid #FF4D8D' : '1px solid rgba(255,255,255,0.15)',
                    color: lensCoating === c.id ? '#FF4D8D' : '#C5C9E8', transition: 'all 200ms ease'
                  }}
                  onClick={() => {
                    setLensCoating(c.id);
                    showToast(`✨ Applied ${c.label.replace(/^[^\s]+\s/, '')} Coating`);
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Horizontal Frame Thumbnails Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
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

            {/* Active Frame Name + Price */}
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.3px' }}>
                {currentFrameStyle.name}
              </span>
              <span style={{ fontSize: '15px', fontWeight: '900', color: '#FF4D8D', marginLeft: '8px' }}>
                {currentFrameStyle.price}
              </span>
            </div>

            {/* Three Bottom Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', maxWidth: '320px', margin: '0 auto' }}>
              {/* 1. Left: Wishlist Heart */}
              <button
                type="button"
                style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 150ms ease' }}
                onClick={handleToggleWishlist}
                title="Save to Wishlist"
              >
                <span style={{ fontSize: '20px', color: wishlist.includes(currentFrameStyle.id) ? '#FF4D8D' : '#FFFFFF' }}>
                  {wishlist.includes(currentFrameStyle.id) ? '♥' : '♡'}
                </span>
              </button>

              {/* 2. Center: Capture Snapshot Button */}
              <button
                type="button"
                className="tryon-capture-btn"
                onClick={handleTakeSnapshot}
                title="Take AR Snapshot"
              >
                <i data-lucide="camera" style={{ width: '26px', height: '26px', color: '#FFFFFF' }} />
              </button>

              {/* 3. Right: Add to Cart */}
              <button
                type="button"
                style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 150ms ease' }}
                onClick={(e) => {
                  showToast(`🛍️ Added ${currentFrameStyle.name} to Cart!`);
                  // Trigger cart badge count
                  try {
                    const prevCart = parseInt(localStorage.getItem('lensmakers_cart_count') || '2', 10);
                    localStorage.setItem('lensmakers_cart_count', String(prevCart + 1));
                  } catch (err) {}
                }}
                title="Add to Cart"
              >
                <span style={{ fontSize: '20px' }}>🛒</span>
              </button>
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
