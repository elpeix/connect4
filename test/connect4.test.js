import { describe, expect, it } from "vitest";
import Connect4 from "../src/Connect4";
import { c4 } from "../src/constants";

describe('connect4 board test', () => {

  it('puts de player 1 piece on first play', () => {
    const connect4 = new Connect4(6, 7)
    expect(connect4.player).toBe(c4.P1)
  })

  it('puts de player 1 piece on first play', () => {
    const rows = 6
    const cols = 7
    const connect4 = new Connect4(rows, cols)
    expect(connect4.player).toBe(c4.P1)
    connect4.addPiece(0)
    expect(connect4.player).toBe(c4.P2)
  })

  it('puts de player 2 piece on second play', () => {
    const connect4 = new Connect4(7, 6)
    connect4.addPiece(0)
    connect4.addPiece(0)
    expect(connect4.getPosition(1, 0)).toBe(c4.P2)
  })

  it('puts de player 1 piece after plays player 2', () => {
    const connect4 = new Connect4(7, 6)
    connect4.addPiece(0)
    connect4.addPiece(0)
    connect4.addPiece(0)
    expect(connect4.getPosition(2, 0)).toBe(c4.P1)
  })

  it('puts de player 2 piece after plays player 1', () => {
    const connect4 = new Connect4(7, 6)
    connect4.addPiece(0) // P1
    connect4.addPiece(1) // P2
    connect4.addPiece(0) // P1
    connect4.addPiece(2) // P2
    connect4.addPiece(3) // P1
    connect4.addPiece(1) // P2
    expect(connect4.getBoard()[1][1]).toBe(c4.P2)
  })

  it('puts de player 1 piece after plays player 1 again', () => {
    const connect4 = new Connect4(7, 6)
    connect4.addPiece(0) // P1
    connect4.addPiece(1) // P2
    connect4.addPiece(0) // P1
    connect4.addPiece(2) // P2
    connect4.addPiece(3) // P1
    connect4.addPiece(1) // P2
    connect4.addPiece(0) // P1
    connect4.addPiece(2) // P2
    connect4.addPiece(3) // P1
    expect(connect4.getPosition(1, 3)).toBe(c4.P1)
  })

  it('throws an error when column is full', () => {
    const connect4 = new Connect4(4, 4)
    connect4.addPiece(0)
    connect4.addPiece(0)
    connect4.addPiece(0)
    connect4.addPiece(0)
    expect(() => connect4.addPiece(0)).toThrow('Column is full')
  })

  it('returns false if column is full', () => {
    const connect4 = new Connect4(4, 4)
    connect4.addPiece(0)
    connect4.addPiece(0)
    connect4.addPiece(0)
    expect(connect4.isColumnFull(0)).toBe(false)
  })

  it('returns true if column is full', () => {
    const connect4 = new Connect4(4, 4)
    connect4.addPiece(0)
    connect4.addPiece(0)
    connect4.addPiece(0)
    connect4.addPiece(0)
    expect(connect4.isColumnFull(0)).toBe(true)
  })
  
  it('must has a function for reset game', () => {
    const connect4 = new Connect4(4, 4)
    connect4.addPiece(0)
    connect4.addPiece(0)
    connect4.reset()
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        expect(connect4.getPosition(i, j)).toBe(c4.EMPTY)
      }
    }
  })

  it('after reset game it should plays with player 1', () => {
    const connect4 = new Connect4(4, 4)
    connect4.addPiece(0)
    connect4.reset()
    connect4.addPiece(0)
    expect(connect4.getPosition(0, 0)).toBe(c4.P1)
  })

  it('has PLAY status at the begining', () => {
    const connect4 = new Connect4(4, 4)
    expect(connect4.status).toBe(c4.PLAY)
  })

  it('has PLAY status after reset', () => {
    const connect4 = new Connect4(4, 4)
    connect4.addPiece(1)
    connect4.reset()
    expect(connect4.status).toBe(c4.PLAY)
  })

  it('throws an error if status is not PLAY', () => {
    const connect4 = new Connect4(5, 4)
    connect4.addPiece(1) // P1
    connect4.addPiece(2)
    connect4.addPiece(1) // P1
    connect4.addPiece(2)
    connect4.addPiece(1) // P1
    connect4.addPiece(2)
    connect4.addPiece(1) // P1
    expect(() => connect4.addPiece(2)).toThrow('Game is ended')
  })

  it('throws an error if it try to get computer move when status is not PLAY', () => {
    const connect4 = new Connect4(5, 4)
    connect4.addPiece(1) // P1
    connect4.addPiece(2)
    connect4.addPiece(1) // P1
    connect4.addPiece(2)
    connect4.addPiece(1) // P1
    connect4.addPiece(2)
    connect4.addPiece(1) // P1
    expect(() => connect4.getComputerMove()).toThrow('Game is ended')
  })

  it('throws and error if addPiece when it plays against computer, player is P2 and iamComputer is false', () => {
    const connect4 = new Connect4(5, 4, c4.PLAY_AGAINST_COMPUTER)
    connect4.addPiece(1) // P1
    expect(() => connect4.addPiece(2)).toThrow('It is not your turn')
  })

  it('throws an error if it try to get computer move when game is not against computer', () => {
    const connect4 = new Connect4(5, 4)
    connect4.addPiece(1) // P1
    expect(() => connect4.getComputerMove()).toThrow('Not playing against computer');
  })

  it('returns computer move when status is PLAY', () => {
    const connect4 = new Connect4(5, 4, c4.PLAY_AGAINST_COMPUTER)
    connect4.addPiece(1) // P1
    connect4.addPiece(2, true)
    connect4.addPiece(1) // P1
    connect4.addPiece(2, true)
    connect4.addPiece(1) // P1
    expect(connect4.getComputerMove()).toBe(1)
  });

})
