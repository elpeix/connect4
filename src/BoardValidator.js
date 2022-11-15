import { c4 } from "./constants";
import { LineCounter } from "./LineCounter";

class BoardValidator {

  status;
  winner;
  line;
  #board;
  #cols;
  #rows;
  #lineCounter;

  constructor(board, rows, cols) {
    this.#board = board;
    this.#rows = rows;
    this.#cols = cols;
    this.#lineCounter = new LineCounter();
    this.status = c4.PLAY;
  }

  getConnectedPieces() {
    return this.#lineCounter.pieces;
  }

  validate() {
    if (this.status !== c4.PLAY) {
      return;
    }
    let player = this.#getColumnWinner();
    if (player) {
      return this.#setWinner(player);
    }
    player = this.#getRowWinner();
    if (player) {
      return this.#setWinner(player);
    }
    player = this.#getDiagonalWinner(this.#board);
    if (player) {
      return this.#setWinner(player);
    }
    player = this.#getDiagonalWinner(this.#transpose(this.#board));
    if (player) {
      this.#setWinner(player);
      this.#transposeLine();
      return;
    }
    if (this.#boardIsFull()) {
      this.status = c4.END_GAME;
      this.winner = c4.DRAW;
    }
  }

  #setWinner(player) {
    this.status = c4.END_GAME;
    this.winner = player;
    this.line = this.#lineCounter.pieces;
  }

  #getColumnWinner() {
    for (let col = 0; col < this.#cols; col++) {
      this.#lineCounter.clear();
      for (let row = this.#rows - 1; row >= 0; row--) {
        const player = this.#check(this.#board, row, col);
        if (player) {
          return player;
        }
      }
    }
  }

  #getRowWinner() {
    for (let row = 0; row < this.#rows; row++) {
      this.#lineCounter.clear();
      for (let col = 0; col < this.#cols; col++) {
        const player = this.#check(this.#board, row, col);
        if (player) {
          return player;
        }
      }
    }
  }

  #getDiagonalWinner(board) {
    for (let initRow = 0; initRow <= this.#rows - c4.LINE; initRow++) {
      for (let col = 0; col <= this.#cols - c4.LINE; col++) {
        this.#lineCounter.clear();
        for (let row = initRow; row < this.#rows; row++) {
          const player = this.#check(board, row, col + (row - initRow));
          if (player) {
            return player;
          }
        }
      }
    }
  }

  #check(board, row, col) {
    const piecePlayer = board[row][col];
    this.#lineCounter.setPiece(piecePlayer, row, col);
    if (this.#lineCounter.connect) {
      return piecePlayer;
    }
  }

  #transpose(board) {
    var newBoard = [];
    for (let row = board.length - 1; row >= 0; row--) {
      newBoard.push(board[row]);
    }
    return newBoard;
  }

  #transposeLine() {
    if (!this.line) {
      return;
    }
    const lineBoard = [];
    for (let row = 0; row < this.#rows; row++) {
      lineBoard[row] = [];
      for (let col = 0; col < this.#cols; col++) {
        lineBoard[row][col] = 0;
      }
    }
    for (const [lineRow, lineCol] of this.line) {
      lineBoard[lineRow][lineCol] = 1;
    }
    const transposedLineBoard = this.#transpose(lineBoard);
    this.line = [];
    for (let row = 0; row < this.#rows; row++) {
      for (let col = 0; col < this.#cols; col++) {
        if (transposedLineBoard[row][col]) {
          this.line.push([row, col]);
        }
      }
    }
  }

  #boardIsFull() {
    for (let row = 0; row < this.#rows; row++) {
      for (let col = 0; col < this.#cols; col++) {
        if (this.#board[row][col] === c4.EMPTY) {
          return false;
        }
      }
    }
    return true;
  }
}

export { BoardValidator };