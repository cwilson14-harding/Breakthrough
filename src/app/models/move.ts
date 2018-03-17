import {Coordinate} from './game-core/coordinate';

export class Move {
  constructor (public from: Coordinate, public to: Coordinate) {}

  get toIndex(): number {
    return this.to.row * 8 + this.to.column;
  }

  get fromIndex(): number {
    return this.from.row * 8 + this.from.column;
  }

  toString(): string {
    return '' + this.from.row.toString() + +this.from.column.toString() + +this.to.row.toString() + +this.to.column.toString();
  }
}
