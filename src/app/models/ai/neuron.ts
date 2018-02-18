import {Synapse} from './synapse';

export class Neuron {
    backSynapses: Synapse[] = [];
    frontSynapses: Synapse[] = [];
    public value: number = Math.random();

    constructor() {}

    // Retrieves values from previous synapses and pushes values onto the next synapses.
    activate() {
      for (const synapse of this.backSynapses) {
        // TODO: Be influenced by the values of the synapses.
      }

      for (const synapse of this.frontSynapses) {
        // TODO: Influence the values of the front synapses.
        synapse.push(this.value);
      }
    }
}
