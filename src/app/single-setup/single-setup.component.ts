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
joinerId;
joinerName;
creatorWins;
creatorLosses;
joinerWins;
joinerLosses;
creatorPic;
joinerPic;
player1 = false;
player2 = false;
playerOrderGroup: string;

  ngOnInit() {
    this.gameId = this.route.snapshot.params['id'];
    this.getGameInfo();
  }

  createRandomId() {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  getGameInfo(){
      // TODO: check AI difficulty first, then AI type!

    const playerOne = new PlayerData('Rogue Entertainment', '', PlayerType.Local);
    const playerTwo = new PlayerData('Jack', '', PlayerType.AIMCTSRandom); // AIMCTSDef
    const currUserId = this.auth.getCurrentUser();
    const gameId = this.createRandomId().toString();
    this.gameService.newGame(playerOne, playerTwo, gameId);
    // this.router.navigateByUrl('single-setup');

    this.db.collection('users').doc(currUserId).valueChanges().subscribe(data => {
      const creatorPic = data['pic'];
      const creatorName = data['displayName'];
      const joinerPic = 'assets/avatars/virusAvatar.png';

      this.db.collection('games').doc(gameId).set({
        gameId: gameId,
        gameType: 'single',
        isOpen: false,
        state: 'STATE.OPEN',
        creatorPic: creatorPic,
        creatorId: currUserId,
        creatorName: creatorName,
        joinerPic: 'assets/avatars/virusAvatar.png',
        joinerName: 'A.I.',
      }).then(next => this.router.navigate(['board', gameId, creatorPic, joinerPic]));
    });


  }
  goToBoard(){
    this.router.navigateByUrl(('board'));
  }

  returnToMenu(){
    this.router.navigateByUrl(('main-menu'));
  }


}
