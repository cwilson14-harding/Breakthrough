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
  loserName;
  loserPic;
  loserLosses;
  loserWins;


  ngOnInit() {
    this.gameId = this.route.snapshot.params['id'];
    this.getGameInfo();
  }

  getGameInfo(){
    this.db.collection('users').doc(this.auth.getCurrentUser()).valueChanges().subscribe(data => {
      this.loserName = data['displayName'];
      this.loserWins = data['wins'];
      this.loserLosses = data['losses'];
      this.loserPic = data['pic'];

  });
  }

  returnToLeaderboard() {
    this.router.navigateByUrl(('multiPlayerLobby'));
  }

  returnToMenu() {
    this.router.navigateByUrl(('main-menu'));
  }
}