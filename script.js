let rows = 10;
let cols = 10;
let numMines = 10;
let timer;
let cells;

const board = document.getElementById('board');
const easyBtn = document.getElementById('easy');
const mediumBtn = document.getElementById('medium');
const hardBtn = document.getElementById('hard');

easyBtn.addEventListener('click', () => {
  rows = 8;
  cols = 8;
  numMines = 10;
  resetGame();
});

mediumBtn.addEventListener('click', () => {
  rows = 10;
  cols = 10;
  numMines = 20;
  resetGame();
});

hardBtn.addEventListener('click', () => {
  rows = 12;
  cols = 12;
  numMines = 30;
  resetGame();
});

function resetGame() {
  clearInterval(timer); // Limpa o temporizador se existir
  board.innerHTML = '';
  cells = createBoard(rows, cols, numMines);
}

function startTimer() {
  let seconds = 0;
  timer = setInterval(() => {
    seconds++;
    console.log(seconds); // Aqui você pode exibir o tempo na interface do usuário
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function handleClick(row, col, event) {
  const cell = cells[row][col];
  const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

  if (event.type === 'click') {
    if (cell.isMine) {
      cellElement.classList.add('mine');
      alert('Você perdeu, tente novamente!');
      stopTimer(); // Para o temporizador quando o jogo termina
      resetGame();
    } else {
      if (!timer) startTimer(); // Inicia o temporizador se ainda não foi iniciado
      cellElement.classList.add('clicked');
      const adjacentMines = countAdjacentMines(row, col);
      if (adjacentMines === 0) {
        openAdjacentCells(row, col);
      } else {
        cellElement.textContent = adjacentMines;
        cellElement.classList.add(`number${adjacentMines}`);
      }
      checkGameCompletion(); // Verifica se o jogo foi concluído após cada clique
    }
  } else if (event.type === 'contextmenu') {
    event.preventDefault();
    // Lógica para marcar com a bandeira
  }
}

function checkGameCompletion() {
  let allCellsClicked = true;

  cells.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellElement = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
      if (!cell.isMine && !cellElement.classList.contains('clicked')) {
        allCellsClicked = false;
      }
    });
  });

  if (allCellsClicked) {
    stopTimer(); // Para o temporizador quando o jogo é concluído
    alert('Parabéns! Você concluiu o jogo!');
    resetGame();
  }
}

function createBoard(rows, cols, numMines) {
  const cells = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({ isMine: false, isOpen: false });
    }
    cells.push(row);
  }

  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const x = Math.floor(Math.random() * rows);
    const y = Math.floor(Math.random() * cols);
    if (!cells[x][y].isMine) {
      cells[x][y].isMine = true;
      minesPlaced++;
    }
  }

  cells.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.dataset.row = i;
      cellElement.dataset.col = j;
      cellElement.addEventListener('click', (event) => handleClick(i, j, event));
      cellElement.addEventListener('contextmenu', (event) => handleClick(i, j, event));
      board.appendChild(cellElement);
    });
    board.appendChild(document.createElement('br'));
  });

  return cells;
}

function countAdjacentMines(row, col) {
  let count = 0;
  for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
    for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
      if (cells[i][j].isMine) count++;
    }
  }
  return count;
}

function openAdjacentCells(row, col) {
  for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
    for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
      const adjacentCell = cells[i][j];
      const adjacentCellElement = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
      if (!adjacentCellElement.classList.contains('clicked') && !adjacentCell.isFlagged) {
        adjacentCellElement.classList.add('clicked');
        const adjacentMines = countAdjacentMines(i, j);
        if (adjacentMines === 0) {
          openAdjacentCells(i, j);
        } else {
          adjacentCellElement.textContent = adjacentMines;
          adjacentCellElement.classList.add(`number${adjacentMines}`);
        }
      }
    }
  }
}

cells = createBoard(rows, cols, numMines);
