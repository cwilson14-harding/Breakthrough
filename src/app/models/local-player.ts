import {Player} from './player';
import {Coordinate} from './game-core/coordinate';
import {GameBoardComponent} from '../game-board/game-board.component';


export class LocalPlayer implements Player {
  selectedCoordinate: Coordinate;
  board: GameBoardComponent;
  team: number;
  private resolve: Function;

  constructor(team: number) {
    this.team = team;
  }

  getMove(board: GameBoardComponent): Promise<[Coordinate, Coordinate]> {
    this.board = board;
    return new Promise<[Coordinate, Coordinate]>((resolve, reject) => {
      this.resolve = resolve;
    });
  }

  selectPiece(target: Coordinate) {
    const board: number[][] = this.board.board.getBoardState();
    if (this.selectedCoordinate !== undefined && this.selectedCoordinate[0] === target[0]
      && this.selectedCoordinate[1] === target[1]) {
      this.selectedCoordinate = undefined;
    } else if (board[target[0]][target[1]] === this.team) {
      this.selectedCoordinate = target;
    } else if (this.board.board.isMoveValid(this.selectedCoordinate, target)) {
      // Submit the move if it is valid.
      const coord = this.selectedCoordinate;
      this.selectedCoordinate = undefined;
      this.resolve([coord, target]);
    }
  }
}
