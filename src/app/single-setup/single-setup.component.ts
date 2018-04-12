import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlayerData, PlayerType} from '../player-data';
import {GameService} from '../game.service';
import {MatButtonToggle} from '@angular/material/button-toggle';
import {AuthService} from '../core/auth.service';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-single-setup',
  templateUrl: './single-setup.component.html',
  styleUrls: ['./single-setup.component.scss']
})
export class SingleSetupComponent implements OnInit {

  constructor(private router: Router, private gameService: GameService, public route: ActivatedRoute,
    public auth: AuthService, public db: AngularFirestore) { }

gameId;
creatorName;
creatorId;
AiId;
AiName;
creatorWins;
creatorLosses;
AiWins;
AiLosses;
AiDifficulty;
creatorPic;
AiPic;
player1 = false;
player2 = false;
playerOrderGroup: string;
AiDifficultyGroup: string;
humanPlayer;
aiPlayer;

  ngOnInit() {
    this.gameId = this.route.snapshot.params['id'];
    this.getGameInfo();

    // Set the default values for the button groups.
    this.AiDifficultyGroup = 'easy';
    this.playerOrderGroup = 'rand';
  }

  createRandomId() {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  getGameInfo() {

    this.AiName = 'AI';
    this.creatorName = this.route.snapshot.params['id'];
    this.creatorId = this.route.snapshot.params['id2'];
    this.creatorWins = this.route.snapshot.params['id4'];
    this.creatorLosses = this.route.snapshot.params['id5'];
    this.creatorPic = this.route.snapshot.params['id3'];
    this.AiPic = 'assets/avatars/virusAvatar.png';

}

  goToBoard() {
    let playerOne: PlayerData;
    let playerTwo: PlayerData;

    this.humanPlayer = new PlayerData('Rogue Entertainment', '', PlayerType.Local);

    if (this.AiDifficultyGroup === 'easy') {
      this.aiPlayer = new PlayerData(this.AiName, this.AiPic, PlayerType.AIMCTSRandom);
      this.AiDifficulty = 'Unfriendly';
    } else {
      this.aiPlayer = new PlayerData(this.AiName, this.AiPic, PlayerType.AIMCTSDef);
      this.AiDifficulty = 'Wrathful';
    }

// Determine the starting player if random.
if (this.playerOrderGroup === 'rand') {
  this.playerOrderGroup = ['human', 'ai'][Math.floor(Math.random() % 2)];
}

// Set up the game data and player order for who is going first.
if (this.playerOrderGroup === 'human') {
  playerOne = this.humanPlayer;
  playerTwo = this.aiPlayer;
} else if (this.playerOrderGroup === 'ai') {
  playerOne = this.aiPlayer;
  playerTwo = this.humanPlayer;
}

    const currUserId = this.auth.getCurrentUser();
    const gameId = this.createRandomId().toString();
    this.gameService.newGame(playerOne, playerTwo, gameId);

    this.db.collection('users').doc(currUserId).valueChanges().subscribe(data => {
      const creatorPic = data['pic'];
      const creatorName = data['displayName'];
      const AiPic = 'assets/avatars/virusAvatar.png';

      this.db.collection('games').doc(gameId).set({
        gameId: gameId,
        gameType: 'single',
        isOpen: false,
        state: 'STATE.OPEN',
        creatorPic: creatorPic,
        creatorId: currUserId,
        creatorName: creatorName,
        AiPic: 'assets/avatars/virusAvatar.png',
        AiName: 'A.I.',
      }).then(next => this.router.navigate(['board', gameId, creatorPic, AiPic]));
    });
  }

  returnToMenu() {
    this.router.navigateByUrl(('main-menu'));
  }


}
