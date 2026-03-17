let player = document.getElementById("player");
let game = document.getElementById("game");

let scoreEl = document.getElementById("score");
let coinsEl = document.getElementById("coins");
let highEl = document.getElementById("highScore");

let music = document.getElementById("bgMusic");
let jumpSound = document.getElementById("jumpSound");

let lane = 2;
let score = 0;
let coins = 0;
let speed = 4;
let gameRunning = false;

let highScore = localStorage.getItem("high") || 0;
highEl.innerText = "High: " + highScore;

const lanePos = {1:50, 2:155, 3:260};

// START GAME
function startGame(){
  if(gameRunning) return;

  gameRunning = true;
  score = 0;
  coins = 0;
  speed = 4;

  music.play();

  setInterval(spawn, 900);
  requestAnimationFrame(loop);
}

// CONTROLS
document.addEventListener("keydown", e=>{
  if(e.key==="ArrowLeft" && lane>1) lane--;
  if(e.key==="ArrowRight" && lane<3) lane++;
  if(e.key==="ArrowUp") jump();
});

// TOUCH
let startX = 0;
document.addEventListener("touchstart", e=>{
  startX = e.touches[0].clientX;
});
document.addEventListener("touchend", e=>{
  let diff = e.changedTouches[0].clientX - startX;
  if(diff > 50 && lane<3) lane++;
  if(diff < -50 && lane>1) lane--;
});

// JUMP
function jump(){
  player.style.bottom = "120px";
  jumpSound.play();
  setTimeout(()=>player.style.bottom="20px",300);
}

// SPAWN
function spawn(){
  if(!gameRunning) return;

  let rand = Math.random();

  let obj = document.createElement("img");

  if(rand < 0.7){
    obj.src = "assets/obstacle.png";
    obj.classList.add("obstacle");
    obj.dataset.type = "obstacle";
  } else {
    obj.src = "assets/coin.png";
    obj.classList.add("coin");
    obj.dataset.type = "coin";
  }

  let laneNum = Math.floor(Math.random()*3)+1;
  obj.classList.add("lane"+laneNum);
  obj.dataset.lane = laneNum;

  game.appendChild(obj);
}

// LOOP
function loop(){
  if(!gameRunning) return;

  player.style.left = lanePos[lane]+"px";

  let objs = document.querySelectorAll(".obstacle, .coin");

  objs.forEach(o=>{
    let top = parseInt(o.style.top || "-40");
    top += speed;
    o.style.top = top+"px";

    // COLLISION
    if(top > 420 && o.dataset.lane == lane){
      if(o.dataset.type==="obstacle"){
        endGame();
      } else {
        coins++;
        coinsEl.innerText = "Coins: "+coins;
        o.remove();
      }
    }

    if(top>550){
      o.remove();
      score++;
      scoreEl.innerText="Score: "+score;

      if(score%10===0) speed += 0.5;
    }
  });

  requestAnimationFrame(loop);
}

// END GAME
function endGame(){
  gameRunning = false;
  music.pause();

  if(score > highScore){
    localStorage.setItem("high", score);
  }

  alert("Game Over 💀 Score: "+score);
  location.reload();
}
