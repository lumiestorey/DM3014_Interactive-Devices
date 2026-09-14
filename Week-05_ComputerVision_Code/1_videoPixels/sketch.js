/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 5 - Computer Vision
 * Video Pixels
 */

let video;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
}

function draw() {
  image(video, 0, 0, width, height);
  video.loadPixels();

  let r = video.pixels[0];
  let g = video.pixels[1];
  let b = video.pixels[2];

  fill(r, g, b);
  noStroke();
  ellipse(mouseX, mouseY, 30, 30);
  console.log(r, g, b);
}
