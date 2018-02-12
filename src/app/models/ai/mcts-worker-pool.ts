import {MCTSWorker} from './mcts-worker';
import {Task} from './task';

export class MCTSWorkerPool {
  static readonly THREAD_COUNT = 7;
  private workers: MCTSWorker[] = [];
  private tasks: Task[] = [];
  private allTasksCompletedCallback;

  constructor() {
    // Create the worker pool.
    for (let i = 0; i < MCTSWorkerPool.THREAD_COUNT; ++i) {
      this.workers.push(new MCTSWorker((worker: MCTSWorker) => {
        this.workerFinished(worker);
      }));
    }
  }

  addTask(task: Task) {
    this.tasks.push(task);
    const worker: MCTSWorker = this.findAvailableWorker();
    if (worker) {
      worker.assignTask(task);
    }
  }

  clearTasks() {
    this.tasks = [];
    for (const worker of this.workers) {
      worker.terminate();
    }
  }

  onAllTasksCompleted(callback: Function) {
    this.allTasksCompletedCallback = callback;
  }

  private workerFinished(worker: MCTSWorker) {
    const task: Task = this.tasks.shift();
    if (task) {
      worker.assignTask(task);
    } else if (this.allTasksCompletedCallback && this.areAllTasksCompleted()) {
      this.allTasksCompletedCallback();
    }
  }

  private findAvailableWorker(): MCTSWorker {
    for (const worker of this.workers) {
      if (!worker.busy) {
        return worker;
      }
    }
  }

  private areAllTasksCompleted(): boolean {
    // Check if there are tasks in the queue.
    if (this.tasks.length > 0) {
      return false;
    }

    // Check if any workers are busy.
    for (const worker of this.workers) {
      if (worker.busy) {
        return false;
      }
    }

    return true;
  }
}
