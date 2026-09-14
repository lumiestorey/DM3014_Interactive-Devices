/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 5 - Computer Vision
 * Colour Tracking
 */

var video;
var target = [];
var threshold = 25;

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  noStroke();
}

function draw() {
  background(0);
  image(video, 0, 0);

  noStroke();
  fill(0);
  text("Threshold = ", 10, 20);
  text(threshold, 80, 20);

  for (var i = 0; i < target.length; i++) {
    text(
      "color " +
        i +
        ": " +
        target[i].red +
        ", " +
        target[i].green +
        ", " +
        target[i].blue,
      10,
      40 + i * 20
    );

    video.loadPixels();

    var closestX = 0;
    var closestY = 0;

    for (var x = 0; x < video.width; x += 3) {
      for (var y = 0; y < video.height; y += 3) {
        var index = (x + y * video.width) * 4;
        var redSource = video.pixels[index + 0];
        var greenSource = video.pixels[index + 1];
        var blueSource = video.pixels[index + 2];

        var d = dist(
          redSource,
          greenSource,
          blueSource,
          target[i].red,
          target[i].green,
          target[i].blue
        );

        if (d < threshold) {
          target[i].avgX += x;
          target[i].avgY += y;
          target[i].count++;
        }
      }
    }

    if (target[i].count > 0) {
      target[i].avgX = target[i].avgX / target[i].count;
      target[i].avgY = target[i].avgY / target[i].count;

      push();
      stroke(0);
      strokeWeight(4);
      fill(target[i].rgb);
      ellipse(target[i].avgX, target[i].avgY, 16, 16);
      pop();

      text(i, target[i].avgX + 40, target[i].avgY + 7.5);
      text("ID :", target[i].avgX + 20, target[i].avgY + 7.5);
    }

    target[i].reset();
  }
}

function mousePressed() {
  target.push(new TargetColor(video.get(mouseX, mouseY)));
}

function keyTyped() {
  if (key === "i") {
    threshold += 2.5;
  } else if (key === "d") {
    threshold -= 2.5;
  }
  if (key === "r") {
    target = [];
  }
}

function TargetColor(_color) {
  this.rgb = _color;
  this.red = red(_color);
  this.green = green(_color);
  this.blue = blue(_color);

  this.avgX = 0;
  this.avgY = 0;
  this.count = 0;

  this.reset = function () {
    this.avgX = 0;
    this.avgY = 0;
    this.count = 0;
  };
}
