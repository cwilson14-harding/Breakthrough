import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../core/auth.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {GameService} from '../game.service';

@Component({
  selector: 'app-game-over-win',
  templateUrl: './game-over-win.component.html',
  styleUrls: ['./game-over-win.component.scss']
})
export class GameOverWinComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router, public route: ActivatedRoute, public db: AngularFirestore, public gameService: GameService) { }

  winnerName;
  winnerId;
  winnerPic;
  winnerLosses;
  winnerWins;


  ngOnInit() {
    this.getGameInfo();
  }

  getGameInfo() {
    this.winnerId = this.auth.getCurrentUser();
    this.winnerName = this.route.snapshot.params['id'];
    this.winnerPic = this.route.snapshot.params['id2'];

    this.winnerWins = 1;
    this.winnerLosses = 0;
    if (this.winnerId) {
      this.db.collection('users').doc(this.winnerId).valueChanges().subscribe(data => {
        this.winnerWins = data['wins'];
        this.winnerLosses = data['losses'];
      });
    }
  }

  returnToLeaderboard() {
    this.router.navigate(['multiPlayerLobby', this.winnerName, this.winnerId, this.winnerPic, this.winnerWins, this.winnerLosses]);
  }

  returnToMenu() {
    this.router.navigateByUrl(('main-menu'));
  }
}
