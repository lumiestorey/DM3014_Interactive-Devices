/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 4 - Play Environments
 * Platformer Exercise
*/

let player = { x: 50, y: 0, vy: 0, w: 30, h: 30 };
let gravity = 0.6;
let ground = 350;
let speed = 30;

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(20);

  // gravity
  player.vy += gravity;
  player.y += player.vy;

  // ground collision
  if (player.y + player.h > ground) {
    player.y = ground - player.h;
    player.vy = 0;
  }

  // draw environment
  fill(60);
  rect(0, ground, width, height - ground); // the "floor" is just a rule + a rectangle

  // draw player
  fill(240, 90, 60);
  rect(player.x, player.y, player.w, player.h);
}

function keyPressed() {
  if (key === ' ' && player.y + player.h >= ground) {
    player.vy = -12; // jump
  }
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.x += speed;
  }
}

function keyReleased() {
  
}