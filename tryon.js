document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const tryonModal = document.getElementById('tryonModal');
  const tryonPermission = document.getElementById('tryonPermission');
  const tryonLive = document.getElementById('tryonLive');
  const tryonResult = document.getElementById('tryonResult');
  const tryonLoading = document.getElementById('tryonLoading');
  const tryonGuide = document.getElementById('tryonGuide');
  
  const videoElement = document.getElementById('tryonVideo');
  const canvasElement = document.getElementById('tryonCanvas');
  const canvasCtx = canvasElement.getContext('2d');
  const snapshotImg = document.getElementById('snapshotImg');
  
  const allowCameraBtn = document.getElementById('allowCameraBtn');
  const closePermissionBtn = document.getElementById('closePermissionBtn');
  const closeTryonBtn = document.getElementById('closeTryonBtn');
  const flipCameraBtn = document.getElementById('flipCameraBtn');
  const captureBtn = document.getElementById('captureBtn');
  const retakeBtn = document.getElementById('retakeBtn');
  const closeResultBtn = document.getElementById('closeResultBtn');
  
  const glassesThumbs = document.querySelectorAll('.glasses-thumb');
  const liveFrameName = document.getElementById('liveFrameName');

  // State
  let stream = null;
  let faceMesh = null;
  let isVideoPlaying = false;
  let currentGlassesImg = new Image();
  currentGlassesImg.src = 'images/premium_frame_1.png';
  let useFrontCamera = true;
  
  let animationFrameId = null;

  // Open Modal (called from app.js)
  window.openTryOnModal = () => {
    document.body.classList.add('modal-open');
    tryonModal.classList.remove('hidden');
    tryonPermission.classList.remove('hidden');
    tryonLive.classList.add('hidden');
    tryonResult.classList.add('hidden');
  };

  // Close Modal
  const closeTryon = () => {
    document.body.classList.remove('modal-open');
    tryonModal.classList.add('hidden');
    stopCamera();
  };
  closePermissionBtn.addEventListener('click', closeTryon);
  closeTryonBtn.addEventListener('click', closeTryon);
  closeResultBtn.addEventListener('click', closeTryon);

  // Setup Camera
  allowCameraBtn.addEventListener('click', async () => {
    tryonPermission.classList.add('hidden');
    tryonLive.classList.remove('hidden');
    tryonLoading.classList.remove('hidden');
    await startCamera();
  });

  const startCamera = async () => {
    if (stream) stopCamera();
    try {
      const constraints = {
        video: {
          facingMode: useFrontCamera ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;
      
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        isVideoPlaying = true;
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        initFaceMesh();
      };
    } catch (err) {
      console.error("Camera access denied or failed:", err);
      alert("Camera access is required for Virtual Try-On. Please allow it in your browser settings.");
      closeTryon();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    isVideoPlaying = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (faceMesh) {
      faceMesh.close();
      faceMesh = null;
    }
  };

  flipCameraBtn.addEventListener('click', async () => {
    useFrontCamera = !useFrontCamera;
    tryonLoading.classList.remove('hidden');
    await startCamera();
  });

  // Setup MediaPipe FaceMesh
  const initFaceMesh = async () => {
    if (!faceMesh) {
      faceMesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      faceMesh.onResults(onResults);
    }
    
    // Start tracking loop
    const trackFrame = async () => {
      if (isVideoPlaying && videoElement.videoWidth > 0) {
        await faceMesh.send({ image: videoElement });
      }
      animationFrameId = requestAnimationFrame(trackFrame);
    };
    trackFrame();
  };

  // Process Results & Draw
  const onResults = (results) => {
    // Hide loading once we get first result
    if (!tryonLoading.classList.contains('hidden')) {
      tryonLoading.classList.add('hidden');
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Draw video to canvas (mirrored if front camera)
    if (useFrontCamera) {
      canvasCtx.translate(canvasElement.width, 0);
      canvasCtx.scale(-1, 1);
    }
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      // Face detected! Hide guide
      if (!tryonGuide.classList.contains('hidden')) tryonGuide.classList.add('hidden');

      const landmarks = results.multiFaceLandmarks[0];
      
      // Landmark indices
      const LEFT_EYE = 133;
      const RIGHT_EYE = 362;
      const NOSE_BRIDGE = 6;
      
      const pLeft = landmarks[LEFT_EYE];
      const pRight = landmarks[RIGHT_EYE];
      const pNose = landmarks[NOSE_BRIDGE];

      const w = canvasElement.width;
      const h = canvasElement.height;
      
      const leftX = pLeft.x * w;
      const leftY = pLeft.y * h;
      const rightX = pRight.x * w;
      const rightY = pRight.y * h;
      const noseX = pNose.x * w;
      const noseY = pNose.y * h;

      // 3D Scale & Rotation parameters
      const eyeDist = Math.sqrt(Math.pow(rightX - leftX, 2) + Math.pow(rightY - leftY, 2));
      const targetWidth = eyeDist * 2.2;
      const targetHeight = targetWidth * (currentGlassesImg.height / currentGlassesImg.width);
      
      const targetRoll = Math.atan2(rightY - leftY, rightX - leftX);
      const targetYaw = Math.atan2(pRight.z - pLeft.z, pRight.x - pLeft.x);
      
      const eyeCenterY = (pLeft.y + pRight.y) / 2;
      const eyeCenterZ = (pLeft.z + pRight.z) / 2;
      const targetPitch = Math.atan2(pNose.z - eyeCenterZ, pNose.y - eyeCenterY);

      // Apply Exponential Moving Average (EMA) Smoothing
      if (!window.smoothedTryon) {
          window.smoothedTryon = { x: noseX, y: noseY, w: targetWidth, h: targetHeight, roll: targetRoll, yaw: targetYaw, pitch: targetPitch };
      }
      const alpha = 0.4;
      const s = window.smoothedTryon;
      s.x += (noseX - s.x) * alpha;
      s.y += (noseY - s.y) * alpha;
      s.w += (targetWidth - s.w) * alpha;
      s.h += (targetHeight - s.h) * alpha;
      s.roll += (targetRoll - s.roll) * alpha;
      s.yaw += (targetYaw - s.yaw) * alpha;
      s.pitch += (targetPitch - s.pitch) * alpha;

      // Render glasses with 3D Simulation
      canvasCtx.translate(s.x, s.y);
      canvasCtx.rotate(s.roll);
      
      // Simulate 3D Yaw & Pitch via Transform Matrix (Scale & Skew)
      const scaleX = Math.max(0.6, Math.cos(s.yaw));
      const skewY = Math.tan(s.yaw) * 0.15;
      
      const scaleY = Math.max(0.6, Math.cos(s.pitch));
      const skewX = Math.tan(s.pitch) * 0.15;

      canvasCtx.transform(scaleX, skewY, skewX, scaleY, 0, 0);
      
      canvasCtx.shadowColor = 'rgba(0,0,0,0.5)';
      canvasCtx.shadowBlur = 20;
      canvasCtx.shadowOffsetY = 15;
      
      canvasCtx.drawImage(currentGlassesImg, -s.w / 2, -s.h / 2, s.w, s.h);
    } else {
      // No face detected, show guide
      if (tryonGuide.classList.contains('hidden')) tryonGuide.classList.remove('hidden');
    }
    
    canvasCtx.restore();
  };

  // Handle Thumbnail Selection
  glassesThumbs.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      // Update UI
      glassesThumbs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      liveFrameName.textContent = `${e.target.dataset.name} — ${e.target.dataset.price}`;
      
      // Update Glasses Image
      currentGlassesImg.src = e.target.dataset.model;
    });
  });

  // Capture Photo
  captureBtn.addEventListener('click', () => {
    // Save current canvas state to image
    const dataURL = canvasElement.toDataURL('image/jpeg', 0.9);
    snapshotImg.src = dataURL;
    
    // Switch to result view
    tryonLive.classList.add('hidden');
    tryonResult.classList.remove('hidden');
  });

  // Retake Photo
  retakeBtn.addEventListener('click', () => {
    tryonResult.classList.add('hidden');
    tryonLive.classList.remove('hidden');
  });
});
