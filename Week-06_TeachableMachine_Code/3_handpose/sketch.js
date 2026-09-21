/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 6 - Teachable Machine
 * Handpose
 * Locates 21 keypoints per detected hand in the live webcam feed.
 * Detects 4 signals: open hand, pointing 1 finger, peace sign, thumbs up.
 * Uses raw geometry, no model training involved.
 */

let handpose;
let video;
let predictions = [];
let currentGesture = "-";

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", (results) => {
    predictions = results;
    currentGesture =
      predictions.length > 0 ? detectGesture(predictions[0].landmarks) : "-";
  });
}

function modelReady() {
  console.log("handpose ready");
}

function draw() {
  background(0);

  // Mirrored video feed & drawn points
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  noStroke();
  fill(0, 255, 0);
  for (let hand of predictions) {
    for (let [x, y, z] of hand.landmarks) {
      circle(x, y, 8);
    }
  }
  pop();

  fill(255);
  textSize(28);
  textAlign(LEFT, TOP);
  text(currentGesture, 20, 20);
}

// 0 = wrist, 4 points per finger, each finger ordered base -> tip.
const FINGERS = {
  thumb: { tip: 4, pip: 2 },
  index: { tip: 8, pip: 6 },
  middle: { tip: 12, pip: 10 },
  ring: { tip: 16, pip: 14 },
  pinky: { tip: 20, pip: 18 },
};

function dist2D(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

// Finger considered extended when tip sits further from wrist than middle joint.
function isExtended(landmarks, tipIdx, pipIdx) {
  const wrist = landmarks[0];
  return (
    dist2D(landmarks[tipIdx], wrist) > dist2D(landmarks[pipIdx], wrist) * 1.15
  );
}

function detectGesture(landmarks) {
  const thumb = isExtended(landmarks, FINGERS.thumb.tip, FINGERS.thumb.pip);
  const index = isExtended(landmarks, FINGERS.index.tip, FINGERS.index.pip);
  const middle = isExtended(landmarks, FINGERS.middle.tip, FINGERS.middle.pip);
  const ring = isExtended(landmarks, FINGERS.ring.tip, FINGERS.ring.pip);
  const pinky = isExtended(landmarks, FINGERS.pinky.tip, FINGERS.pinky.pip);

  const extendedCount = [thumb, index, middle, ring, pinky].filter(
    Boolean
  ).length;

  if (index && middle && !ring && !pinky) return "Peace";
  if (index && !middle && !ring && !pinky) return "Pointing";
  if (thumb && !index && !middle && !ring && !pinky) return "Thumbs Up";
  if (extendedCount >= 4) return "Open Hand";
  return "Unknown";
}
