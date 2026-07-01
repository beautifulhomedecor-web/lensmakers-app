/**
 * Lensmaker - Virtual Try-On
 * Uses MediaPipe Face Mesh to overlay glasses in real-time via webcam.
 *
 * HTML requirements:
 *   <video id="input-video" playsinline style="display:none;"></video>
 *   <canvas id="output-canvas"></canvas>
 *   <img id="glasses-img" src="glasses.png" style="display:none;" crossorigin="anonymous" />
 *
 * CDN requirements (load before this script):
 *   @mediapipe/camera_utils
 *   @mediapipe/drawing_utils
 *   @mediapipe/face_mesh
 */

// ─── Constants ───────────────────────────────────────────────────────────────

/**
 * MediaPipe landmark indices used for glasses placement.
 *
 * Face Mesh gives 468 landmarks. Key ones for eyewear:
 *   33  = left eye outer corner  (from user's perspective: their right)
 *   263 = right eye outer corner (from user's perspective: their left)
 *   168 = nose bridge (mid-point between eyes, on nose)
 *   197 = nose tip area (used as depth anchor)
 *
 * Reference: https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png
 */
const LM = {
  LEFT_EYE_OUTER: 33,
  RIGHT_EYE_OUTER: 263,
  NOSE_BRIDGE: 168,
  LEFT_EYE_INNER: 133,
  RIGHT_EYE_INNER: 362,
};

/**
 * How much wider than the eye-to-eye span to make the glasses frame.
 */
const GLASSES_WIDTH_SCALE = 1.28;

/**
 * Vertical offset: move glasses up relative to the eye-center line.
 * Positive = move up (as fraction of glasses height).
 */
const GLASSES_VERTICAL_OFFSET_RATIO = 0.25;

/**
 * Aspect ratio of your glasses PNG (width / height).
 */
const GLASSES_ASPECT_RATIO = 2.1;

// ─── State ───────────────────────────────────────────────────────────────────

let glassesImage = null;
let isRunning = false;
let camera = null;
let faceDetected = false;

// ─── Init ─────────────────────────────────────────────────────────────────────

/**
 * Entry point. Call this from your page (e.g. button click or DOMContentLoaded).
 * @param {string} [glassesImgId="glasses-img"] - ID of the <img> with the glasses PNG
 */
function initTryOn(glassesImgId = "glasses-img") {
  // Reuse existing camera instance to prevent leakages and multi-stream crashes
  if (camera) {
    resumeTryOn();
    return;
  }

  const videoEl = document.getElementById("tryonVideo");
  const canvasEl = document.getElementById("tryonCanvas");
  const imgEl = document.getElementById(glassesImgId);

  if (!videoEl || !canvasEl || !imgEl) {
    console.error("[Lensmaker] Missing required elements: #tryonVideo, #tryonCanvas, or #" + glassesImgId);
    return;
  }

  glassesImage = imgEl;

  // ── Set up MediaPipe Face Mesh ──────────────────────────────────────────────
  const faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: false, // Turned off to massively boost mobile performance
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults((results) => onFaceMeshResults(results, canvasEl));

  // ── Set up Camera ───────────────────────────────────────────────────────────
  camera = new Camera(videoEl, {
    onFrame: async () => {
      await faceMesh.send({ image: videoEl });
    },
    facingMode: 'user' // Let device pick optimal mobile resolution to prevent rotation bugs
  });

  camera.start().then(() => {
    isRunning = true;
    console.log("[Lensmaker] Camera started.");
  }).catch((err) => {
    console.error("[Lensmaker] Camera error:", err);
    showError(canvasEl, "Camera access denied. Please allow webcam permission.");
  });
}

// ─── Core: Draw Frame ─────────────────────────────────────────────────────────

/**
 * Called on every frame by MediaPipe.
 * Draws the webcam feed + glasses overlay onto the canvas.
 */
function onFaceMeshResults(results, canvasEl) {
  const ctx = canvasEl.getContext("2d");
  const { width, height } = results.image;

  if (canvasEl.width !== width) {
    canvasEl.width = width;
    canvasEl.height = height;
  }

  // 1. Draw the raw webcam frame
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Mirror the canvas so it feels like looking in a mirror
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(results.image, 0, 0, width, height);
  ctx.restore();

  // 2. If face detected, draw glasses
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    if (!faceDetected) {
      faceDetected = true;
      const tryonGuide = document.getElementById("tryonGuide");
      if (tryonGuide) {
        tryonGuide.style.opacity = '0';
        setTimeout(() => tryonGuide.classList.add('hidden'), 500);
      }
    }
    const tryonLoading = document.getElementById("tryonLoading");
    if (tryonLoading && !tryonLoading.classList.contains('hidden')) {
      tryonLoading.classList.add('hidden');
    }

    const landmarks = results.multiFaceLandmarks[0];
    drawGlasses(ctx, landmarks, width, height);
  }
}

// ─── Core: Glasses Overlay ───────────────────────────────────────────────────

