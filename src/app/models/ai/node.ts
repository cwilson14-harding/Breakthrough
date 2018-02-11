import {Board} from '../board';
import {Move} from '../move';
import {Coordinate} from '../game-core/coordinate';

export class Node {
  constructor(public board: Board, public parent = null) {
    this.state = board.getBoardState();
  }
  children: Node[] = [];
  state: string;
  p1wins = 0;
  p2wins = 0;
  childrenEvaluated: Boolean = false;

  get evaluationCount(): number {
    return this.p1wins + this.p2wins;
  }

  getWinRatio(team: number): number {
    return (team === 1) ? (this.p1wins / this.p2wins) : (this.p2wins / this.p1wins);
  }

  // Return all nodes for all the possible moves with this board state.
  getAllChildren(): Node[] {
    // Skip evaluation if we have already gotten all children.
    if (!this.childrenEvaluated) {

      // Create all the children.
      for (const move of this.findAllAvailableMoves(this.board)) {
        // Create the new board configuration.
        const newBoard: Board = new Board();
        newBoard.setBoardState(this.board.getBoardState());

        // Create new nodes for all the moves.
        newBoard.makeMove(move);
        this.children.push(new Node(newBoard, this));
      }
    }

    return this.children;
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
