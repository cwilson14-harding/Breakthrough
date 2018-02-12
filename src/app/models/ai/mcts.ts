import {Board} from '../board';
import {Move} from '../move';
import {Node} from './node';
import {Coordinate} from '../game-core/coordinate';
import {MCTSWorkerPool} from './mcts-worker-pool';
import {Task} from './task';

export class MCTS {

  rootNode: Node;
  currentNode: Node;
  canExecute: Boolean = false;
  workerPool: MCTSWorkerPool = new MCTSWorkerPool();

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
    return MCTS.chooseRandom<Node>(maxNodes);;
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
    this.currentNode = this.currentNode.findChildWithState(newBoard.getBoardState());;
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

  private taskCompleted(ev: MessageEvent, task: Task) {
    const results = ev.data.split('-');
    task.node.p1wins += +results[0];
    task.node.p2wins += +results[1];
  }

  private evaluateMovesThreaded(node: Node) {
    // Get all the possible moves.
    const children: Node[] = this.currentNode.getAllChildren();

    // Evaluate all of the nodes.
    for (const chosenNode of children) {
      const task: Task = new Task(chosenNode, 200, this.taskCompleted);
      this.workerPool.addTask(task);
    }

    // Concentrate on the best nodes.
    this.workerPool.onAllTasksCompleted(() => {
      for (let i = 0; i < MCTSWorkerPool.THREAD_COUNT; ++i) {
        this.workerPool.addTask(this.createTaskToEvaluate(children, 100));
      }
    });

  }

  private createTaskToEvaluate(nodes: Node[], ms: number): Task {
    return new Task(this.chooseNodeToEvaluate(nodes), ms, (ev: MessageEvent, task: Task) => {
      this.taskCompleted(ev, task);
      this.workerPool.addTask(this.createTaskToEvaluate(nodes, ms));
    });
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

  private sortNodesByBest(nodes: Node[]): Node[] {
    return nodes.sort(function (n1: Node, n2: Node) {
      const n1Ratio = n1.getWinRatio(nodes[0].parent.team);
      const n2Ratio = n2.getWinRatio(nodes[0].parent.team);
      if (n1Ratio > n2Ratio) {
        return 1;
      } else if (n1Ratio < n2Ratio) {
        return 2;
      } else {
        return 0;
      }
    });
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
