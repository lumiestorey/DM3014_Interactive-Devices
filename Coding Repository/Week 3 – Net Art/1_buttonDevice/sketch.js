/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 3 - Net Art
 * Button Exercise
*/

// TARGET: define the button's target region
let gridPosition = [];
let bx, by, bw = 100, bh = 100;

let clickCount = 0;
 
function setup() {
  createCanvas(windowWidth, windowHeight);
  bx = width / 2 - bw / 2; // center the button horizontally
  by = 60;
  ellipseMode(CORNER);
}
 
function draw() {
  background("#000000");
 
  // VALIDATE TARGET: is the mouse over the target right now?
  let hovering =
    mouseX > bx && mouseX < bx + bw &&
    mouseY > by && mouseY < by + bh;
 
  // SIGNIFIER: appearance change to indicate response

  for (let i = 0; i < Math.floor(width/bw); i++) {
    for (let j = 0; j < Math.floor(height/bh); j++) {

      let x = i * bw;
      let y = j * bh;
      gridPosition.push ({positionX: x, positionY: y});

      fill(20, 19, 22);
      ellipse(x, y, 100);

    }
    
  }

  noStroke();
  if (hovering) {
    fill('#e0245e');
  } else {
    fill(20, 19, 22);
  }
  ellipse(bx, by, bw, bh);

  fill(255);
  textAlign(CENTER, CENTER);
  text('FIND ME', bx + bw / 2, by + bh / 2 - 6);
  text('clicks: ' + clickCount, bx + bw / 2, by + bh / 2 + 14);

  cursor(hovering ? HAND : ARROW);

  
}
 
// EVENT -> RESPONSE: only counts if the click lands inside the target
function mousePressed() {
  let hit =
    mouseX > bx && mouseX < bx + bw &&
    mouseY > by && mouseY < by + bh;
 
  if (hit) {
    let picked = random(gridPosition);
    bx = picked.positionX;
    by = picked.positionY;
    clickCount++;
  }
}