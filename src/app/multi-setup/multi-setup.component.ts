import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlayerData, PlayerType} from '../player-data';
import {GameService} from '../game.service';
import {MatButtonToggle} from '@angular/material/button-toggle';
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
  playerOrderGroup: string;

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
    let playerOne: PlayerData;
    let playerTwo: PlayerData;

    // Determine who is local and who is remote.
    const isJoining = (this.joinerId === this.auth.getCurrentUser());
    const creatorType: PlayerType = (isJoining) ? PlayerType.Network : PlayerType.Local;
    const joinerType: PlayerType = (isJoining) ? PlayerType.Local : PlayerType.Network;

    // Determine the starting player if random.
    if (this.playerOrderGroup === 'rand') {
      this.playerOrderGroup = ['p1', 'p2'][Math.floor(Math.random() % 2)];
    }

    // Set up the game data and player order for who is going first.
    if (this.playerOrderGroup === 'p1') {
      playerOne = new PlayerData(this.creatorName, '', creatorType);
      playerTwo = new PlayerData(this.joinerName, '', joinerType);
    } else {
      playerOne = new PlayerData(this.joinerName, '', joinerType);
      playerTwo = new PlayerData(this.creatorName, '', creatorType);
    }

    // Set the game data.
    this.gameService.newGame(playerOne, playerTwo, this.gameId);

    // Start the game.
    // TODO: Move to a button on the host's screen.
    setTimeout(() => {
      this.router.navigate(['board', this.gameId]);
    }, 2000);
  }

  returnToMenu() {
    this.router.navigateByUrl('multiPlayerLobby');
  }

}
