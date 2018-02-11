import {Board} from '../board';
import {Move} from '../move';
import {Node} from './node';
import {Coordinate} from '../game-core/coordinate';

export class MCTS {

  rootNode: Node;
  currentNode: Node;
  canExecute: Boolean = false;

  private bestNode(): Node {
    const team: number = this.currentNode.turn;
    let maxNodes: Node[] = [];
    let maxNodeScore = -1;

    // Find the node with the most evaluations.
    for (const node of this.currentNode.getAllChildren()) {
      // Get the current score for this node.
      const score = node.getWinRatio(team);

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

    // Choose a random node from the top nodes.
    const chosenNode: Node = MCTS.chooseRandom<Node>(maxNodes);

    // Return the chosen node.
    return chosenNode;
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
    const board: Board = new Board();
    board.newGame();
    this.rootNode = new Node(board);
    this.currentNode = this.rootNode;
  }

  updateBoard(board: Board) {
    // Create the new board configuration.
    const newBoard: Board = new Board();
    newBoard.setBoardState(board.getBoardState());

    // Find or create the new node.
    const node = this.currentNode.findChildWithState(newBoard.getBoardState());
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
    const bestNode: Node = this.bestNode();
    const team = bestNode.turn;

    // Update the current node to be the best node.
    this.currentNode = bestNode;

    // Remove all previous nodes to save on memory.
    bestNode.parent.children = [bestNode];
    // this.rootNode = this.currentNode;
    // this.rootNode.parent = null;

    return bestNode.move;
  }

  private evaluateMoves(node: Node) {
    // Get all possible moves.
    const children: Node[] = node.getAllChildren();

    // If there are no moves to make, don't bother.
    if (children.length === 0) {
      return;
    }

    // Evaluate each possible node a set number of times before focusing on the top ones.
    for (const chosenNode of children) {
      for (let i = 0; i < 20; ++i) {
        this.playRandomGame(chosenNode);
      }
    }

    // Play a certain number of games of the top nodes.
    for (let i = 0; i < 4000 && this.canExecute; ++i) {
      const chosenNode: Node = this.chooseNodeToEvaluate(children);
      this.playRandomGame(chosenNode);
    }
  }

  private chooseNodeToEvaluate(nodes: Node[]): Node {
    if (nodes.length === 0) {
      return null;
    }

    const team: number = nodes[0].parent.turn;
    let maxNode: Node;
    let maxScore = -1;
    for (const node of nodes) {
      if (maxNode === undefined || node.getWinRatio(team) > maxScore) {
        maxScore = node.getWinRatio(team);
        maxNode = node;
      }
    }
    return maxNode;
  }

  private playRandomGame(node: Node): number {
    const board: Board = new Board();
    board.setBoardState(node.state);
    let winner = board.isGameFinished();

    // Play the game until a winner is found.
    while (winner === 0) {
      const move: Move = this.chooseRandomMove(board);
      board.makeMove(move);
      winner = board.isGameFinished();
    }

    // Propagate the win back up to the root node.
    while (node !== null) {
      if (winner === 1) {
        ++node.p1wins;
      } else {
        ++node.p2wins;
      }
      node = node.parent;
    }

    return winner;
  }

  private chooseRandomMove(board: Board): Move {
    const possibleMoves: Move[] = [];

    for (let row = 0; row < Board.BOARD_SIZE; ++row) {
      for (let column = 0; column < Board.BOARD_SIZE; ++column) {
        const moves: Coordinate[] = board.findAvailableMoves(new Coordinate(row, column));

        for (let i = 0; i < moves.length; ++i) {
          possibleMoves.push(new Move(new Coordinate(row, column), moves[i]));
        }
      }
    }

    if (possibleMoves.length > 0) {
      return MCTS.chooseRandom<Move>(possibleMoves);
    } else {
      return null;
    }
  }
}
