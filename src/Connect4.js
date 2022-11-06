const c4 = {
  EMPTY: "_",
  P1: "O",
  P2: "X",
  LINE: 4,

  PLAY: "PLAY",
  END_GAME: "END_GAME",
  DRAW: "DRAW"
}

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
    return this.#board.lastPiecePosition
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

class Board {
  rows;
  cols;
  board;

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
    const [row] = this.getNextPiecePosition(col)
    this.board[row][col] = player;
    this.lastPiecePosition = [row, col];
    return;
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

  reset() {
    for (let row = 0; row < this.rows; row++) {
      this.board[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.board[row][col] = c4.EMPTY;
      }
    }
    this.lastPiecePosition = [];
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
    let str = ''
    for (let row = this.rows - 1; row >= 0; row--) {
      str += `${row} | `
      for (let col = 0; col < this.cols; col++) {
        str += `${this.board[row][col]} `;
      }
      str += '\n';
    }
    str += `  + `
    for (let col = 0; col < this.cols; col++) {
      str += `--`
    }
    str += '\n    ';
    for (let col = 0; col < this.cols; col++) {
      str += `${col} `
    }
    str += '\n';
    return str;
  }
}

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
      return this.#setWinner(player)
    }
    player = this.#getRowWinner();
    if (player) {
      return this.#setWinner(player)
    }
    player = this.#getDiagonalWinner(this.#board);
    if (player) {
      return this.#setWinner(player)
    }
    player = this.#getDiagonalWinner(this.#transpose(this.#board))
    if (player) {
      this.#setWinner(player)
      this.#transposeLine()
      return
    }
    if (this.#boardIsFull()){
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
        const player = this.#check(this.#board, row, col)
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
        const player = this.#check(this.#board, row, col)
        if (player) {
          return player;
        }
      }
    }
  }

  #getDiagonalWinner(board) {
    for (let initRow = 0; initRow <= this.#rows - c4.LINE; initRow++) {
      for (let col = 0; col <= this.#cols - c4.LINE; col++) {
        this.#lineCounter.clear()
        for (let row = initRow; row < this.#rows; row++) {
          const player = this.#check(board, row, col+(row-initRow))
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
    var newBoard = []
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
      lineBoard[row] = []
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

class LineCounter {

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
      this.pieces.push([row, col])
      this.#actualPiece = piece;
      return;
    }
    this.pieces.push([row, col])
    this.#count += 1;
    if (this.#count === c4.LINE) {
      this.connect = true;
    }
  }
}

export default Connect4;
export { c4, Board, BoardValidator };