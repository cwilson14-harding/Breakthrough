export enum PlayerType {
  Local, // Player on the local machine.
  AIRandom,
  AIMCTSRandom,
  AIMCTSDef, // Computer player.
  Network // Player on a foreign machine.
}

export class PlayerData {
  constructor (public name: string, public imageUrl: string, public type: PlayerType) {}
}
