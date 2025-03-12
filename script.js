const board = document.getElementById("board");
const status = document.getElementById("status");
const resetButton = document.getElementById("reset");
const playPauseButton = document.getElementById("playPause");
const cells = document.querySelectorAll(".cell");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const timeLeftDisplay = document.getElementById("timeLeft");
const drawModal = document.getElementById("drawModal");
const restartButton = document.getElementById("restartButton");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let scores = { X: 0, O: 0 };
let timeLeft = 15; 
let timerInterval;
let isPaused = false;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

function startTimer() {
  clearInterval(timerInterval); 
  timeLeft = 15; 
  timeLeftDisplay.textContent = timeLeft;
  timerInterval = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      timeLeftDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        switchPlayer();
      }
    }
  }, 1000);
}


function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  status.textContent = `Player ${currentPlayer}'s turn`;
  startTimer(); 
}


function handleCellClick(event) {
  if (!gameActive || isPaused) return;

  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

  if (gameState[clickedCellIndex] !== "") return;

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add(currentPlayer);

  checkForWin();
}


function checkForWin() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] === "" ||
      gameState[b] === "" ||
      gameState[c] === ""
    ) continue;

    if (
      gameState[a] === gameState[b] &&
      gameState[b] === gameState[c]
    ) {
      roundWon = true;
      highlightWinningCells([a, b, c]);
      break;
    }
  }

  if (roundWon) {
    scores[currentPlayer]++;
    updateScoreboard();
    status.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameActive = false;
    clearInterval(timerInterval);
    return;
  }

  if (!gameState.includes("")) {
    showDrawModal();
    gameActive = false;
    clearInterval(timerInterval);
    return;
  }

  switchPlayer();
}


function highlightWinningCells(cellsToHighlight) {
  cellsToHighlight.forEach(index => {
    cells[index].classList.add("winning-cell");
  });
}


function updateScoreboard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}


function showDrawModal() {
  drawModal.style.display = "flex";
}


function hideDrawModal() {
  drawModal.style.display = "none";
}


function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  status.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O", "winning-cell");
  });
  clearInterval(timerInterval);
  startTimer();
  hideDrawModal();
}


function togglePlayPause() {
  isPaused = !isPaused;
  playPauseButton.textContent = isPaused ? "Play" : "Pause";
}


cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
playPauseButton.addEventListener("click", togglePlayPause);
restartButton.addEventListener("click", resetGame);


resetGame();