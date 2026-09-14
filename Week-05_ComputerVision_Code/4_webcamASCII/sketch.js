/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 5 - Computer Vision
 * Webcam ASCII
 */

let capture;
let letters = " .,iu<3"; // *** change letterset
let charW = 8;
let charH = 12;

function setup() {
  createCanvas(640, 480);
  fill("#38FFE8"); // *** change letterset colour

  capture = createCapture(VIDEO);
  capture.size(width / charW, height / charH);
  capture.hide();
}

function draw() {
  background("#F538FF"); // *** change background colour

  capture.loadPixels();
  translate(0, 9);
  for (let y = 0; y < capture.height; y++) {
    for (let x = 0; x < capture.width; x++) {
      let pix = (x + y * capture.width) * 4;
      let col = capture.pixels.slice(pix, pix + 3);

      let lum = col[0] + col[1] + col[2];
      let tone = map(lum, 0, 765, 0, letters.length - 1);
      let letter = letters.charAt(tone);

      text(letter, x * charW, y * charH);
    }
  }
}
