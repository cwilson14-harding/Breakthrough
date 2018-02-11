import {Player} from './player';
import {Coordinate} from './game-core/coordinate';
import {GameBoardComponent} from '../game-board/game-board.component';
import {Move} from './move';
import {MCTS} from './ai/mcts';
import {Board} from './board';

export class AIPlayer implements Player {
  board: GameBoardComponent;
  private resolve: Function;
  private reject: Function;
  private mcts: MCTS = new MCTS();

  constructor() {}

  getMove(board: GameBoardComponent): Promise<Move> {
    this.mcts.updateBoard(board.board);
    this.mcts.startSearch();

    return new Promise<Move>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      setTimeout(() => {
        this.mcts.stopSearch();
        const move: Move = this.mcts.getMove();
        if (move) {
          this.resolve(move);
        } else {
          this.reject();
        }
      }, 5500);
      // this.chooseRandomMove(board.board);
    });
  }






  chooseRandomMove(board: Board) {
    const possibleMoves: Move[] = [];

    for (let row = 0; row < 8; ++row) {
      for (let column = 0; column < 8; ++column) {
        const moves: Coordinate[] = board.findAvailableMoves(new Coordinate(row, column));

        for (let i = 0; i < moves.length; ++i) {
          possibleMoves.push(new Move(new Coordinate(row, column), moves[i]));
        }
      }
    }

    if (possibleMoves.length > 0) {
      const index = Math.floor((Math.random() * possibleMoves.length));
      this.resolve(possibleMoves[index]);
    } else {
      this.reject();
    }
  }
}
