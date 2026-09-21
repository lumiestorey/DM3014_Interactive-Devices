/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 6 - Teachable Machine
 * Train Your Own Model
 */

let classifier;
// model url *** edit link here
const imageModelURL = "https://teachablemachine.withgoogle.com/models/L7hqJdJ8p/";

let video;
let flippedVideo;
let label = ""; // to store classifications
let quack;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
  //quack = loadSound("audio/SFX-quack.mp3");
}

function setup() {
  createCanvas(320, 260);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  flippedVideo = ml5.flipImage(video);
  classifyVideo();
}

function draw() {
  background(0);

  // draw video
  image(flippedVideo, 0, 0);

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

  if (label === "duck") {
    quack.play();
  } else {
    quack.stop();
  }

  classifyVideo(); // classify again
}
