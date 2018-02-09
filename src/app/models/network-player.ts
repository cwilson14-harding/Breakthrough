import {Player} from './player';
import {Coordinate} from './game-core/coordinate';
import {GameBoardComponent} from '../game-board/game-board.component';

export class NetworkPlayer implements Player {
  board: GameBoardComponent;
  private resolve: Function;
  private reject: Function;

  constructor() { }

  getMove(board: GameBoardComponent): Promise<[Coordinate, Coordinate]> {
    return new Promise<[Coordinate, Coordinate]>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
