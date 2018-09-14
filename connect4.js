/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // define board outside function scope for other functions to access later;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 *
 * NOTE: Do we ever store gameboard anywhere?
 */

function makeBoard(tall, wide) {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < tall; i++) {
    let row = Array(wide).fill(0);
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Display current player
  let playerName = document.createElement('h1');
  playerName.classList.add('player');
  playerName.classList.add('p1-text');
  playerName.innerText = `Current Player: ${currPlayer}`;
  document.querySelector('body').prepend(playerName);

  // TODO: get "board" variable from the item in HTML w/ID of "board"
  let boardHTML = document.getElementById('board');

  // TODO: add comment for this code
  let top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement('td');
    headCell.setAttribute('id', x);

    // Set hover indicator for next piece
    let hoverPiece = document.createElement('div');
    hoverPiece.classList.add('hover');
    hoverPiece.classList.add('piece');
    hoverPiece.classList.add('p1');
    hoverPiece.classList.add('hidden');
    headCell.addEventListener('mouseover', function() {
      hoverPiece.classList.toggle('hidden');
    });
    headCell.addEventListener('mouseout', function() {
      hoverPiece.classList.toggle('hidden');
    });
    headCell.appendChild(hoverPiece);

    top.append(headCell);
  }
  boardHTML.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    let row = document.createElement('tr');
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    boardHTML.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = board.length - 1; y >= 0; y--) {
    let row = board[y];
    if (row[x] === 0) return y;
  }
  return null;
  //we are returning a y for x that is empty
}

/** placeInTable: update DOM to place piece into HTML board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let pieceDiv = document.createElement('div');
  pieceDiv.classList.add('piece');
  pieceDiv.classList.add(`p${currPlayer}`);
  let targetCell = document.getElementById(`${y}-${x}`);
  targetCell.appendChild(pieceDiv);
}

function updateBoard(y, x) {
  board[y][x] = currPlayer;
}

/** endGame: announce game end */

// check if gameboard is full

function boardIsFull() {
  let boardStr = board.map(e => e.join('')).join('');
  return !/0/g.test(boardStr);
}

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x;
  if (evt.target.tagName.toLowerCase() === 'div') {
    x = +evt.target.parentNode.id;
  } else {
    x = +evt.target.id;
  }
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  updateBoard(y, x);

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (boardIsFull()) {
    //call endGame
    return endGame(`The Game is a Tie!`);
  }

  // check for win
  if (checkForWin()) {
    setTimeout(() => endGame(`Player ${currPlayer} won!`), 10);
  }

  let hoverSet = document.getElementsByClassName('hover');

  // change color of hover (remove current player class)
  for (let i = 0; i < hoverSet.length; i++) {
    hoverSet[i].classList.toggle(`p${currPlayer}`);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;

  // change color of hover (add new current player class)
  for (let i = 0; i < hoverSet.length; i++) {
    hoverSet[i].classList.toggle(`p${currPlayer}`);
  }
  // Change player name
  showPlayerName();
}

function showPlayerName() {
  let playerName = document.querySelector('.player');
  playerName.innerText = `Current Player: ${currPlayer}`;
  playerName.classList.toggle('p1-text');
  playerName.classList.toggle('p2-text');
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard(HEIGHT, WIDTH);
makeHtmlBoard();
