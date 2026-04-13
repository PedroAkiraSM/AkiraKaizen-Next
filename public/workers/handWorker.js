/**
 * Hand Tracking Web Worker
 * Runs MediaPipe HandLandmarker off the main thread using OffscreenCanvas.
 * Main thread sends video frames, worker returns hand data.
 */

let landmarker = null;
let ready = false;
let lastTimestamp = -1;

// Load MediaPipe dynamically
async function initMediaPipe() {
  const vision = await import(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs'
  );

  const { FilesetResolver, HandLandmarker } = vision;

  const filesetResolver = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );

  landmarker = await HandLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numHands: 2,
    minHandDetectionConfidence: 0.55,
    minHandPresenceConfidence: 0.55,
    minTrackingConfidence: 0.45,
  });

  // Warmup
  ready = true;
  self.postMessage({ type: 'ready' });
}

function processFrame(bitmap, timestamp) {
  if (!ready || !landmarker || timestamp <= lastTimestamp) {
    bitmap.close();
    return;
  }
  lastTimestamp = timestamp;

  let result;
  try {
    result = landmarker.detectForVideo(bitmap, timestamp);
  } catch (e) {
    bitmap.close();
    return;
  }
  bitmap.close();

  const hands = [];
  if (result.landmarks) {
    for (let i = 0; i < result.landmarks.length; i++) {
      const lms = result.landmarks[i];

      let rawXMin = 1, rawXMax = 0, yMinVal = 1, yMaxVal = 0;
      for (let j = 0; j < lms.length; j++) {
        const lx = lms[j].x, ly = lms[j].y;
        if (lx < rawXMin) rawXMin = lx;
        if (lx > rawXMax) rawXMax = lx;
        if (ly < yMinVal) yMinVal = ly;
        if (ly > yMaxVal) yMaxVal = ly;
      }

      // Mirror X (front camera)
      const margin = 0.03;
      const xMin = Math.max(0, 1 - rawXMax - margin);
      const yMin = Math.max(0, yMinVal - margin);
      const xMax = Math.min(1, 1 - rawXMin + margin);
      const yMax = Math.min(1, yMaxVal + margin);

      const cx = (xMin + xMax) / 2;
      const cy = (yMin + yMax) / 2;

      // Angle from wrist to middle finger base (mirrored)
      const wrist = lms[0];
      const midBase = lms[9];
      const dx = -(midBase.x - wrist.x);
      const dy = midBase.y - wrist.y;
      const angle = Math.atan2(dx, -dy) * (180 / Math.PI);

      hands.push({ cx, cy, xMin, yMin, xMax, yMax, angle });
    }

    // Sort by X position: leftmost = ESQUERDA
    if (hands.length === 2) {
      hands.sort((a, b) => a.cx - b.cx);
      hands[0].side = 'ESQUERDA';
      hands[1].side = 'DIREITA';
    } else if (hands.length === 1) {
      hands[0].side = hands[0].cx < 0.5 ? 'ESQUERDA' : 'DIREITA';
    }
  }

  self.postMessage({ type: 'hands', hands });
}

self.onmessage = (e) => {
  if (e.data.type === 'init') {
    initMediaPipe();
  } else if (e.data.type === 'frame') {
    processFrame(e.data.bitmap, e.data.timestamp);
  }
};
