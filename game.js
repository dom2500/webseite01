const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "assets/bg_level1.png";

const playerImg = new Image();
playerImg.src = "assets/chicken.png";

const duckImg = new Image();
duckImg.src = "assets/duck2.png";

const leafImg = new Image();
leafImg.src = "assets/leaf.png";

const keys = {};
document.addEventListener("keydown", (e) => keys[e.code] = true);
document.addEventListener("keyup", (e) => keys[e.code] = false);

let score = 0;
let gameOver = false;

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

const enemies = [
  { x: 600, y: 310, width: 40, dir: -1 }
];

const items = [
  { x: 300, y: 320, collected: false },
  { x: 700, y: 320, collected: false }
];

const obstacles = [
  { x: 200, y: 300, width: 100, height: 20 },
  { x: 500, y: 250, width: 100, height: 20 }
];

function update() {
  if (gameOver) return;

  if ((keys["ArrowUp"] || keys["Space"]) && !player.jumping) {
    player.velY = jumpPower;
    player.jumping = true;
  }

  if (keys["ArrowRight"]) player.velX = 4;
  else if (keys["ArrowLeft"]) player.velX = -4;
  else player.velX = 0;

  player.x += player.velX;
  player.velY += gravity;
  player.y += player.velY;

  if (player.y >= groundY - player.height) {
    player.y = groundY - player.height;
    player.velY = 0;
    player.jumping = false;
  }

  // Collision with obstacles
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

  // Enemies movement & collision
  enemies.forEach(e => {
    e.x += e.dir * 2;
    if (e.x < 100 || e.x > 750) e.dir *= -1;

    if (
      player.x < e.x + e.width &&
      player.x + player.width > e.x &&
      player.y < e.y + e.width &&
      player.y + player.height > e.y
    ) {
      gameOver = true;
    }
  });

  // Item collection
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
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Obstacles
  ctx.fillStyle = "#654321";
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  });

  // Items
  items.forEach(i => {
    if (!i.collected) {
      ctx.drawImage(leafImg, i.x, i.y, 30, 30);
    }
  });

  // Enemies
  enemies.forEach(e => {
    ctx.drawImage(duckImg, e.x, e.y, e.width, e.width);
  });

  // Player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // UI
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

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

bg.onload = () => loop();
