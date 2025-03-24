const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let level = 1;
let score = 0;

// Load Images
const bg1 = new Image();
bg1.src = "assets/bg_level1.png";

const bg2 = new Image();
bg2.src = "assets/bg_level2.png";

const chickenImg = new Image();
chickenImg.src = "assets/chicken.png";

const duckImg = new Image();
duckImg.src = "assets/duck.png";

const leafImg = new Image();
leafImg.src = "assets/leaf.png";

// Player setup
let player = {
  x: 50,
  y: 300,
  width: 50,
  height: 50,
  velY: 0,
  jumping: false
};

const gravity = 0.5;
const jumpPower = -10;
const groundLevel = 350;

let keys = {};
let enemies = [];
let items = [];

document.addEventListener("keydown", (e) => keys[e.code] = true);
document.addEventListener("keyup", (e) => keys[e.code] = false);

function initLevel(levelNum) {
  player.x = 50;
  player.y = 300;
  enemies = [];
  items = [];

  if (levelNum === 1) {
    enemies.push({ x: 400, y: 310, width: 40, dir: 1 });
    items.push({ x: 600, y: 320, collected: false });
  } else if (levelNum === 2) {
    enemies.push({ x: 300, y: 310, width: 40, dir: 1 });
    enemies.push({ x: 600, y: 310, width: 40, dir: -1 });
    items.push({ x: 500, y: 320, collected: false });
    items.push({ x: 700, y: 320, collected: false });
  }
}

function update() {
  // Movement
  if ((keys["ArrowUp"] || keys["Space"] || keys["KeyW"]) && !player.jumping) {
    player.velY = jumpPower;
    player.jumping = true;
  }

  if (keys["ArrowRight"] || keys["KeyD"]) player.x += 5;
  if (keys["ArrowLeft"] || keys["KeyA"]) player.x -= 5;

  player.velY += gravity;
  player.y += player.velY;

  if (player.y >= groundLevel - player.height) {
    player.y = groundLevel - player.height;
    player.velY = 0;
    player.jumping = false;
  }

  // Update enemies
  enemies.forEach(e => {
    e.x += e.dir * 2;
    if (e.x < 100 || e.x > 700) e.dir *= -1;

    // Collision
    if (player.x < e.x + e.width &&
        player.x + player.width > e.x &&
        player.y < e.y + e.width &&
        player.y + player.height > e.y) {
      alert("Von einer Ente erwischt! Spiel endet.");
      document.location.reload();
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

  // Level switch
  if (player.x > 800) {
    if (level === 1) {
      level = 2;
      initLevel(2);
    } else {
      alert("Du hast alle Level gemeistert! 🏆 Punkte: " + score);
      document.location.reload();
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(level === 1 ? bg1 : bg2, 0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.drawImage(chickenImg, player.x, player.y, player.width, player.height);

  // Draw enemies
  enemies.forEach(e => {
    ctx.drawImage(duckImg, e.x, e.y, e.width, e.width);
  });

  // Draw items
  items.forEach(i => {
    if (!i.collected) {
      ctx.drawImage(leafImg, i.x, i.y, 30, 30);
    }
  });

  // HUD
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText("Level: " + level, 10, 30);
  ctx.fillText("Score: " + score, 700, 30);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
chickenImg.onload = () => {
  initLevel(1);
  gameLoop();
};
