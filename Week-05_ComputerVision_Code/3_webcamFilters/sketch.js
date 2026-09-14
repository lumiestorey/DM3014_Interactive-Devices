/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 5 - Computer Vision
 * Webcam Filters
 */

var video;
var boxWidth = 0;
var boxHeight = 0;
var sliderMode;
var sliderPixelSize;

let font;

function setup() {
  createCanvas(640, 460);
  noStroke();
  textSize(12);

  //setup fonts
  font = loadFont('/6_fonts/Gaegu-Regular.ttf');
  textFont(font);
  textSize(32);
  textAlign(CENTER, CENTER);

  // setup for webcam
  pixelDensity(1);
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // setup for sliders
  sliderMode = createSlider(0, 2, 0, 1);
  sliderMode.position(668, 70);
  sliderMode.style("width", "240px");

  sliderPixelSize = createSlider(2, 20, 0);
  sliderPixelSize.position(668, 140);
  sliderPixelSize.style("width", "240px");

  sliderShape = createSlider(0, 3, 0, 1);
  sliderShape.position(668, 210);
  sliderShape.style("width", "240px");
}

function draw() {
  background(255);
  video.loadPixels();

  // contain slider values in a variable
  var valMode = sliderMode.value();
  var valPixelSize = sliderPixelSize.value();
  var valShape = sliderShape.value();

  // set pixel size to pixel slider value
  boxHeight = valPixelSize;
  boxWidth = valPixelSize;

  // find total value to average for pixel binning
  var tot = boxWidth * boxHeight;

  for (var x = 0; x < video.width; x += boxWidth) {
    for (var y = 0; y < video.height; y += boxHeight) {
      // pixel binning
      var red = 0,
        green = 0,
        blue = 0;

      for (var i = 0; i < boxWidth; i++) {
        for (var j = 0; j < boxHeight; j++) {
          var index = (x + i + (y + j) * video.width) * 4;

          red += video.pixels[index + 0];
          green += video.pixels[index + 1];
          blue += video.pixels[index + 2];
        }
      }

      // cases for mode slider
      // original
      if (valMode == 0) {
        fill(color(red / tot, green / tot, blue / tot));
      }
      // 8 bit
      else if (valMode == 1) {
        fill(replace8bit(color(red / tot, green / tot, blue / tot)));
      }
      // 4 bit
      else if (valMode == 2) {
        fill(replace4bit(color(red / tot, green / tot, blue / tot)));
      }

      // cases for shape slider
      // square
      if (valShape == 0) {
        rect(x, y, boxWidth, boxHeight);
      }
      // lines
      else if (valShape == 1) {
        rect(x, 0, boxWidth, video.height);
      }
      // spaced lines
      else if (valShape == 2) {
        rect(x, y, video.width, boxHeight * 0.6);
      }
      // square with outline on brighter pixels
      else if (valShape == 3) {
        if (red / tot > 150 && green / tot > 150 && blue / tot > 150) {
          push();
          stroke(255);
          strokeWeight(3);
          rect(x, y, boxWidth, boxHeight);
          pop();
        } else {
          rect(x, y, boxWidth, boxHeight);
        }
      }
    }
  }
  //slider labels 
  fill("#000000");
  text('pixel', 668, 50);
}

function replace8bit(c) {
  var r = int(red(c) / (255 / 8)) * (255 / 8);
  var g = int(green(c) / (255 / 8)) * (255 / 8);
  var b = int(blue(c) / (255 / 4)) * (255 / 4);

  let myColour = color(r, g, b);
  return myColour;
}

function replace4bit(c) {
  var colors = [
    color("#000000"), //black
    color("#555555"), // gray
    color("#0000AA"), // blue
    color("#5555FF"), // light blue
    color("#00AA00"), // green
    color("#55FF55"), // light green
    color("#00AAAA"), // cyan
    color("#55FFFF"), // light cyan
    color("#AA0000"), // red
    color("#FF5555"), // light red
    color("#AA00AA"), // magenta
    color("#FF55FF"), // light magenta
    color(170, 85, 0), // brown // #AA5500
    color("#FFFF55"), // yellow
    color("#AAAAAA"), // light grey
    color("#FFFFFF"), // white (high intensity)
  ];

  // find smallest difference between pixel and colour in colours array
  var smallestDist = null;
  var smallestIndex = 0;

  for (var i = 0; i < colors.length; i++) {
    var d =
      Math.pow(0.3 * (red(c) - red(colors[i])), 2) +
      Math.pow(0.59 * (green(c) - green(colors[i])), 2) +
      Math.pow(0.11 * (blue(c) - blue(colors[i])), 2);

    if (smallestDist == null || d < smallestDist) {
      smallestDist = d;
      smallestIndex = i;
    }
  }

  return colors[smallestIndex];
}
