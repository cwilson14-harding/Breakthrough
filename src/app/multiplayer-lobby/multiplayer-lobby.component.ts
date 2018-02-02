import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { user } from '../models/user';
import { game } from '../models/game'
import {Observable} from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-multiplayer-lobby',
  templateUrl: './multiplayer-lobby.component.html',
  styleUrls: ['./multiplayer-lobby.component.scss']
})
export class MultiplayerLobbyComponent implements OnInit {

  user: Observable<user>;
  game: Observable<game>;
  gameType;
  availableUsers: any;
  openGames: any;
  isGameCreated: boolean;
  joinerId: string;
  gameUid: string;

  constructor(public auth: AuthService, private router: Router, public db: AngularFirestore) {
    this.isGameCreated = false;
  }

  ngOnInit() {
    this.viewOpenGames();
  }

  logOff() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  createNewGame(user) {
     this.isGameCreated = true;
     this.auth.createGame(user);
  }

  joinGame(user, game) { //creatorId, gameId
  //  this.gameUid = gameId;
  //  this.joinerId = user.uid;
    if (user.uid === game.creatorId) {
      alert('CANT JOIN YOUR OWN GAME')
    } else {
      this.auth.joinGame(user, game);
      // this.auth.joinGame(user, game);
      this.router.navigateByUrl('board');
    }

  }

  viewOpenGames() {
    // this.availableUsers = this.auth.viewOnlineUsers();
    this.openGames = this.auth.viewOpenGames();
  }

}
