/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 6 - Teachable Machine
 * Train Your Own Model
 */

let classifier;
// model url *** edit link here
const imageModelURL = "https://teachablemachine.withgoogle.com/models/1x-QTBLnF/";

let video;
let flippedVideo;
let label = ""; // to store classifications
let quack;

let style;
let styleReady = false;
let styling = false;
let duckVisible = false;
let styledImg;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
  quack = loadSound("audio/SFX-quack.mov");
}

function setup() {
  createCanvas(320, 260);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  flippedVideo = ml5.flipImage(video);
  classifyVideo();

  style = ml5.styleTransfer("models/scream", () => {
    styleReady = true;
    console.log("style model loaded");
  });
}

function draw() {
  background(0);

  if (duckVisible && styledImg) {
    push();
    translate(width, 0);
    scale(-1, 1); // mirror to match the normal video
    drawingContext.drawImage(styledImg, 0, 0, 320, 240);
    pop();
  } else {
    image(flippedVideo, 0, 0);
  }


  // draw label *** edit label here
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

function mousePressed() {
userStartAudio();
}

// get prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  label = results[0].label; // results in array ordered by confidence

  duckVisible = label === "duck";

  if (label === "duck") {
   if (!quack.isPlaying()) {
    quack.play();
  } 
  startStyle();
  } else {
    quack.stop();
    styledImg = null;
  }

  classifyVideo(); // classify again
}

function startStyle() {
  if (styleReady && !styling) {
    styling = true;
    transferFrame();
  }
}

function transferFrame() {
  if (!duckVisible) {
    styling = false; // duck left, so stop the loop
    return;
  }
  style.transfer(video, gotStyleResult);
}

function gotStyleResult(error, result) {
  if (error) {
    console.error(error);
    styling = false;
    return;
  }
  if (duckVisible) styledImg = result;
  transferFrame(); // ask for the next stylised frame
}