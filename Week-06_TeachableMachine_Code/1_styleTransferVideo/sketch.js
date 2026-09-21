/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 6 - Teachable Machine
 * Style Transfer Video
 */

let style;
let video;
let styledImg;

let modelReady = false;
let videoReady = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  waitForVideo();

  // 'wave' and 'udnie' are pretrained styles hosted in ml5's data repo
  // *** swap in other styles by downloading from
  // github.com/ml5js/ml5-data-and-training/tree/master/models/style-transfer
  style = ml5.styleTransfer("models/wave", () => {
    modelReady = true;
    tryStart();
  });
}

function waitForVideo() {
  if (video.elt.videoWidth > 0 && video.elt.videoHeight > 0) {
    videoReady = true;
    tryStart();
  } else {
    requestAnimationFrame(waitForVideo);
  }
}

function tryStart() {
  if (modelReady && videoReady) {
    transferFrame();
  }
}

function transferFrame() {
  style.transfer(video, gotResult);
}

function gotResult(error, result) {
  if (error) {
    console.error(error);
    return;
  }
  styledImg = result;
  transferFrame(); // ask for the next stylised frame
}

function draw() {
  background(0);

  if (!video) {
    fill(255);
    textAlign(CENTER, CENTER);
    text(
      "No camera available — check permissions and that\nyou're on http(s):// or localhost.",
      width / 2,
      height / 2
    );
    return;
  }

  if (styledImg) {
    drawingContext.drawImage(styledImg, 0, 0, width, height);
  } else {
    fill(255);
    textAlign(CENTER, CENTER);
    text("Loading…", width / 2, height / 2);
  }
}
