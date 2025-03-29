let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turnIndicator = document.querySelector("#turn-indicator");
let timerDisplay = document.querySelector("#timer");

let turnO = true; 
let count = 0; 
let timeLeft = 10; 
let timer;
let gameActive = true; 

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];


const updateTurnIndicator = () => {
  turnIndicator.textContent = turnO ? "Player O's Turn" : "Player X's Turn";
};


const startTimer = () => {
  clearInterval(timer);
  timeLeft = 10;
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  
  timer = setInterval(() => {
    if (!gameActive) {
      clearInterval(timer);
      return;
    }
    
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    
    if (timeLeft === 0) {
      clearInterval(timer);
      switchTurn(); 
    }
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timer);
  startTimer();
};

const stopTimer = () => {
  clearInterval(timer);
  timerDisplay.textContent = `Game Over`;
};

const switchTurn = () => {
  turnO = !turnO;
  updateTurnIndicator();
  resetTimer();
};

const playSound = (soundId) => {
  const sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
};

const showConfetti = () => {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
};
const resetGame = () => {
  gameActive = true;
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  updateTurnIndicator();
  resetTimer();
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!gameActive || box.innerText !== "") return;
    
    if (turnO) {
      box.innerText = "O";
    } else {
      box.innerText = "X";
    }
    box.disabled = true;
    count++;
    playSound("click-sound");
    
    let isWinner = checkWinner();
    
    if (isWinner) {
      gameActive = false;
      stopTimer();
      return;
    }
    
    if (count === 9) {
      gameDraw();
      return;
    }
    
    switchTurn();
  });
});

const gameDraw = () => {
  gameActive = false;
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  playSound("draw-sound"); 
  stopTimer();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};


const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showWinner = (winner) => {
  gameActive = false;
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  playSound("win-sound");
  showConfetti(); 
  stopTimer(); 
};


const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
    }
  }
  return false;
};


newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

resetGame();
