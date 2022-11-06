import { describe, expect, it } from "vitest";
import { Board, c4 } from "../src/Connect4";

describe('Board tests', () => {
  it('throws an error if two params are not numbers', () => {
    expect(() => new Board()).toThrow('Invalid type params')
  })
  
  it('throws error if two params are lower than 4', () => {
    expect(() => new Board(3, 11)).toThrow('Range params must be in [4, 10]')
  })

  it('throws en error if two params are greather than 10', () => {
    expect(() => new Board(4, 11)).toThrow('Range params must be in [4, 10]')
  })

  it('creates an array called board', () => {
    expect(Array.isArray(new Board(7,6).board)).toBe(true)
  })

  it('creates a two dimensional array called board', () => {
    const cols = 7
    const rows = 6
    const board = new Board(cols, rows).board
    expect(board).length(cols)
    for (let i = 0; i < cols; i++) {
      expect(board[i]).length(rows)
    }
  })

  it('creates an empty board [0: empty, 1: P1, 2: P2]', () => {
    const cols = 7
    const rows = 6
    const board = new Board(cols, rows).board
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        expect(board[i][j]).toBe(c4.EMPTY)
      }
    }
  })

  it('throws an error when addPiece has an Invalid param', () => {
    const board = new Board(4, 4)
    expect(() => board.addPiece(c4.P1, [])).toThrow('col must be a number')
  })

  it('throws an error when player is not P2 or P2', () => {
    const board = new Board(4, 4)
    expect(() => board.addPiece(undefined, 0)).toThrow('Invalid player')
  })

  it('throws an error when addPiece has lower range col value', () => {
    const board = new Board(4, 4)
    expect(() => board.addPiece(c4.P1, -1)).toThrow('col must be in range [0, 3]')
  })

  it('throws an error when addPiece has lower range col value board 2', () => {
    const board = new Board(7, 6)
    expect(() => board.addPiece(c4.P1, -1)).toThrow('col must be in range [0, 6]')
  })

  it('throws an error when addPiece has upper range col value', () => {
    const board = new Board(7, 6)
    expect(() => board.addPiece(c4.P1, 8)).toThrow('col must be in range [0, 6]')
  })

  it('puts the piece at first row if board column is empty (1)', () => {
    const rows = 6
    const cols = 7
    const board = new Board(rows, cols)
    board.addPiece(c4.P1, 0)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const assertion = expect(board.board[i][j], `position ${i}, ${j}`)
        if (i == 0 && j == 0) {
          assertion.not.toBe(c4.EMPTY)
        } else {
          assertion.toBe(c4.EMPTY)
        }
      }
    }
  })

  it('throws an error isColumnFull param is not valid', () => {
    const board = new Board(4, 4)
    expect(() => board.isColumnFull(-12)).toThrow()
  })

  it('returns false if column is not full', () => {
    const board = new Board(4, 4)
    expect(board.isColumnFull(0)).toBe(false)
  })

  it('returns false if column is full', () => {
    const board = new Board(4, 4)
    board.addPiece(c4.P1, 0);
    board.addPiece(c4.P2, 0);
    board.addPiece(c4.P1, 0);
    board.addPiece(c4.P2, 0);
    expect(board.isColumnFull(0)).toBe(true)
  })

  it('has empty array called lastPiecePosition', () => {
    const board = new Board(4, 4)
    expect(board.lastPiecePosition).toStrictEqual([])
  })

  it('has filled array called lastPiecePosition after add a piece', () => {
    const board = new Board(4, 4)
    board.addPiece(c4.P1, 1);
    expect(board.lastPiecePosition).toStrictEqual([0, 1])
  })

  it('has empty array called lastPiecePosition after reset', () => {
    const board = new Board(4, 4)
    board.addPiece(c4.P1, 1);
    board.reset();
    expect(board.lastPiecePosition).toStrictEqual([])
  })

  it('returns drop piece position', () => {
    const board = new Board(4, 4)
    board.getNextPiecePosition(1)
  })
})