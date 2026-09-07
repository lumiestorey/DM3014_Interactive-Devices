/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 4 - Play Environments
 * Platformer Exercise
*/

let player = { x: 50, y: 0, vy: 0, w: 30, h: 30, onGround: false };
let gravity = 0.6;
let ground = 350;
let speed = 30;

let platform1 = { x: 100, y: 300, w: 50, h: 16 };
let platform2 = { x: 200, y: 200, w: 100, h: 16};
let platform3 = { x: 400, y: 300, w: 140, h: 16 };

let deepColor = {"#0d3473"};
let highColor = {"#5ed1db"};

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
  let landingOnPlatform1 = 
    player.x + player.w > platform1.x &&
    player.x < platform1.x + platform1.w &&
    player.y + player.h > platform1.y &&
    player.y < platform1.y + platform1.h + 10 &&
    player.vy >= 0;

  let landingOnPlatform2 = 
    player.x + player.w > platform2.x &&
    player.x < platform2.x + platform2.w &&
    player.y + player.h > platform2.y &&
    player.y < platform2.y + platform2.h + 10 &&
    player.vy >= 0;

  let landingOnPlatform3 = 
    player.x + player.w > platform3.x &&
    player.x < platform3.x + platform3.w &&
    player.y + player.h > platform3.y &&
    player.y < platform3.y + platform3.h + 10 &&
    player.vy >= 0;

  if (landingOnPlatform1) {
    player.y = platform1.y - player.h;
    player.vy = 0;
    player.onGround = true;
  } else if (landingOnPlatform2) {
    player.y = platform2.y - player.h;
    player.vy = 0;
    player.onGround = true;
  } else if (landingOnPlatform3) {
    player.y = platform3.y - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  // draw platform 
  fill(90);
  rect(platform1.x, platform1.y, platform1.w, platform1.h);
  rect(platform2.x, platform2.y, platform2.w, platform2.h);
  rect(platform3.x, platform3.y, platform3.w, platform3.h);

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