import { Injectable } from '@angular/core';
import {PlayerData, PlayerType} from './player-data';

@Injectable()
export class GameService {
  gameId: string;
  playerOne: PlayerData;
  playerTwo: PlayerData;

  constructor() { }

  newGame(playerOne: PlayerData, playerTwo: PlayerData, gameId = '') {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.gameId = gameId;
  }

  get isLocalGame(): boolean {
    return this.playerOne.type !== PlayerType.Network && this.playerTwo.type !== PlayerType.Network;
  }

  get localPlayer(): PlayerData {
    return (this.playerOne.type === PlayerType.Local) ? this.playerOne : this.playerTwo;
  }
}



