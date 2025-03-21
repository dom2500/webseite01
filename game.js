const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "assets/bg.png";

const ground = new Image();
ground.src = "assets/ground.png";

const playerImg = new Image();
playerImg.src = "assets/friend.png"; // <- your friend's image

const jumpSound = new Audio("assets/jump.mp3");

let player = {
  x: 100,
  y: 280,
  width: 50,
  height: 50,
  velocityY: 0,
  jumping: false
};

const gravity = 0.6;
const jumpPower = -12;
const groundLevel = 330;

let keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function update() {
  // Jump
  if ((keys["ArrowUp"] || keys["Space"] || keys["KeyW"]) && !player.jumping) {
    player.velocityY = jumpPower;
    player.jumping = true;
    jumpSound.play();
  }

  // Gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

  // Ground collision
  if (player.y >= groundLevel) {
    player.y = groundLevel;
    player.velocityY = 0;
    player.jumping = false;
  }

  // Horizontal movement
  if (keys["ArrowRight"] || keys["KeyD"]) player.x += 5;
  if (keys["ArrowLeft"] || keys["KeyA"]) player.x -= 5;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(ground, 0, groundLevel + 50, canvas.width, 50);
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

bg.onload = () => loop(); // Start when background is loaded

