/**
 * Hand Detection Web Worker — MediaPipe WASM (CPU) backend.
 * Classic worker (not module) — uses dynamic import() for MediaPipe.
 */

let landmarker = null;
let processing = false;

async function init() {
  try {
    self.postMessage({ type: 'status', msg: 'loading MediaPipe...' });

    // Dynamic import works in classic workers in modern browsers
    const vision = await Function('return import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/vision_bundle.mjs")')();

    const { FilesetResolver, HandLandmarker } = vision;

    const fs = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
    );

    landmarker = await HandLandmarker.createFromOptions(fs, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
        delegate: 'CPU',
      },
      runningMode: 'IMAGE',
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.4,
    });

    self.postMessage({ type: 'ready' });
  } catch (e) {
    self.postMessage({ type: 'error', msg: String(e) });
  }
}

function processFrame(bitmap) {
  if (!landmarker || processing) {
    bitmap.close();
    return;
  }

  processing = true;

  let result;
  try {
    result = landmarker.detect(bitmap);
  } catch (e) {
    bitmap.close();
    processing = false;
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

      const m = 0.03;
      const xMin = Math.max(0, 1 - rawXMax - m);
      const yMin = Math.max(0, yMinVal - m);
      const xMax = Math.min(1, 1 - rawXMin + m);
      const yMax = Math.min(1, yMaxVal + m);
      const cx = (xMin + xMax) / 2;
      const cy = (yMin + yMax) / 2;

      const wrist = lms[0];
      const midBase = lms[9];
      const dx = -(midBase.x - wrist.x);
      const dy = midBase.y - wrist.y;
      const angle = Math.atan2(dx, -dy) * (180 / Math.PI);

      hands.push({ cx, cy, xMin, yMin, xMax, yMax, angle });
    }

    if (hands.length === 2) {
      hands.sort(function(a, b) { return a.cx - b.cx; });
      hands[0].side = 'ESQUERDA';
      hands[1].side = 'DIREITA';
    } else if (hands.length === 1) {
      hands[0].side = hands[0].cx < 0.5 ? 'ESQUERDA' : 'DIREITA';
    }
  }

  self.postMessage({ type: 'hands', hands: hands });
  processing = false;
}

self.onmessage = function(e) {
  if (e.data.type === 'init') {
    init();
  } else if (e.data.type === 'frame') {
    processFrame(e.data.bitmap);
  }
};
