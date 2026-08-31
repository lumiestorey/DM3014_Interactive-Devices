/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 3 - Net Art
 * Button Exercise
*/

// TARGET: define the button's target region
let bx, by, bw = 160, bh = 56;

let clickCount = 0;
 
function setup() {
  createCanvas(320, 130);
  bx = width / 2 - bw / 2; // center the button horizontally
  by = 30;
}
 
function draw() {
  background(244);
 
  // VALIDATE TARGET: is the mouse over the target right now?
  let hovering =
    mouseX > bx && mouseX < bx + bw &&
    mouseY > by && mouseY < by + bh;
 
  // SIGNIFIER: appearance change to indicate response
  noStroke();
  if (hovering) {
    fill('#e0245e');
  } else {
    fill(20, 19, 22);
  }
  rect(bx, by, bw, bh, 10);

  fill(255);
  textAlign(CENTER, CENTER);
  text('PRESS ME', bx + bw / 2, by + bh / 2 - 6);
  text('clicks: ' + clickCount, bx + bw / 2, by + bh / 2 + 14);

  cursor(hovering ? HAND : ARROW);
}
 
// EVENT -> RESPONSE: only counts if the click lands inside the target
function mousePressed() {
  let hit =
    mouseX > bx && mouseX < bx + bw &&
    mouseY > by && mouseY < by + bh;
 
  if (hit) {
    clickCount++;
  }
}