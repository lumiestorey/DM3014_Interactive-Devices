/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 4 - Play Environments
 * Platformer Exercise
*/

let player = { x: 50, y: 0, vy: 0, w: 30, h: 30, onGround: false };
let gravity = 0.6;
let ground = 350;
let speed = 30;

let platform = { x: 300, y: 300, w: 140, h: 16 };

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(20);

  // gravity
  player.vy += gravity;
  player.y += player.vy;

  // assume airborne
  player.onGround = false;

  // ground collision
  if (player.y + player.h > ground) {
    player.y = ground - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  // draw environment
  fill(60);
  rect(0, ground, width, height - ground); // the "floor" is just a rule + a rectangle

  // draw player
  fill(240, 90, 60);
  rect(player.x, player.y, player.w, player.h);

  //constrain within environment 
  player.x = constrain(player.x, 0, width - player.w);

  // platform 
  let landingOnPlatform = 
    player.x + player.w > platform.x &&
    player.x < platform.x + platform.w &&
    player.y + player.h > platform.y &&
    player.y < platform.y + platform.h + 10 &&
    player.vy >= 0;

  if (landingOnPlatform) {
    player.y = platform.y - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  // draw platform 
  fill(90);
  rect(platform.x, platform.y, platform.w, platform.h);

}

function keyPressed() {
  if (key === ' ' && player.onGround) {
    player.vy = -12; // jump
  }
  // if (key === ' ' && player.y + player.h >= platform.y + platform.h) {
  //   player.vy = -12; // jump
  // }
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.x += speed;
  }
}

function keyReleased() {
  
}