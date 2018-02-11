import {Board} from '../board';
import {Move} from '../move';
import {Coordinate} from '../game-core/coordinate';

export class Node {
  constructor(public board: Board, public parent = null) {
    this.state = board.getBoardState();
  }
  children: Node[] = [];
  state: string;
  wins = 0;
  losses = 0;

  findAllChildren() {
    for (const move of this.findAllAvailableMoves(this.board)) {
      // Create the new board configuration.
      const newBoard: Board = new Board();
      newBoard.setBoardState(this.board.getBoardState());

      // Create new nodes for all the moves.
      newBoard.makeMove(move);
      this.children.push(new Node(newBoard, this));
    }
  }

  findChildWithState(state: string): Node {
    for (const node of this.children) {
      if (node.state === state) {
        return node;
      }
    }
    return null;
  }

  private findAllAvailableMoves(board: Board) {
    const possibleMoves: Move[] = [];

    for (let row = 0; row < 8; ++row) {
      for (let column = 0; column < 8; ++column) {
        const moves: Coordinate[] = board.findAvailableMoves(new Coordinate(row, column));

        for (let i = 0; i < moves.length; ++i) {
          possibleMoves.push(new Move(new Coordinate(row, column), moves[i]));
        }
      }
    }
    return possibleMoves;
  }
}
