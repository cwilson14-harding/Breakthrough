import { Component, OnInit } from '@angular/core';
import {AuthService, Game, User} from '../core/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { GameService } from '../game.service';
import {PlayerData, PlayerType} from '../player-data';
import * as firebase from 'firebase/app';
// import DocumentChange = firebase.firestore.DocumentChange;
import {Observable} from 'rxjs/Observable';
// import DocumentChangeType = firebase.firestore.DocumentChangeType;

@Component({
  selector: 'app-multiplayer-lobby',
  templateUrl: './multiplayer-lobby.component.html',
  styleUrls: ['./multiplayer-lobby.component.scss']
})
export class MultiplayerLobbyComponent implements OnInit {

  gameType;
  availableUsers: any;
  openGames: any;
  createdGame: Observable<Game>;
  isGameCreated: boolean;
  joinerId: string;
  gameUid: string;
  showLobby = true;
  showLeaderboard = false;

  // Vars for Prototype
  luke = true;
  cj = false;
  brad = false;
  dylan = false;
  alaina = false;

  constructor(public auth: AuthService, private router: Router, public db: AngularFirestore, private gameService: GameService) {
    this.isGameCreated = false;
  }

  ngOnInit() {
    this.viewOpenGames();
  }

  goToLobby() {
    this.showLobby = true;
    this.showLeaderboard = false;
  }
  goToLeaderboard() {
    this.showLobby = false;
    this.showLeaderboard = true;
  }

  // Methods For PROTOTYPE
  click_luke() {
    this.luke = true;
    this.cj = false;
    this.brad = false;
    this.dylan = false;
    this.alaina = false;
  }
  click_cj() {
    this.luke = false;
    this.cj = true;
    this.brad = false;
    this.dylan = false;
    this.alaina = false;
  }
  click_brad() {
    this.luke = false;
    this.cj = false;
    this.brad = true;
    this.dylan = false;
    this.alaina = false;
  }
  click_dylan() {
    this.luke = false;
    this.cj = false;
    this.brad = false;
    this.dylan = true;
    this.alaina = false;
  }
  click_alaina() {
    this.luke = false;
    this.cj = false;
    this.brad = false;
    this.dylan = false;
    this.alaina = true;
  }

  /* createNewGame: function(){}
     Parameters: user
     This function takes a user and sets the isGameCreated property to true. Then the function calls the
     createGame function from the auth.service to create a new game an store it in the database.
  */

  createNewGame(user: User) {
     this.isGameCreated = true;
     const createdGame = this.auth.createGame(user);
     const gameId: string = createdGame[0];
     createdGame[1].then(() => {
       this.createdGame = this.db.collection('games').doc<Game>(gameId).valueChanges();
       /* TODO: Auto join game
       this.createdGame.subscribe(game => {
         console.log(game);
         if (game !== null) {
           console.log('joining');
           this.joinGame(user, game);
         }
       });*/
     });
  }

  /* joinGame: function(){}
     Parameters: user, game
     This function takes two parameters, a user and a game. The function checks to see if the creator of the game
     is trying to join his/her own game. A javascript alert appears if this happens and the operation fails.

     If the user's uid property does not match the game's creatorId property then the person joining the game is
     navigated to the board where gameplay can commence.
  */
  joinGame(user: User, game: Game) { // creatorId, gameId
  //  this.gameUid = gameId;
  //  this.joinerId = user.uid;
    this.auth.joinGame(user, game);
    const localPlayer = new PlayerData(game.creatorName, user.photoURL, PlayerType.Local);
    const remotePlayer = new PlayerData(game.joinerName, '', PlayerType.Local); // TODO: PlayerType.Network);

    if (user.uid === game.creatorName) {
      this.gameService.newGame(localPlayer, remotePlayer, game.gameId);
    } else {
      this.gameService.newGame(remotePlayer, localPlayer, game.gameId);
    }

    this.router.navigateByUrl('multi-setup');
    // if (user.uid === game.creatorId) {
    //   alert('Can\'t join your own game.')
    // } else {
    //   this.auth.joinGame(user, game);
    //   this.router.navigateByUrl('board');
    // }
  }



  /* logOff: function(){}
     Parameters: none
     This function calls an Angular Firebase method to log the user out of the account that they are signed into.
     After the operation is complete the user is navigated back to the main menu of the application.
  */
  logOff() {
    this.auth.logout();
    this.router.navigateByUrl('home');
  }
  goToLogin() {
    this.router.navigateByUrl(('login'));
  }

  /* viewOpenGames: function(){}
     Parameters: none
     This function queries the database for games whose state property is open. It assigns all of these entries to
     the openGames property defined inside of the MultiplayerLobbyComponent.
  */
  viewOpenGames() {
    // this.availableUsers = this.auth.viewOnlineUsers();
    this.openGames = this.auth.viewOpenGames();
  }

}
