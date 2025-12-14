const SIZE = 15;
const MINES = 30;

const board = document.getElementById("board");
const modeBtn = document.getElementById("modeBtn");
const restartBtn = document.getElementById("restartBtn");

let cells = [];
let flagMode = false;

modeBtn.onclick = () => {
  flagMode = !flagMode;
  modeBtn.textContent = `🚩 Flag Mode: ${flagMode ? "ON" : "OFF"}`;
};

restartBtn.onclick = startGame;

function startGame() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.mine = "false";
    cell.dataset.revealed = "false";
    cell.dataset.flag = "false";

    cell.addEventListener("click", () => handleClick(i));
    board.appendChild(cell);
    cells.push(cell);
  }

  // Place mines
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * cells.length);
    if (cells[r].dataset.mine === "false") {
      cells[r].dataset.mine = "true";
      placed++;
    }
  }
}

function handleClick(index) {
  const cell = cells[index];
  if (cell.dataset.revealed === "true") return;

  if (flagMode) {
    toggleFlag(cell);
    return;
  }

  revealCell(index);
}

function toggleFlag(cell) {
  if (cell.dataset.flag === "true") {
    cell.dataset.flag = "false";
    cell.textContent = "";
  } else {
    cell.dataset.flag = "true";
    cell.textContent = "🚩";
  }
}

function revealCell(index) {
  const cell = cells[index];
  if (cell.dataset.flag === "true") return;

  cell.dataset.revealed = "true";
  cell.classList.add("revealed");

  if (cell.dataset.mine === "true") {
    cell.textContent = "💣";
    alert("Game Over!");
    revealAll();
    return;
  }

  const count = countMines(index);
  if (count > 0) {
    cell.textContent = count;
  } else {
    revealNeighbors(index);
  }
}

function countMines(index) {
  return getNeighbors(index).filter(i => cells[i].dataset.mine === "true").length;
}

function revealNeighbors(index) {
  for (const i of getNeighbors(index)) {
    if (cells[i].dataset.revealed === "false") {
      revealCell(i);
    }
  }
}

function getNeighbors(index) {
  const x = index % SIZE;
  const y = Math.floor(index / SIZE);
  const neighbors = [];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
        neighbors.push(ny * SIZE + nx);
      }
    }
  }
  return neighbors;
}

function revealAll() {
  cells.forEach(cell => {
    if (cell.dataset.mine === "true") {
      cell.textContent = "💣";
    }
    cell.classList.add("revealed");
  });
}

startGame();
