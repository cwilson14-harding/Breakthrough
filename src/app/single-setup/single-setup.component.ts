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
  }

  createRandomId() {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  getGameInfo() {

    this.db.collection('games').doc(this.gameId).valueChanges().subscribe(data => {
      this.AiName = data['joinerName'];
      this.AiId = data['joinerId']; // TODO: make it work
      this.creatorName = data['displayName'];
      this.creatorId = data['playerId'];
      this.creatorWins = data['playerWins'];
      this.creatorLosses = data['playerLosses'];
      this.AiWins = data['joinerWins'];
      this.AiLosses = data['joinerLosses'];
      this.creatorPic = data['playerPic'];
      this.AiPic = data['joinerPic'];

  });
}
  goToBoard() {
    let playerOne: PlayerData;
    let playerTwo: PlayerData;

    this.humanPlayer = new PlayerData('Rogue Entertainment', '', PlayerType.Local);

    if (this.AiDifficultyGroup === 'easy') {
      this.aiPlayer = new PlayerData('Jack', '', PlayerType.AIMCTSRandom);
      this.AiDifficulty = 'Unfriendly';
      document.getElementById('aiDiff').innerHTML = 'AI Difficulty: Unfriendly';
    } else {
      this.aiPlayer = new PlayerData('Jack', '', PlayerType.AIMCTSDef);
      this.AiDifficulty = 'Wrathful';
      document.getElementById('aiDiff').innerHTML = 'AI Difficulty: Wrathful';
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