/**
 * Calculates glasses position/size/rotation from landmarks and draws the PNG.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} landmarks - Array of {x, y, z} objects (normalized 0–1)
 * @param {number} W - Canvas width in px
 * @param {number} H - Canvas height in px
 */
function drawGlasses(ctx, landmarks, W, H) {
  if (!glassesImage || !glassesImage.complete) return;

  // ── Step 1: Get key pixel coordinates ──────────────────────────────────────
  // MediaPipe gives normalized coords (0–1). Multiply by canvas size.
  // Because we mirrored the canvas with scale(-1,1), we must mirror X too.
  const lm = (idx) => {
    const pt = landmarks[idx];
    return {
      x: (1 - pt.x) * W,  // mirror X to match the flipped canvas
      y: pt.y * H,
    };
  };

  const leftEyeOuter  = lm(LM.LEFT_EYE_OUTER);
  const rightEyeOuter = lm(LM.RIGHT_EYE_OUTER);
  const noseBridge    = lm(LM.NOSE_BRIDGE);

  // ── Step 2: Calculate glasses center (nose bridge midpoint) ────────────────
  const centerX = noseBridge.x;
  const centerY = noseBridge.y;

  // ── Step 3: Calculate glasses width from eye span ──────────────────────────
  const eyeSpan = Math.hypot(
    rightEyeOuter.x - leftEyeOuter.x,
    rightEyeOuter.y - leftEyeOuter.y
  );
  const glassesWidth = eyeSpan * GLASSES_WIDTH_SCALE;
  const glassesHeight = glassesWidth / GLASSES_ASPECT_RATIO;

  // ── Step 4: Calculate rotation & 360° Perspective Distortion ───────────────
  let angle = Math.atan2(
    rightEyeOuter.y - leftEyeOuter.y,
    rightEyeOuter.x - leftEyeOuter.x
  );

  // Bulletproof fix: If the math flips 180-degrees due to mirroring, force it upright
  if (Math.abs(angle) > Math.PI / 2) {
    angle = angle > 0 ? angle - Math.PI : angle + Math.PI;
  }

  // Calculate Head Turn (Yaw) by comparing distance from eyes to nose bridge
  const leftDist = noseBridge.x - leftEyeOuter.x;
  const rightDist = rightEyeOuter.x - noseBridge.x;
  const totalDist = leftDist + rightDist;
  
  // -1 (looking left) to +1 (looking right)
  // Ensure we don't divide by zero
  const yawRatio = totalDist > 0 ? (rightDist - leftDist) / totalDist : 0;
  
  // Dynamically compress width to fake 3D rotation (Max 35% compression at full profile)
  const compression = Math.max(0.65, 1 - (Math.abs(yawRatio) * 0.35));
  const finalGlassesWidth = glassesWidth * compression;
  
  // Nudge the glasses slightly toward the direction the face is turning (bridge depth)
  const nudgeX = yawRatio * (glassesWidth * 0.15);

  // ── Step 5: Draw ───────────────────────────────────────────────────────────
  ctx.save();

  // Move to glasses center, rotate, then draw centered
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);

  // Shift glasses up so they sit on the eyes, not the nose
  const verticalOffset = glassesHeight * GLASSES_VERTICAL_OFFSET_RATIO;

  // Fix white background on images by using multiply blending mode
  ctx.globalCompositeOperation = 'multiply';

  ctx.drawImage(
    glassesImage,
    (-finalGlassesWidth / 2) + nudgeX,   // x: apply perspective translation nudge
    -glassesHeight / 2 - verticalOffset, // y: shift up onto eyes
    finalGlassesWidth,                   // w: apply dynamic width compression
    glassesHeight                        // h: keep height constant to simulate 3D rotation
  );

  ctx.restore();
}

// ─── Glasses Switcher ────────────────────────────────────────────────────────

/**
 * Swap the glasses PNG at runtime (e.g. when user clicks a different frame).
 * @param {string} imageSrc - URL or path to the new glasses PNG
 */
function setGlasses(imageSrc) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => { glassesImage = img; };
  img.onerror = () => { console.error("[Lensmaker] Failed to load glasses image:", imageSrc); };
  img.src = imageSrc;
}

// ─── Controls ────────────────────────────────────────────────────────────────

/** Stop the webcam and face tracking. */
function stopTryOn() {
  if (camera) {
    camera.stop();
    isRunning = false;
    console.log("[Lensmaker] Camera stopped.");
  }
}

/** Resume after stopping. */
function resumeTryOn() {
  if (camera && !isRunning) {
    camera.start();
    isRunning = true;
  }
}

// ─── Error display ───────────────────────────────────────────────────────────

function showError(canvasEl, message) {
  const ctx = canvasEl.getContext("2d");
  canvasEl.width = 640;
  canvasEl.height = 360;
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, 640, 360);
  ctx.fillStyle = "#ff6b6b";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(message, 320, 180);
}

// Auto-init removed. Controlled by app.js.
