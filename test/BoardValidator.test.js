import { describe, expect, it } from "vitest";
import { BoardValidator } from "../src/BoardValidator";
import { c4 } from "../src/constants";

const o = c4.P1
const x = c4.P2
const _ = c4.EMPTY

describe('Board validator test', () => {

  it('has PLAY status if board is empty', () => {
    const board = transpose([
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ])
    const validator = new BoardValidator(board, 5, 4)
    validator.validate()
    expect(validator.status).toBe(c4.PLAY)
    expect(validator.winner).toBe(undefined)
  })

  it('has PLAY status with undefined winner in the middle of game', () => {
    const board = transpose([
      [_,_,_,_],
      [_,_,_,_],
      [o,x,_,_],
      [o,o,_,_],
      [o,x,x,_]
    ])
    const validator = new BoardValidator(board, 5, 4)
    validator.validate()
    expect(validator.status).toBe(c4.PLAY)
    expect(validator.winner).toBe(undefined)
  })

  it('wins player 1 with pieces in a col and status is END_GAME', () => {
    const board = transpose([
      [_,_,_,_],
      [o,_,_,_],
      [o,x,_,_],
      [o,x,_,_],
      [o,x,_,_]
    ])
    const validator = new BoardValidator(board, 5, 4)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.P1)
  })

  it('wins player 2 with pieces in a col', () => {
    const board = transpose([
      [_,_,_,_],
      [_,_,x,_],
      [_,o,x,_],
      [_,o,x,_],
      [_,o,x,o]
    ])
    const validator = new BoardValidator(board, 5, 4)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.P2)
  })

  it('wins player 1 with pieces in a row', () => {
    const board = transpose([
      [_,_,_,_],
      [x,_,_,_],
      [x,_,_,_],
      [x,_,_,_],
      [o,o,o,o]
    ])
    const validator = new BoardValidator(board, 5, 4)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.P1)
    expect(validator.getConnectedPieces()).length(c4.LINE)
    expect(validator.getConnectedPieces()[0]).toStrictEqual([0,0])
    expect(validator.getConnectedPieces()[1]).toStrictEqual([0,1])
    expect(validator.getConnectedPieces()[2]).toStrictEqual([0,2])
    expect(validator.getConnectedPieces()[3]).toStrictEqual([0,3])
  })
  
  it('wins player 1 with pieces in a row', () => {
    const board = transpose([
      [_,_,_,_],
      [_,_,_,_],
      [o,o,_,_],
      [x,x,x,x],
      [o,o,o,x]
    ])
    const validator = new BoardValidator(board, 5, 4)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.P2)
  })

  it('wins player 1 with pieces in a diagonal up', () => {
    const board = transpose([
      [_,_,_,_],
      [_,_,_,o],
      [_,o,o,x],
      [_,o,x,o],
      [o,x,x,x]
    ])
    const validator = new BoardValidator(board, 5, 4)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.P1)
  })

  it('it wins player 2 with pieces in a diagonal up', () => {
    const board = transpose([
      [_,o,_,_,_],
      [_,o,o,_,x],
      [_,x,x,x,o],
      [o,o,x,x,x],
      [o,x,o,x,o]
    ])
    const validator = new BoardValidator(board, 5, 5)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.P2)
  })
  
  it('it wins player 2 with pieces in a diagonal up row2', () => {
    const board = transpose([
      [_,_,_,x,_],
      [_,_,x,x,_],
      [o,x,o,o,_],
      [x,o,x,x,_],
      [o,o,x,o,o]
    ])
    const validator = new BoardValidator(board, 5, 5)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.P2)
  })
  
  it('it wins player 2 with pieces in a diagonal down', () => {
    const board = transpose([
      [o,_,_,_,_],
      [x,o,_,_,_],
      [o,x,_,_,_],
      [x,x,x,_,_],
      [o,o,o,x,_]
    ])
    const validator = new BoardValidator(board, 5, 5)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.P2)
  })

  it('it wins player 2 with pieces in a diagonal down 2', () => {
    const board = transpose([
      [x,_,_,_,_],
      [x,o,x,_,_],
      [o,o,o,x,_],
      [x,x,o,o,_],
      [o,o,x,x,o]
    ])
    const validator = new BoardValidator(board, 5, 5)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.P1)
  })

  it('wins player 2 diagonal down', () => {
    const board = transpose([
      [_,x,o,o,o,_,_], 
      [_,x,x,x,o,x,_], 
      [_,o,o,x,o,o,_], 
      [x,o,o,x,x,x,o], 
      [x,x,x,o,o,o,x], 
      [o,o,o,x,x,o,x]
    ])
    const validator = new BoardValidator(board, 6, 7)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.P2)
  })

  it('winer is DRAW if board is full without any winner', () => {
    const board = transpose([
      [x,o,x,o],
      [x,o,x,o],
      [o,o,o,x],
      [o,x,x,o],
      [o,x,x,x]
    ])
    const validator = new BoardValidator(board, 5, 4)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.winner).toBe(c4.DRAW)
  })

  it('line counter has length 4 and valid items row', () => {
    const board = transpose([
      [_,_,_,_,_,_,_], 
      [_,_,_,_,_,o,_], 
      [_,_,_,o,o,o,_], 
      [_,_,o,o,x,o,_], 
      [x,x,x,x,o,x,_], 
      [x,x,x,o,x,o,_]
    ])
    const validator = new BoardValidator(board, 6, 7)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.line).length(4)
    expect(validator.line[0]).toStrictEqual([1,0])
    expect(validator.line[1]).toStrictEqual([1,1])
    expect(validator.line[2]).toStrictEqual([1,2])
    expect(validator.line[3]).toStrictEqual([1,3])
  })

  it('line counter has length 4 and valid items column', () => {
    const board = transpose([
      [_,_,_,_,_,o,_], 
      [_,_,_,o,_,o,_], 
      [_,_,_,o,o,o,_], 
      [x,_,o,o,x,o,_], 
      [x,_,x,x,o,x,_], 
      [x,x,x,o,x,o,x]
    ])
    const validator = new BoardValidator(board, 6, 7)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.line).length(4)
    expect(validator.line[0]).toStrictEqual([5,5])
    expect(validator.line[1]).toStrictEqual([4,5])
    expect(validator.line[2]).toStrictEqual([3,5])
    expect(validator.line[3]).toStrictEqual([2,5])
  })

  it('line counter has length 4 and valid items diagona up', () => {
    const board = transpose([
      [_,_,_,_,_,_,_], 
      [_,_,_,_,_,o,_], 
      [_,_,_,_,o,o,_], 
      [_,_,_,o,x,o,_], 
      [x,_,o,x,o,x,_], 
      [x,x,x,o,x,o,_]
    ])
    const validator = new BoardValidator(board, 6, 7)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.line).length(4)
    expect(validator.line[0]).toStrictEqual([1,2])
    expect(validator.line[1]).toStrictEqual([2,3])
    expect(validator.line[2]).toStrictEqual([3,4])
    expect(validator.line[3]).toStrictEqual([4,5])
  })

  it('line counter has length 4 and valid items diagona down', () => {
    const board = transpose([
      [_,_,_,_,_,_,_], 
      [_,_,_,_,_,o,_], 
      [_,_,_,x,o,o,_], 
      [_,_,_,o,x,o,_], 
      [x,o,_,x,o,x,o], 
      [x,x,x,o,x,o,x]
    ])
    const validator = new BoardValidator(board, 6, 7)
    validator.validate()
    expect(validator.status).toBe(c4.END_GAME)
    expect(validator.line).length(4)
    expect(validator.line[0]).toStrictEqual([0,6])
    expect(validator.line[1]).toStrictEqual([1,5])
    expect(validator.line[2]).toStrictEqual([2,4])
    expect(validator.line[3]).toStrictEqual([3,3])
  })

})

const transpose = (board) => {
  var newBoard = []
  for (let row = board.length - 1; row >= 0; row--) {
    newBoard.push(board[row]);
  }
  return newBoard;
}