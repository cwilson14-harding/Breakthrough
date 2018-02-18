import {Neuron} from "./neuron";

export class Synapse {
    constructor(public weight: number) {}
    leftNeuron: Neuron;
    rightNeuron: Neuron;

    push(value: number) {
      // TODO: Let the edge value of this synapse be influenced.
    }

    propogate() {

    }

    backpropogate() {

    }
}
