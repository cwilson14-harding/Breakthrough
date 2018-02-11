import {Board} from '../board';
import {Move} from '../move';
import {Node} from './node';
import {Coordinate} from '../game-core/coordinate';

export class MCTS {
  get bestMove(): Move {
    let maxNodes: Node[] = [];
    let maxNodeScore = -1;

    // Find the node with the most evaluations.
    for (const node of this.currentNode.children) {
      const score = node.wins + node.losses;
      if (score > maxNodeScore) {
        maxNodes = [node];
        maxNodeScore = score;
      } else if (score === maxNodeScore) {
        maxNodes.push(node);
      }
    }

    // Return null if no possible moves.
    if (maxNodes.length === 0) { return null; }

    // Choose a random move from the top nodes.
    const chosenNode: Node = maxNodes[Math.floor(Math.random() * maxNodes.length)];

    // Find the move that was made.
    let from: Coordinate;
    let to: Coordinate;

    for (let r = 0; r < Board.BOARD_SIZE; ++r) {
      for (let c = 0; c < Board.BOARD_SIZE; ++c) {
        if (chosenNode.board.board[r][c] !== chosenNode.parent.board.board[r][c]) {
          const coordinate = new Coordinate(r, c)
          if (chosenNode.board.board[r][c] === 0) {
            from = coordinate;
          } else {
            to = coordinate;
          }
        }
      }
    }

    this.currentNode = chosenNode;
    return new Move(from, to);
  }

  rootNode: Node;
  currentNode: Node;

  constructor() {
    this.rootNode = new Node(new Board());
    this.currentNode = this.rootNode;
  }

  updateBoard(board: Board) {
    // Create the new board configuration.
    const newBoard: Board = new Board();
    newBoard.setBoardState(board.getBoardState());

    // Find or create the new node.
    let node = this.currentNode.findChildWithState(newBoard.getBoardState());
    if (node === null) {
      node = new Node(newBoard, this.currentNode);
      this.currentNode.children.push(node);
    }
    this.currentNode = node;
  }

  startSearch() {
    this.evaluateMoves(this.currentNode);
    console.log(this.currentNode);
  }

  stopSearch() {

  }

  evaluateMoves(node: Node) {
    // TODO: Go deeper...
    node.findAllChildren();
  }

  getMove(): Move {
    return this.bestMove;
  }

  private chooseRandomMove(moves: Move[]): Move {
    if (moves.length > 0) {
      const index = Math.floor((Math.random() * moves.length));
      return moves[index];
    } else {
      return null;
    }
  }
}
