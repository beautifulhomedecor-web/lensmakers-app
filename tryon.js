/* ============================================
   LENSMAKERS — Virtual Try-On Engine (v3 - True 3D WebGL)
   Real-time AR Glasses overlay using MediaPipe FaceMesh & Three.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- DOM Elements ----
  const tryonModal    = document.getElementById('tryonModal');
  const tryonPermission = document.getElementById('tryonPermission');
  const tryonLive     = document.getElementById('tryonLive');
  const tryonResult   = document.getElementById('tryonResult');
  const tryonLoading  = document.getElementById('tryonLoading');
  const tryonGuide    = document.getElementById('tryonGuide');

  const videoElement  = document.getElementById('tryonVideo');
  const canvasElement = document.getElementById('tryonCanvas');
  const canvasCtx     = canvasElement.getContext('2d');
  const snapshotImg   = document.getElementById('snapshotImg');

  const allowCameraBtn   = document.getElementById('allowCameraBtn');
  const closePermissionBtn = document.getElementById('closePermissionBtn');
  const closeTryonBtn    = document.getElementById('closeTryonBtn');
  const flipCameraBtn    = document.getElementById('flipCameraBtn');
  const captureBtn       = document.getElementById('captureBtn');
  const retakeBtn        = document.getElementById('retakeBtn');
  const closeResultBtn   = document.getElementById('closeResultBtn');
  
  const glassesThumbs    = document.querySelectorAll('.glasses-thumb');
  const liveFrameName    = document.getElementById('liveFrameName');

  // ---- State ----
  let stream = null;
  let faceMesh = null;
  let isVideoPlaying = false;
  let useFrontCamera = true;
  let animationFrameId = null;
  let faceDetected = false;
  
  // Smoothing state (EMA)
  let smooth = null;

  // ---- Three.js Setup ----
  let scene, camera, renderer, glassesModel;

  const initThreeJs = () => {
    if (renderer) return;

    // Create Scene
    scene = new THREE.Scene();

    // Create Camera (Orthographic to match 2D pixel coordinates exactly)
    // We will update dimensions in the render loop
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
    camera.position.z = 1000;

    // Create Renderer with transparent background
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    
    // Add WebGL canvas to the DOM, position it exactly over the video
    // IMPORTANT: Add 'tryon-canvas' class so it inherits the CSS mirror transform!
    renderer.domElement.classList.add('tryon-canvas');
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.objectFit = 'cover';
    renderer.domElement.style.zIndex = '3'; // Above the 2D canvas
    
    // Insert after tryonCanvas
    canvasElement.parentNode.insertBefore(renderer.domElement, canvasElement.nextSibling);

    // Lights for realism
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // --- Procedural 3D Glasses Placeholder ---
    // A beautiful true 3D pair of glasses using Three.js primitives
    glassesModel = new THREE.Group();

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transmission: 0.9, opacity: 1, metalness: 0.1, roughness: 0,
      ior: 1.5, thickness: 0.05, side: THREE.DoubleSide, transparent: true
    });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 1.0 });

    const lensRadius = 0.22;
    const lensRatio = 0.75; // Squish vertically to look like real oval/rectangular glasses
    
    // Lenses
    const lensGeo = new THREE.CylinderGeometry(lensRadius, lensRadius, 0.01, 32);
    lensGeo.rotateX(Math.PI / 2);
    const lLens = new THREE.Mesh(lensGeo, lensMat);
    lLens.position.set(-0.25, 0, 0);
    lLens.scale.set(1, lensRatio, 1);
    glassesModel.add(lLens);
    const rLens = new THREE.Mesh(lensGeo, lensMat);
    rLens.position.set(0.25, 0, 0);
    rLens.scale.set(1, lensRatio, 1);
    glassesModel.add(rLens);

    // Frames
    const frameGeo = new THREE.TorusGeometry(lensRadius, 0.02, 16, 64);
    const lFrame = new THREE.Mesh(frameGeo, frameMat);
    lFrame.position.set(-0.25, 0, 0);
    lFrame.scale.set(1, lensRatio, 1);
    glassesModel.add(lFrame);
    const rFrame = new THREE.Mesh(frameGeo, frameMat);
    rFrame.position.set(0.25, 0, 0);
    rFrame.scale.set(1, lensRatio, 1);
    glassesModel.add(rFrame);

    // Bridge
    const bridgeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.1, 16);
    bridgeGeo.rotateZ(Math.PI / 2);
    const bridge = new THREE.Mesh(bridgeGeo, goldMat);
    glassesModel.add(bridge);

    // Side Arms (Temples) extending backwards into -Z
    const templeLen = 0.6;
    const templeGeo = new THREE.CylinderGeometry(0.015, 0.015, templeLen, 16);
    templeGeo.rotateX(Math.PI / 2);
    const lTemple = new THREE.Mesh(templeGeo, goldMat);
    lTemple.position.set(-0.47, 0, -templeLen / 2);
    glassesModel.add(lTemple);
    const rTemple = new THREE.Mesh(templeGeo, goldMat);
    rTemple.position.set(0.47, 0, -templeLen / 2);
    glassesModel.add(rTemple);

    // Hide initially
    glassesModel.visible = false;
    scene.add(glassesModel);
  };

  // ---- Modal Logic ----
  window.openTryOnModal = () => {
    document.body.classList.add('modal-open');
    tryonModal.classList.remove('hidden');
    tryonPermission.classList.remove('hidden');
    tryonLive.classList.add('hidden');
    tryonResult.classList.add('hidden');
    smooth = null;
    faceDetected = false;
  };

  const closeTryon = () => {
    document.body.classList.remove('modal-open');
    tryonModal.classList.add('hidden');
    stopCamera();
    smooth = null;
    faceDetected = false;
  };
  if (closePermissionBtn) closePermissionBtn.addEventListener('click', closeTryon);
  if (closeTryonBtn) closeTryonBtn.addEventListener('click', closeTryon);
  if (closeResultBtn) closeResultBtn.addEventListener('click', closeTryon);

  // ---- Camera Setup ----
  if (allowCameraBtn) {
    allowCameraBtn.addEventListener('click', async () => {
      tryonPermission.classList.add('hidden');
      tryonLive.classList.remove('hidden');
      tryonLoading.classList.remove('hidden');
      tryonGuide.classList.remove('hidden');
      initThreeJs();
      await startCamera();
    });
  }

  const startCamera = async () => {
    if (stream) stopCamera();
    try {
      // Use higher ideal resolution; mobile browsers will automatically adapt to the best native aspect ratio (e.g. 9:16 portrait)
      const constraints = { 
        video: { 
          facingMode: useFrontCamera ? 'user' : 'environment', 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 } 
        } 
      };
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;

      videoElement.onloadedmetadata = () => {
        videoElement.play();
        isVideoPlaying = true;
        
        // CSS Mirroring for selfie camera
        if (useFrontCamera) {
          videoElement.classList.add('mirrored');
          canvasElement.classList.add('mirrored');
          if (renderer) renderer.domElement.classList.add('mirrored');
        } else {
          videoElement.classList.remove('mirrored');
          canvasElement.classList.remove('mirrored');
          if (renderer) renderer.domElement.classList.remove('mirrored');
        }
        
        initFaceMesh();
      };
    } catch (err) {
      console.error('Camera failed:', err);
      alert('Camera access is required for Virtual Try-On.');
      closeTryon();
    }
  };

  const stopCamera = () => {
    if (stream) { stream.getTracks().forEach(track => track.stop()); stream = null; }
    isVideoPlaying = false;
    if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
    // Do not destroy faceMesh so it opens instantly the next time without reloading the AI model!
  };

  if (flipCameraBtn) {
    flipCameraBtn.addEventListener('click', async () => {
      useFrontCamera = !useFrontCamera;
      smooth = null;
      tryonLoading.classList.remove('hidden');
      await startCamera();
    });
  }

  // ---- MediaPipe Initialization ----
  const initFaceMesh = async () => {
    if (!faceMesh) {
      faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
      faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
      faceMesh.onResults(onResults);
    }

    const trackFrame = async () => {
      if (!isVideoPlaying) return;
      if (videoElement.readyState >= 2) {
        try { await faceMesh.send({ image: videoElement }); } catch (e) {}
      }
      if (isVideoPlaying) animationFrameId = requestAnimationFrame(trackFrame);
    };
    trackFrame();
  };

  // ---- 3D Math & Rendering ----
  const onResults = (results) => {
    // 1. Sync canvas and renderer size to video stream
    const w = videoElement.videoWidth;
    const h = videoElement.videoHeight;
    
    if (canvasElement.width !== w || canvasElement.height !== h) {
      canvasElement.width = w;
      canvasElement.height = h;
      
      // MUST pass false to prevent Three.js from overriding the CSS 100% width/height
      renderer.setSize(w, h, false);
      
      // Update Orthographic Camera bounds (-W/2 to W/2, H/2 to -H/2)
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
    }

    // 2. Draw Video to 2D Canvas (Background)
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, w, h);
    canvasCtx.drawImage(results.image, 0, 0, w, h);
    canvasCtx.restore();

    // 3. Process Face Landmarks for 3D Overlay
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      if (!faceDetected) {
        faceDetected = true;
        tryonGuide.style.opacity = '0';
        setTimeout(() => tryonGuide.classList.add('hidden'), 500);
      }
      if (!tryonLoading.classList.contains('hidden')) tryonLoading.classList.add('hidden');

      const lm = results.multiFaceLandmarks[0];

      // Helper to convert normalized MediaPipe coords to Three.js coordinates
      // Origin (0,0,0) is center of screen. +X is right, +Y is up, +Z is out of screen
      const getV3 = (idx) => {
        const p = lm[idx];
        return new THREE.Vector3(
          (p.x * w) - w/2,
          -((p.y * h) - h/2),
          -p.z * w // MediaPipe -z is closer to camera. Three.js +z is closer.
        );
      };

      // Key Landmarks
      const leftEye = getV3(33);    // Physical left eye (right side of unmirrored screen)
      const rightEye = getV3(263);  // Physical right eye (left side)
      const noseTop = getV3(6);
      const chin = getV3(152);      // Bottom of the face (much better for stable pitch than nose tip)
      const leftTemple = getV3(234);
      const rightTemple = getV3(454);

      // --- Calculate 3D Orientation Matrix ---
      const center = new THREE.Vector3().addVectors(leftEye, rightEye).multiplyScalar(0.5);
      
      // X Axis (Right-pointing vector from rightEye to leftEye)
      // Since leftEye is on the right (+X), leftEye - rightEye points +X
      const xAxis = new THREE.Vector3().subVectors(leftEye, rightEye).normalize();
      
      // Y Axis Temp (Up-pointing vector from chin to center of eyes)
      // Using the chin creates a much flatter facial plane, avoiding artificial upward tilt from the nose tip
      const yAxisTemp = new THREE.Vector3().subVectors(center, chin).normalize();
      
      // Z Axis (Out of face towards camera)
      // X x Y = Z (Right x Up = Out)
      const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxisTemp).normalize();
      
      // True Orthogonal Y Axis (Z x X = Y)
      const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();

      // Create Quaternion from Rotation Matrix
      const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

      // --- Calculate Position & Scale ---
      // Scale based on temple distance
      const templeDist = leftTemple.distanceTo(rightTemple);
      const glassesWidth = templeDist * 1.15; // Slightly wider than temples

      // Offset slightly down the nose from the eyes
      const noseOffset = new THREE.Vector3().subVectors(noseTop, center).multiplyScalar(0.15);
      const position = center.clone().add(noseOffset);
      
      // Push the glasses forward along the face normal (zAxis) so they rest on the nose/cheeks without clipping!
      position.add(zAxis.clone().multiplyScalar(glassesWidth * 0.08));

      // --- Smooth with EMA ---
      const alpha = 0.35;
      if (!smooth) {
        smooth = { pos: position.clone(), quat: quaternion.clone(), scale: glassesWidth };
      } else {
        smooth.pos.lerp(position, alpha);
        smooth.quat.slerp(quaternion, alpha);
        smooth.scale += (glassesWidth - smooth.scale) * alpha;
      }

      // --- Apply to 3D Model ---
      glassesModel.position.copy(smooth.pos);
      glassesModel.quaternion.copy(smooth.quat);
      glassesModel.scale.setScalar(smooth.scale);
      glassesModel.visible = true;

    } else {
      faceDetected = false;
      smooth = null;
      glassesModel.visible = false;
      if (tryonGuide.classList.contains('hidden')) {
        tryonGuide.classList.remove('hidden');
        tryonGuide.style.opacity = '1';
      }
    }

    // 4. Render the 3D Scene
    renderer.render(scene, camera);
  };

  // ---- Capture Photo ----
  if (captureBtn) {
    captureBtn.addEventListener('click', () => {
      // Create a combined snapshot canvas
      const snapCanvas = document.createElement('canvas');
      snapCanvas.width = canvasElement.width;
      snapCanvas.height = canvasElement.height;
      const snapCtx = snapCanvas.getContext('2d');

      // Draw background video canvas
      if (useFrontCamera) {
        snapCtx.translate(snapCanvas.width, 0);
        snapCtx.scale(-1, 1);
      }
      snapCtx.drawImage(canvasElement, 0, 0);
      
      // Draw 3D overlay (WebGL renderer dom element)
      snapCtx.drawImage(renderer.domElement, 0, 0);

      const dataURL = snapCanvas.toDataURL('image/jpeg', 0.92);
      snapshotImg.src = dataURL;

      tryonLive.classList.add('hidden');
      tryonResult.classList.remove('hidden');
    });
  }

  // ---- Glasses Thumbnail Selection ----
  // Since we are using a procedural 3D model for now, we just update the UI state.
  // In a production environment, you would use a GLTFLoader to swap the 3D model here.
  if (glassesThumbs) {
    glassesThumbs.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        glassesThumbs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        const name = e.currentTarget.dataset.name;
        const price = e.currentTarget.dataset.price;
        if (liveFrameName) liveFrameName.textContent = `${name} — ${price}`;
        
        // Optional: Change the color of the procedural 3D glasses based on selection
        if (glassesModel && glassesModel.children.length >= 4) {
          const frameMat = glassesModel.children[2].material; // Left frame
          if (name.includes('Aviator')) frameMat.color.setHex(0x111111);
          else if (name.includes('Tortoise')) frameMat.color.setHex(0x5c4033);
          else if (name.includes('Retro')) frameMat.color.setHex(0x333333);
          else if (name.includes('Cat-Eye')) frameMat.color.setHex(0x800000);
        }
      });
    });
  }

  // ---- Retake Photo ----
  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      tryonResult.classList.add('hidden');
      tryonLive.classList.remove('hidden');
    });
  }
});
