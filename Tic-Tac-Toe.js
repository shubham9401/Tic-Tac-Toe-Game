let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turnIndicator = document.querySelector("#turn-indicator");
let timerDisplay = document.querySelector("#timer");

let turnO = true; // Player O starts first
let count = 0; // To track draw
let timeLeft = 10; // Timer starts at 10 seconds
let timer;
let gameActive = true; // Flag to track if game is active

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

// Function to update the turn indicator
const updateTurnIndicator = () => {
  turnIndicator.textContent = turnO ? "Player O's Turn" : "Player X's Turn";
};

// Function to start the timer
const startTimer = () => {
  // Clear any existing timer before starting a new one
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
      switchTurn(); // Switch turn if time runs out
    }
  }, 1000);
};

// Function to reset the timer
const resetTimer = () => {
  clearInterval(timer);
  startTimer();
};

// Function to stop the timer completely
const stopTimer = () => {
  clearInterval(timer);
  timerDisplay.textContent = `Game Over`;
};

// Function to switch turns
const switchTurn = () => {
  turnO = !turnO;
  updateTurnIndicator();
  resetTimer();
};

// Function to play sound effects
const playSound = (soundId) => {
  const sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0; // Reset sound to start
    sound.play();
  }
};

// Function to show confetti animation
const showConfetti = () => {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
};

// Reset the game
const resetGame = () => {
  gameActive = true;
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  updateTurnIndicator();
  resetTimer();
};

// Event listeners for boxes
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
    playSound("click-sound"); // Play click sound
    
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
    
    switchTurn(); // Switch turn after a move
  });
});

// Function to handle a draw
const gameDraw = () => {
  gameActive = false;
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  playSound("draw-sound"); // Play draw sound
  stopTimer();
};

// Function to disable all boxes
const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

// Function to enable all boxes
const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

// Function to show the winner
const showWinner = (winner) => {
  gameActive = false;
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  playSound("win-sound"); // Play win sound
  showConfetti(); // Show confetti animation
  stopTimer(); // Stop the timer when game is won
};

// Function to check for a winner
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

// Event listeners for buttons
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// Initialize the game
resetGame();
