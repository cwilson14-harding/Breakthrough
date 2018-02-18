import {Layer} from './layer';
import {Move} from '../move';

export class NeuralNetwork {
    inputLayer: Layer = new Layer(65);
    hiddenLayer: Layer; // Mean number of input and output layers.
    outputLayer: Layer = new Layer(1536);

    constructor() {}

    getMove(boardState: number[]): Move {
      // TODO: Implement getMove();
      for (let i = 0; i < this.inputLayer.neurons.length; ++i) {
        this.inputLayer.neurons[i].value = boardState[i];
      }
      this.inputLayer.activate();
      return null;
    }

    static relu(x: number): number {
        return Math.max(0, x);
    }
}
