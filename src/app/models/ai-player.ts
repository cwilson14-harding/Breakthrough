import {Player} from './player';
import {Coordinate} from './game-core/coordinate';
import {GameBoardComponent} from '../game-board/game-board.component';

export class AIPlayer implements Player {
  board: GameBoardComponent;
  private resolve: Function;
  private reject: Function;

  constructor() { }

  getMove(board: GameBoardComponent): Promise<[Coordinate, Coordinate]> {
    return new Promise<[Coordinate, Coordinate]>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.chooseMove(board);
    });
  }

  chooseMove(board: GameBoardComponent) {
    const possibleMoves: [Coordinate, Coordinate][] = [];

    for (let row = 0; row < 8; ++row) {
      for (let column = 0; column < 8; ++column) {
        const moves: Coordinate[] = board.findAvailableMoves([row, column]);

        for (let i = 0; i < moves.length; ++i) {
          possibleMoves.push([[row, column], moves[i]]);
        }
      }
    }

    if (possibleMoves.length > 0) {
      const index = Math.floor((Math.random() * possibleMoves.length));
      const fromLocation = possibleMoves[index][0];
      const toLocation = possibleMoves[index][1];
      this.resolve([fromLocation, toLocation]);
    } else {
      this.reject();
    }
  }
}
