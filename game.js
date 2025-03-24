const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load assets
const bg = new Image();
bg.src = "assets/bg_level1.png";
const playerImg = new Image();
playerImg.src = "assets/chicken.png";
const duckImg = new Image();
duckImg.src = "assets/duck2.png";
const leafImg = new Image();
leafImg.src = "assets/leaf.png";

// Input
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Game variables
let cameraX = 0;
let score = 0;
let gameOver = false;
let levelWidth = 2000;

// Player setup
const player = {
  x: 50,
  y: 300,
  width: 50,
  height: 50,
  velX: 0,
  velY: 0,
  jumping: false
};

const gravity = 0.6;
const jumpPower = -12;
const groundY = 350;

// Obstacles/platforms
const obstacles = [
  { x: 200, y: 300, width: 100, height: 20 },
  { x: 500, y: 250, width: 100, height: 20 },
  { x: 800, y: 200, width: 100, height: 20 },
  { x: 1100, y: 300, width: 120, height: 20 },
  { x: 1400, y: 260, width: 100, height: 20 },
  { x: 1700, y: 220, width: 120, height: 20 }
];

// Items (leafs)
const items = [
  { x: 250, y: 270, collected: false },
  { x: 530, y: 220, collected: false },
  { x: 850, y: 170, collected: false },
  { x: 1150, y: 270, collected: false },
  { x: 1450, y: 230, collected: false },
  { x: 1750, y: 190, collected: false },
  { x: 1900, y: 320, collected: false }
];

// Enemies (ducks)
const enemies = [
  { x: 600, y: 310, width: 40, dir: -1 },
  { x: 900, y: 310, width: 40, dir: 1 },
  { x: 1300, y: 310, width: 40, dir: -1 },
  { x: 1600, y: 310, width: 40, dir: 1 },
  { x: 1850, y: 310, width: 40, dir: -1 }
];

// Update game
function update() {
  if (gameOver) return;

  // Movement
  if ((keys["ArrowUp"] || keys["Space"]) && !player.jumping) {
    player.velY = jumpPower;
    player.jumping = true;
  }
  player.velX = 0;
  if (keys["ArrowRight"]) player.velX = 4;
  if (keys["ArrowLeft"]) player.velX = -4;

  player.x += player.velX;
  player.velY += gravity;
  player.y += player.velY;

  if (player.y >= groundY - player.height) {
    player.y = groundY - player.height;
    player.velY = 0;
    player.jumping = false;
  }

  // Platform collision
  obstacles.forEach(o => {
    if (
      player.x + player.width > o.x &&
      player.x < o.x + o.width &&
      player.y + player.height >= o.y &&
      player.y + player.height <= o.y + o.height &&
      player.velY >= 0
    ) {
      player.y = o.y - player.height;
      player.velY = 0;
      player.jumping = false;
    }
  });

  // Enemies
  enemies.forEach(e => {
    e.x += e.dir * 2;
    if (e.x < e.startX - 50 || e.x > e.startX + 100) e.dir *= -1;

    // Collision
    if (
      player.x < e.x + e.width &&
      player.x + player.width > e.x &&
      player.y < e.y + e.width &&
      player.y + player.height > e.y
    ) {
      gameOver = true;
    }
  });

  // Items
  items.forEach(i => {
    if (!i.collected &&
        player.x < i.x + 30 &&
        player.x + player.width > i.x &&
        player.y < i.y + 30 &&
        player.y + player.height > i.y) {
      i.collected = true;
      score += 10;
    }
  });

  // Camera scroll
  cameraX = player.x - 100;

  // Goal
  if (player.x > levelWidth - 60) {
    alert("🎉 Geschafft! Endpunkt erreicht!\nPunkte: " + score);
    document.location.reload();
  }
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background loop
  for (let i = 0; i < levelWidth; i += canvas.width) {
    ctx.drawImage(bg, i - cameraX, 0, canvas.width, canvas.height);
  }

  // Platforms
  ctx.fillStyle = "#654321";
  obstacles.forEach(o => {
    ctx.fillRect(o.x - cameraX, o.y, o.width, o.height);
  });

  // Items
  items.forEach(i => {
    if (!i.collected) {
      ctx.drawImage(leafImg, i.x - cameraX, i.y, 30, 30);
    }
  });

  // Enemies
  enemies.forEach(e => {
    ctx.drawImage(duckImg, e.x - cameraX, e.y, e.width, e.width);
  });

  // Player
  ctx.drawImage(playerImg, player.x - cameraX, player.y, player.width, player.height);

  // HUD
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText("Punkte: " + score, 10, 30);

  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "40px sans-serif";
    ctx.fillText("GAME OVER", 280, 200);
  }
}

// Init enemy patrol ranges
enemies.forEach(e => {
  e.startX = e.x;
});

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

bg.onload = () => loop();
