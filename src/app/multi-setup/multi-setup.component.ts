import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {PlayerData, PlayerType} from '../player-data';
import {GameService} from '../game.service';
// import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-multi-setup',
  templateUrl: './multi-setup.component.html',
  styleUrls: ['./multi-setup.component.scss']
})
export class MultiSetupComponent implements OnInit {

  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit() {
  }

  goToBoard() {
    // TODO: Set player order.
    // TODO: Change remote player (relative to self, who is local) to PlayerType.Network and finish NetworkPlayer implementation.
    const playerOne = new PlayerData('Creator', '', PlayerType.Local);
    const playerTwo = new PlayerData('Joiner', '', PlayerType.Local);
    this.gameService.newGame(playerOne, playerTwo, 'GAME_ID_HERE'); // TODO: Supply game ID.
    this.router.navigateByUrl('board');
  }

  returnToMenu(){
    this.router.navigateByUrl('multiPlayerLobby');
  }

}
