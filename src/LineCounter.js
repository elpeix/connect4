import { c4 } from "./constants";

export class LineCounter {

  connect;
  pieces;
  #count;
  #actualPiece;

  constructor() {
    this.clear();
  }

  clear() {
    this.#actualPiece = c4.EMPTY;
    this.#count = 1;
    this.connect = false;
    this.pieces = [];
  }

  setPiece(piece, row, col) {
    if (piece === c4.EMPTY || piece === undefined) {
      this.#count = 1;
      this.pieces = [];
      this.#actualPiece = c4.EMPTY;
      return;
    }
    if (piece !== this.#actualPiece) {
      this.#count = 1;
      this.pieces = [];
      this.pieces.push([row, col]);
      this.#actualPiece = piece;
      return;
    }
    this.pieces.push([row, col]);
    this.#count += 1;
    if (this.#count === c4.LINE) {
      this.connect = true;
    }
  }
}
