import { Board } from "./Board";
import { BoardValidator } from "./BoardValidator";
import { ComputerPlayer } from "./ComputerPlayer";
import { c4 } from "./constants";

class Connect4 {

  status;
  player;
  winner;

  #board;
  #validator;
  #againstComputer;
  #computerPlayer;

  constructor(rows, cols, againstComputer) {
    this.#board = new Board(rows, cols);
    this.#againstComputer = againstComputer;
    this.#computerPlayer = c4.P2;
    this.reset();
  }

  playAgainstComputer(againstComputer) {
    this.#againstComputer = againstComputer;
  }

  addPiece(col, iamComputer) {
    this.#canIStillPlaying();
    if (this.#isComputerTurn(iamComputer)) {
      throw new Error('It is not your turn');
    }
    this.#board.addPiece(this.player, col);
    this.#validate();
    this.player = this.player === c4.P1 ? c4.P2 : c4.P1;
  }

  #isComputerTurn(iamComputer) {
    return this.#againstComputer === c4.PLAY_AGAINST_COMPUTER
      && this.player === this.#computerPlayer
      && !iamComputer;
  }

  #canIStillPlaying() {
    if (this.status !== c4.PLAY) {
      throw new Error('Game is ended');
    }
  }

  getNextPiecePosition(col, iamComputer) {
    if (this.status === c4.PLAY && !this.#isComputerTurn(iamComputer)) {
      return [
        this.player,
        this.#board.getNextPiecePosition(col)
      ]
    }
    return [null, null];
  }

  getLastPiecePosition() {
    return this.#board.getLastPiecePosition();
  }

  getComputerMove() {
    this.#canIStillPlaying();
    if (this.#againstComputer !== c4.PLAY_AGAINST_COMPUTER) {
      throw new Error('Not playing against computer');
    }
    if (this.player === this.#computerPlayer) {
      const computer = new ComputerPlayer(this.#board, this.player);
      return computer.getMove();
    }
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