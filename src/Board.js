import { c4 } from "./constants";

class Board {
  rows;
  cols;
  board;
  pieces;

  constructor(rows, cols) {
    if (typeof rows !== 'number' || typeof cols !== 'number') {
      throw new Error('Invalid type params');
    }
    if (rows < 4 || rows > 10 || cols < 4 || cols > 10) {
      throw new Error('Range params must be in [4, 10]');
    }

    this.rows = rows;
    this.cols = cols;
    this.board = [];
    this.reset();
  }

  addPiece(player, col) {
    if (player !== c4.P1 && player !== c4.P2) {
      throw new Error('Invalid player');
    }
    const [row] = this.getNextPiecePosition(col);
    this.board[row][col] = player;
    this.pieces.push([row, col]);
    return;
  }

  removePiece(col) {
    this.#validateCol(col);
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.board[row][col] !== c4.EMPTY) {
        this.board[row][col] = c4.EMPTY;
        this.pieces = this.pieces.filter((piece) => piece[0] !== row || piece[1] !== col);
        return;
      }
    }
    throw new Error('Column is empty');
  }

  removeLastPiece() {
    const lastPiecePosition = this.getLastPiecePosition();
    if (lastPiecePosition.length === 0) {
      throw new Error('No pieces');
    }
    const [, col] = lastPiecePosition;
    this.removePiece(col);
  }

  getNextPiecePosition(col) {
    this.#validateCol(col);
    for (let row = 0; row < this.rows; row++) {
      if (this.board[row][col] === c4.EMPTY) {
        return [row, col];
      }
    }
    throw new Error('Column is full');
  }

  getLastPiecePosition() {
    if (this.pieces.length === 0) {
      return [];
    }
    return this.pieces[this.pieces.length - 1];
  }

  #validateCol(col) {
    if (typeof col !== 'number') {
      throw new Error('col must be a number');
    }
    if (col < 0 || col > this.rows) {
      throw new Error(`col must be in range [0, ${this.rows - 1}]`);
    }
  }

  isColumnFull(col) {
    this.#validateCol(col);
    for (let row = 0; row < this.rows; row++) {
      if (this.board[row][col] === c4.EMPTY) {
        return false;
      }
    }
    return true;
  }

  isFull() {
    return this.pieces.length === this.rows * this.cols;
  }

  reset() {
    for (let row = 0; row < this.rows; row++) {
      this.board[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.board[row][col] = c4.EMPTY;
      }
    }
    this.pieces = [];
  }

  getPosition(row, col) {
    if (typeof col !== 'number' || typeof row !== 'number') {
      throw new Error('Invalid params');
    }
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
      throw new Error('Invalid params');
    }
    return this.board[row][col];
  }

  toString() {
    let str = '';
    for (let row = this.rows - 1; row >= 0; row--) {
      str += `${row} | `;
      for (let col = 0; col < this.cols; col++) {
        str += `${this.board[row][col]} `;
      }
      str += '\n';
    }
    str += `  + `;
    for (let col = 0; col < this.cols; col++) {
      str += `--`;
    }
    str += '\n    ';
    for (let col = 0; col < this.cols; col++) {
      str += `${col} `;
    }
    str += '\n';
    return str;
  }
}

export { Board };