import {Coordinate} from './game-core/coordinate';
import {GameBoardComponent} from '../game-board/game-board.component';

export interface Player {
  getMove(board: GameBoardComponent): Promise<[Coordinate, Coordinate]>;
}
