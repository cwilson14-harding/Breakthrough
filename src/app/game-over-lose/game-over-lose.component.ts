import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../core/auth.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {GameService} from '../game.service';

@Component({
  selector: 'app-game-over-lose',
  templateUrl: './game-over-lose.component.html',
  styleUrls: ['./game-over-lose.component.scss']
})
export class GameOverLoseComponent implements OnInit {

constructor(public auth: AuthService, private router: Router, public route: ActivatedRoute, public db: AngularFirestore, public gameService: GameService) { }

  loserName;
  loserId;
  loserPic;
  loserLosses;
  loserWins;


  ngOnInit() {
    this.getGameInfo();
  }

  getGameInfo() {
    this.loserId = this.auth.getCurrentUser();
    this.loserName = this.route.snapshot.params['id'];
    this.loserPic = this.route.snapshot.params['id2'];

    this.loserWins = 0;
    this.loserLosses = 1;
    if (this.loserId) {
      this.db.collection('users').doc(this.loserId).valueChanges().subscribe(data => {
        this.loserWins = data['wins'];
        this.loserLosses = data['losses'];
      });
    }
  }

  returnToLeaderboard() {
    this.router.navigate(['multiPlayerLobby', this.loserName, this.loserId, this.loserPic, this.loserWins, this.loserLosses]);
  }

  returnToMenu() {
    this.router.navigateByUrl(('main-menu'));
  }
}
