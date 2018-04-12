import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../core/auth.service';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-game-over-lose',
  templateUrl: './game-over-lose.component.html',
  styleUrls: ['./game-over-lose.component.scss']
})
export class GameOverLoseComponent implements OnInit {

constructor(public auth: AuthService, private router: Router, public route: ActivatedRoute, public db: AngularFirestore) { }

  gameId;
  winnerName;
  winnerPic;
  winnerLosses;
  winnerWins;


  ngOnInit() {
    this.gameId = this.route.snapshot.params['id'];
    this.getGameInfo();
  }

  getGameInfo(){
    this.db.collection('games').doc(this.gameId).valueChanges().subscribe(data => {
      this.winnerName = data['displayName'];
      this.winnerWins = data['playerWins'];
      this.winnerLosses = data['playerLosses'];
      this.winnerPic = data['playerPic'];

  });
  }

  returnToLeaderboard() {
    this.router.navigateByUrl(('multiPlayerLobby'));
  }

  returnToMenu() {
    this.router.navigateByUrl(('main-menu'));
  }
}