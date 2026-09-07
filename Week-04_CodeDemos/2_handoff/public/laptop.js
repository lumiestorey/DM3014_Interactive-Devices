let socket;
let input = { dx: 0, dy: 0 };
let player = { x: 50, y: 0, vy: 0, w: 30, h: 30, onGround: false};
let gravity = 0.6;
let ground = 350;
let speed = 4;
let platforms = [ 
  { x: 100, y: 300, w: 50, h: 16, vx: 1.5, minX: 60, maxX: 220 }, 
  { x: 200, y: 200, w: 100, h: 16, vx: -1, minX: 150, maxX: 350 },
  { x: 400, y: 250, w: 140, h: 16, vx: 0.8, minX: 300, maxX: 600 }
];
let connected = false;

let deepColor = "#f7eb9e";
let highColor = "#a4f5fc";

function setup() {
  createCanvas(600, 400);
  socket = io();

  socket.on('connect', () => {
    connected = true;
    document.getElementById('status').textContent = 'phone connected — waiting for input';
  });

  socket.on('control', (data) => {
    document.getElementById('status').textContent = 'receiving input from phone';
    if (typeof data.dx === 'number') input.dx = data.dx;
    if (typeof data.dy === 'number') input.dy = data.dy;
    if (data.jump) doJump();
  });
}

function draw() {
  let t = constrain(map(player.y, 0, ground, 0, 1), 0, 1);
  let bg = lerpColor(color(deepColor), color(highColor),t);
  background(bg);

  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];
    p.x += p.vx;
    if (p.x < p.minX || p.x + p.w > p.maxX) {
      p.vx *= -1;
      p.x = constrain(p.x, p.minX, p.maxX - p.w);
    }
  }

  player.x += input.dx * speed;
  player.x = constrain(player.x, 0, width - player.w);

  player.vy += gravity;
  player.y += player.vy;

  player.onGround = false;

  if (player.y + player.h > ground) {
    player.y = ground - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  for (let i = platforms.length - 1; i >= 0; i--) {
    let plat = platforms[i];
    let landingOnPlatform = 
    player.x + player.w > platforms[i].x &&
    player.x < platforms[i].x + platforms[i].w &&
    player.y + player.h > platforms[i].y &&
    player.y < platforms[i].y + platforms[i].h + 10 &&
    player.vy >= 0;

  if (landingOnPlatform) {
    player.y = platforms[i].y - player.h;
    player.vy = 0;
    player.onGround = true;
    player.x += plat.vx;
    }
  }

  // let landing =
  //   player.x + player.w > platform.x &&
  //   player.x < platform.x + platform.w &&
  //   player.y + player.h > platform.y &&
  //   player.y + player.h < platform.y + platform.h + 10 &&
  //   player.vy >= 0;

  // if (landing) {
  //   player.y = platform.y - player.h;
  //   player.vy = 0;
  // }

  noStroke();
  fill(60);
  rect(0, ground, width, height - ground);
  fill(90);
  for (let i = 0; i < platforms.length; i++) {
    rect(platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h);
  }

  fill(240, 90, 60);
  rect(player.x, player.y, player.w, player.h);

  // also allow keyboard for testing without a phone
  if (keyIsDown(LEFT_ARROW)) player.x -= speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += speed;
}

function keyPressed() {
  if (key === ' ' && player.onGround) doJump();
}

function doJump() {
  if (player.y + player.h >= ground || player.vy === 0) {
    player.vy = -12;
  }
}
