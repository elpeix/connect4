import { Board } from "./Board";
import { BoardValidator } from "./BoardValidator";
import { c4 } from "./constants";

class ComputerPlayer {

    constructor(board, player) {
        this.board = board;
        this.rows = board.rows;
        this.cols = board.cols;
        this.player = player;
        this.validator = new BoardValidator(board.board, this.rows, this.cols);
    }

    getMove() {
        if (this.board.isFull()) {
            throw new Error("Board is full");
        }
        let move = this.#getWinningMove();
        if (move) {
            return move;
        }
        move = this.#getBlockingMove();
        if (move) {
            return move;
        }
        return this.#getRandomMove();
    }

    #getWinningMove() {
        return this.#getValidMove(this.player);
    }

    #getBlockingMove() {
        const opponent = this.player === c4.P1 ? c4.P2 : c4.P1;
        return this.#getValidMove(opponent);
    }

    #getValidMove(anyPlayer) {
        for (let col = 0; col < this.cols; col++) {
            if (this.board.isColumnFull(col)) {
                continue;
            }
            this.board.addPiece(anyPlayer, col);
            this.validator.validate();
            if (this.validator.winner === anyPlayer) {
                this.board.removePiece(col);
                return col;
            }
            this.board.removePiece(col);
        }
    }

    #getRandomMove() {
        let col = Math.floor(Math.random() * this.cols);
        while (this.board.isColumnFull(col)) {
            col = Math.floor(Math.random() * this.cols);
        }
        return col;
    }
}

export { ComputerPlayer };