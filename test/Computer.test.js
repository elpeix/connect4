import { describe, it, expect } from "vitest";
import { Board } from "../src/Board";
import { ComputerPlayer } from "../src/ComputerPlayer";
import { c4 } from "../src/constants";

describe("Computer player tests", () => {
    it("should return a valid move", () => {
        const board = new Board(7, 6);
        const computer = new ComputerPlayer(board, c4.P1);
        const move = computer.getMove();
        expect(move).toBeGreaterThanOrEqual(0);
        expect(move).toBeLessThanOrEqual(7);
    });

    it("should return a winning move", () => {
        const board = new Board(6, 7);
        board.addPiece(c4.P1, 0);
        board.addPiece(c4.P1, 1);
        board.addPiece(c4.P1, 2);
        const computer = new ComputerPlayer(board, c4.P1);
        const move = computer.getMove();
        expect(move).toBe(3);
    });

    it("should return a winning move in the middle column", () => {
        const board = new Board(6, 7);
        board.addPiece(c4.P1, 3);
        board.addPiece(c4.P1, 3);
        board.addPiece(c4.P1, 3);
        const computer = new ComputerPlayer(board, c4.P1);
        const move = computer.getMove();
        expect(move).toBe(3);
    });

    it("should return a winnig in a diagonal", () => {
        const board = new Board(6, 7);
        board.addPiece(c4.P1, 0);
        board.addPiece(c4.P2, 1);
        board.addPiece(c4.P1, 1);
        board.addPiece(c4.P2, 2);
        board.addPiece(c4.P1, 2);
        board.addPiece(c4.P2, 0);
        board.addPiece(c4.P1, 2);
        board.addPiece(c4.P2, 2);
        board.addPiece(c4.P1, 3);
        board.addPiece(c4.P2, 3);
        board.addPiece(c4.P1, 3);
        board.addPiece(c4.P2, 2);
        const computer = new ComputerPlayer(board, c4.P1);
        const move = computer.getMove();
        expect(move).toBe(3);
    });

    it("should return a winnig in a diagonal upside down", () => {
        const board = new Board(6, 7);
        board.addPiece(c4.P1, 3);
        board.addPiece(c4.P2, 2);
        board.addPiece(c4.P1, 4);
        board.addPiece(c4.P2, 2);
        board.addPiece(c4.P1, 3);
        board.addPiece(c4.P2, 5);
        board.addPiece(c4.P1, 2);
        board.addPiece(c4.P2, 1);
        board.addPiece(c4.P1, 1);
        board.addPiece(c4.P2, 1);
        const computer = new ComputerPlayer(board, c4.P1);
        const move = computer.getMove();
        expect(move).toBe(1);
    });

    it("should block a winning move", () => {
        const board = new Board(6, 7);
        board.addPiece(c4.P2, 0);
        board.addPiece(c4.P2, 1);
        board.addPiece(c4.P2, 2);
        const computer = new ComputerPlayer(board, c4.P1);
        const move = computer.getMove();
        expect(move).toBe(3);
    });

    it("should block a winning move in a different column", () => {
        const board = new Board(6, 7);
        board.addPiece(c4.P1, 3);
        board.addPiece(c4.P2, 2);
        board.addPiece(c4.P1, 4);
        board.addPiece(c4.P2, 1);
        board.addPiece(c4.P1, 5);
        const computer = new ComputerPlayer(board, c4.P2);
        const move = computer.getMove();
        expect(move).toBe(6);
    });

    it("should block a winning move in a diagonal", () => {
        const board = new Board(6, 7);
        board.addPiece(c4.P1, 0);
        board.addPiece(c4.P2, 1);
        board.addPiece(c4.P1, 1);
        board.addPiece(c4.P2, 2);
        board.addPiece(c4.P1, 2);
        board.addPiece(c4.P2, 0);
        board.addPiece(c4.P1, 2);
        board.addPiece(c4.P2, 2);
        board.addPiece(c4.P1, 3);
        board.addPiece(c4.P2, 3);
        board.addPiece(c4.P1, 3);
        const computer = new ComputerPlayer(board, c4.P2);
        const move = computer.getMove();
        expect(move).toBe(3);
    });

    it("should block a winning move in a diagonal upside down", () => {
        const board = new Board(6, 7);
        board.addPiece(c4.P1, 3);
        board.addPiece(c4.P2, 4);
        board.addPiece(c4.P1, 3);
        board.addPiece(c4.P2, 2);
        board.addPiece(c4.P1, 1);
        board.addPiece(c4.P2, 4);
        board.addPiece(c4.P1, 2);
        board.addPiece(c4.P2, 3);
        board.addPiece(c4.P1, 2);
        board.addPiece(c4.P2, 5);
        const computer = new ComputerPlayer(board, c4.P2);
        const move = computer.getMove();
        expect(move).toBe(2);
    });

    it("should throw an error if the board is full", () => {
        const board = new Board(6, 7);
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                board.addPiece(c4.P1, col);
            }
        }
        const computer = new ComputerPlayer(board, c4.P1);
        expect(() => computer.getMove()).toThrow("Board is full");
    });
});