import { TestBed, inject } from '@angular/core/testing';
import { AIBoard } from '../app/models/ai/aiboard';
import {Move} from '../app/models/move';
import {Coordinate} from '../app/models/game-core/coordinate';

describe('AIBoard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    });
  });

  it('should be created', inject([], () => {
    expect(new AIBoard()).toBeTruthy();
  }));

  it('should start a new game', inject([], () => {
    const board: AIBoard = new AIBoard();
    board.newGame();
    expect(board.board.length === 64 && board.board[0] === -1 && board.board[63] === 1 && board.turn === -1).toBeTruthy();
  }));

  it('should detect when the game is not over', inject([], () => {
    const board: AIBoard = new AIBoard();
    board.newGame();
    expect(board.isGameOver).toBe(0);
  }));

  it('should detect valid straight moves', inject([], () => {
    const board: AIBoard = new AIBoard();
    board.newGame();
    const move: Move = new Move(new Coordinate(1, 0), new Coordinate(2, 0));
    expect(board.isValidMove(move)).toBeTruthy();
  }));

  it('should detect invalid diagonal moves', inject([], () => {
    const board: AIBoard = new AIBoard();
    board.newGame();
    const move: Move = new Move(new Coordinate(1, 0), new Coordinate(1, 7));
    expect(board.isValidMove(move)).toBeFalsy();
  }));

  it('should make valid moves', inject([], () => {
    const board: AIBoard = new AIBoard();
    board.newGame();
    const move: Move = new Move(new Coordinate(1, 0), new Coordinate(2, 0));
    expect(board.makeMove(move) && board[move.fromIndex] === 0 && board[move.toIndex] === -1).toBeTruthy();
  }));

  it('should not make invalid moves', inject([], () => {
    const board: AIBoard = new AIBoard();
    board.newGame();
    const move: Move = new Move(new Coordinate(1, 0), new Coordinate(2, 0));
    expect(board.makeMove(move)).toBeFalsy();
  }));
});
