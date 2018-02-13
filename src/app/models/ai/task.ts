import {Node} from './node';

export class Task {
  constructor(public node: Node, public ms: number, public callback?: Function) {}
}
