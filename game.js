let player = document.getElementById("player");
let game = document.getElementById("game");
let scoreDisplay = document.getElementById("score");

let lane = 2;
let score = 0;
let speed = 3;
let gameRunning = false;

const lanePositions = {
  1: 50,
  2: 155,
  3: 260
};

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  speed = 3;
  scoreDisplay.innerText = "Score: 0";

  setInterval(createObstacle, 1200);
  requestAnimationFrame(gameLoop);
}

// Player Movement
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && lane > 1) lane--;
  if (e.key === "ArrowRight" && lane < 3) lane++;
});

// Touch controls (mobile)
document.addEventListener("touchstart", (e) => {
  let x = e.touches[0].clientX;
  if (x < window.innerWidth / 2 && lane > 1) lane--;
  else if (lane < 3) lane++;
});

// Create Obstacles
function createObstacle() {
  if (!gameRunning) return;

  let obs = document.createElement("div");
  obs.classList.add("obstacle");

  let randomLane = Math.floor(Math.random() * 3) + 1;
  obs.classList.add("lane" + randomLane);
  obs.dataset.lane = randomLane;

  game.appendChild(obs);
}

// Game Loop
function gameLoop() {
  if (!gameRunning) return;

  player.style.left = lanePositions[lane] + "px";

  let obstacles = document.querySelectorAll(".obstacle");

  obstacles.forEach(obs => {
    let top = parseInt(obs.style.top || "-40");
    top += speed;
    obs.style.top = top + "px";

    // Collision Detection
    if (
      top > 420 &&
      obs.dataset.lane == lane
    ) {
      gameOver();
    }

    // Remove off screen
    if (top > 500) {
      obs.remove();
      score++;
      scoreDisplay.innerText = "Score: " + score;

      // Increase difficulty
      if (score % 5 === 0) speed += 0.5;
    }
  });

  requestAnimationFrame(gameLoop);
}

// Game Over
function gameOver() {
  alert("💀 Game Over! Score: " + score);
  gameRunning = false;
  location.reload();
}
