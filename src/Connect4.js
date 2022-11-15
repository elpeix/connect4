import { Board } from "./Board";
import { BoardValidator } from "./BoardValidator";
import { c4 } from "./constants";

class Connect4 {

  status;
  player;
  winner;

  #board;
  #validator;

  constructor(rows, cols) {
    this.#board = new Board(rows, cols);
    this.reset();
  }

  addPiece(col) {
    if (this.status !== c4.PLAY) {
      throw new Error('Game is ended');
    }
    this.#board.addPiece(this.player, col);
    this.#validate();
    this.player = this.player === c4.P1 ? c4.P2 : c4.P1;
  }

  getNextPiecePosition(col) {
    if (this.status === c4.PLAY) {
      return [
        this.player,
        this.#board.getNextPiecePosition(col)
      ]
    }
  }

  getLastPiecePosition() {
    return this.#board.getLastPiecePosition();
  }

  undo() {
    this.#board.removeLastPiece();
    this.#validate();
    this.player = this.player === c4.P1 ? c4.P2 : c4.P1;
  }

  isColumnFull(col) {
    return this.#board.isColumnFull(col)
  }

  reset() {
    this.#board.reset();
    this.#validator = new BoardValidator(
      this.#board.board, 
      this.#board.rows,
      this.#board.cols
    );
    this.player = c4.P1;
    this.setValidatorStatus();
  }

  getBoard() {
    let board = [];
    for (let i = 0; i < this.#board.board.length; i++) {
      let row = [];
      for (let j = 0; j < this.#board.board[i].length; j++) {
        row.push(this.#board.board[i][j]);
      }
      board.push(row);
    }
    return board;
  }

  getPosition(row, col) {
    return this.#board.getPosition(row, col);
  }

  #validate() {
    this.#validator.validate();
    this.setValidatorStatus();
  }

  setValidatorStatus() {
    this.status = this.#validator.status;
    this.winner = this.#validator.winner;
    this.line = this.#validator.line;
  }

  toString() {
    return `Status: ${this.status}
      \n${this.#board.toString()}
      ${this.status == c4.PLAY ? `
        \nNext player: ${this.player}` : 'End game'
      }
    `
  }
}

export default Connect4;