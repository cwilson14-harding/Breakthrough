import {Board} from '../board';
import {Move} from '../move';
import {Node} from './node';
import {Coordinate} from '../game-core/coordinate';

export class MCTS {

  static readonly THREAD_COUNT = 7;
  rootNode: Node;
  currentNode: Node;
  canExecute: Boolean = false;
  workers: Worker[] = [];
  tasks: [Node, number][] = [];

  static chooseRandom<T>(a: T[]): T {
    if (a.length > 0) {
      const index = Math.floor((Math.random() * a.length));
      return a[index];
    } else {
      return null;
    }
  }

  static chooseRandomMove(board: Board): Move {
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
    if (Worker) {
      this.evaluateMovesThreaded(this.currentNode);
    } else {
      this.evaluateMoves(this.currentNode);
    }
  }

  stopSearch() {
    this.canExecute = false;
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
  }

  getMove(): Move {
    const bestNode: Node = this.bestNode();
    console.log(this.currentNode);

    // Update the current node to be the best node.
    this.currentNode = bestNode;

    // Remove all previous nodes to save on memory.
    //bestNode.parent.children = [bestNode];
    // this.rootNode = this.currentNode;
    // this.rootNode.parent = null;

    return bestNode.move;
  }

  createWorkers(): Worker[] {
    for (let i = 0; i < MCTS.THREAD_COUNT; ++i) {
      this.workers.push(new Worker('/assets/scripts/worker.js'));
    }
    return this.workers;
  }

  workerFinished(worker: Worker) {
    const task: [Node, number] = this.tasks.shift();
    console.log('worker finished');
    if (task) {
      const targetNode: Node = task[0];
      const count = task[1];
      worker.postMessage(count + '-' + targetNode.state);
      worker.onmessage = (ev) => {
        const wins: [number, number] = ev.data.split('-');
        targetNode.p1wins += +wins[0];
        targetNode.p2wins += +wins[1];
        this.workerFinished(worker);
      };
    }
  }

  private evaluateMovesThreaded(node: Node) {
    const children: Node[] = this.currentNode.getAllChildren();
    for (const chosenNode of children) {
      this.tasks.push([chosenNode, 200]);
    }
    for (const worker of this.createWorkers()) {
      this.workerFinished(worker);
    }
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
      const move: Move = MCTS.chooseRandomMove(board);
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
}
