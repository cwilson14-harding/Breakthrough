import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { GameService } from '../game.service';
import {PlayerData, PlayerType} from '../player-data';

@Component({
  selector: 'app-multiplayer-lobby',
  templateUrl: './multiplayer-lobby.component.html',
  styleUrls: ['./multiplayer-lobby.component.scss']
})
export class MultiplayerLobbyComponent implements OnInit {

  gameType;
  availableUsers: any;
  openGames: any;
  isGameCreated: boolean;
  joinerId: string;
  gameUid: string;

  constructor(public auth: AuthService, private router: Router, public db: AngularFirestore, private gameService: GameService) {
    this.isGameCreated = false;
  }

  ngOnInit() {
    this.viewOpenGames();
  }
  /* createNewGame: function(){}
     Parameters: user
     This function takes a user and sets the isGameCreated property to true. Then the function calls the
     createGame function from the auth.service to create a new game an store it in the database.
  */
  createNewGame(user: string) {
     this.isGameCreated = true;
     this.auth.createGame(user);
  }

  /* joinGame: function(){}
     Parameters: user, game
     This function takes two parameters, a user and a game. The function checks to see if the creator of the game
     is trying to join his/her own game. A javascript alert appears if this happens and the operation fails.

     If the user's uid property does not match the game's creatorId property then the person joining the game is
     navigated to the board where gameplay can commence.
  */
  joinGame(user: string, game: string) { // creatorId, gameId
  //  this.gameUid = gameId;
  //  this.joinerId = user.uid;
    this.auth.joinGame(user, game);
    const playerOne = new PlayerData('Bob', '', PlayerType.Local);
    const playerTwo = new PlayerData('Geraldo', '', PlayerType.Network);
    this.gameService.newGame(playerOne, playerTwo, game);
    this.router.navigateByUrl('board');
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
