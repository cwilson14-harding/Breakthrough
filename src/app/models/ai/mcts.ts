import {Board} from '../board';
import {Move} from '../move';
import {Node} from './node';
import {Coordinate} from '../game-core/coordinate';

export class MCTS {

  rootNode: Node;
  currentNode: Node;
  canExecute: Boolean = false;

  get bestMove(): Move {
    let maxNodes: Node[] = [];
    let maxNodeScore = -1;

    // Find the node with the most evaluations.
    for (const node of this.currentNode.getAllChildren()) {
      // Get the current score for this node.
      const score = node.evaluationCount;

      // Check if the score is the highest.
      if (score > maxNodeScore) {

        // New score is higher than previous.
        maxNodes = [node];
        maxNodeScore = score;
      } else if (score === maxNodeScore) {

        // New score is equal to previous.
        maxNodes.push(node);
      }
    }

    // Return null if no possible moves.
    if (maxNodes.length === 0) { return null; }

    // Choose a random move from the top nodes.
    const chosenNode: Node = MCTS.chooseRandom<Node>(maxNodes);

    // Find the move that was made.
    let from: Coordinate;
    let to: Coordinate;

    for (let r = 0; r < Board.BOARD_SIZE; ++r) {
      for (let c = 0; c < Board.BOARD_SIZE; ++c) {
        if (chosenNode.board.board[r][c] !== chosenNode.parent.board.board[r][c]) {
          const coordinate = new Coordinate(r, c);
          if (chosenNode.board.board[r][c] === 0) {
            from = coordinate;
          } else {
            to = coordinate;
          }
        }
      }
    }

    // Update the current node to be the best node.
    this.currentNode = chosenNode;

    // Return the new move.
    return new Move(from, to);
  }

  static chooseRandom<T>(a: T[]): T {
    if (a.length > 0) {
      const index = Math.floor((Math.random() * a.length));
      return a[index];
    } else {
      return null;
    }
  }

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
    this.canExecute = true;
    this.evaluateMoves(this.currentNode);
  }

  stopSearch() {
    this.canExecute = false;
  }

  getMove(): Move {
    console.log(this.currentNode);
    return this.bestMove;
  }

  private evaluateMoves(node: Node) {
    // TODO: Go deeper...
    const children: Node[] = node.getAllChildren();
    let count = 0;
    while (this.canExecute && count < 10) {
      const chosenNode: Node = this.chooseNodeToEvaluate(children);
      this.playRandomGame(chosenNode);
      ++count;
    }
  }

  private chooseNodeToEvaluate(nodes: Node[]): Node {
    return MCTS.chooseRandom<Node>(nodes);
  }

  private playRandomGame(node: Node) {
    let winner = 0;

    // Play the game until a winner is found.
    while (winner === 0) {
      node = MCTS.chooseRandom<Node>(node.getAllChildren());
      winner = node.board.isGameFinished();
    }

    // Propagate the win back up to the root node.
    while (node) {
      if (winner === 1) {
        ++node.p1wins;
      } else {
        ++node.p2wins;
      }
      node = node.parent;
    }
  }
}
