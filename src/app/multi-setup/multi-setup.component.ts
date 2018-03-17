import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlayerData, PlayerType} from '../player-data';
import {GameService} from '../game.service';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {AuthService} from '../core/auth.service';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-multi-setup',
  templateUrl: './multi-setup.component.html',
  styleUrls: ['./multi-setup.component.scss']
})
export class MultiSetupComponent implements OnInit {

  constructor(private router: Router, private gameService: GameService, public route: ActivatedRoute,
              public auth: AuthService, public db: AngularFirestore) { }

  gameId;
  creatorName;
  creatorId;
  joinerId;
  joinerName;
  player1 = false;
  player2 = false;

  ngOnInit() {
    this.gameId = this.route.snapshot.params['id'];
    this.getGameInfo();
  }

  getGameInfo() {
    this.db.collection('games').doc(this.gameId).valueChanges().subscribe(data => {
      this.joinerName = data['joinerName'];
      this.joinerId = data['joinerId'];
      this.creatorName = data['creatorName'];
      this.creatorId = data['creatorId'];

      if (this.auth.getCurrentUser() === this.creatorId) {
        this.player1 = true;
        this.player2 = false;
      } else if (this.auth.getCurrentUser() === this.joinerId) {
        this.player2 = true;
        this.player1 = false;
      }

      if (this.joinerName !== '') {
        this.goToBoard();
      }
    });
  }



  goToBoard() {
    // TODO: Set player order.
    // TODO: Change remote player (relative to self, who is local) to PlayerType.Network and finish NetworkPlayer implementation.
    const playerOne = new PlayerData(this.creatorName, '', PlayerType.Local);
    const playerTwo = new PlayerData(this.joinerName, '', PlayerType.Local);
    this.gameService.newGame(playerOne, playerTwo, this.gameId);

    setTimeout(() => {
      this.router.navigate(['board', this.gameId]);
    }, 2000);
  }

  returnToMenu() {
    this.router.navigateByUrl('multiPlayerLobby');
  }

}
