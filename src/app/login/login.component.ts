import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import {PlayerData, PlayerType} from '../player-data';
import { GameService } from '../game.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  availableUsers: any;
  showSettings = false;
  state = 'inactive';
  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;
  showTutorial = false;

  constructor(public auth: AuthService, private db: AngularFirestore, private router: Router, private gameService: GameService) {
    this.onlineUsers();
  }

  ngOnInit() {
    this.myStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': 1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    };
    this.myParams = {
      particles: {
        number: {
          value: 200,
        },
        color: {
          value: '#ff0000'
        },
        shape: {
          type: 'triangle',
        },
      }
    };
  }

  loginGoogle() {
    this.auth.googleLogin();
  }

  logOff(user) {
    // this.updateUserStatus(user);
    this.auth.logout();
    this.router.navigateByUrl('home');
  }

  // updateUserStatus(user) {
  //   this.auth.updateUserStatus(user);
  // }

  onlineUsers() {
    this.availableUsers = this.auth.viewOnlineUsers();
  }

  startGame(uid, name) {
    alert('Starting a game with ' + name);
  }

  toHome() {
    this.router.navigateByUrl('home');
  }
  goToMulti(user) {
    this.auth.updateGameTypeMulti(user);
   // alert(userId);
    this.router.navigateByUrl('multiPlayerLobby');
  }

  playGame() {
    const playerOne = new PlayerData('Bob', '', PlayerType.Local);
    const playerTwo = new PlayerData('Geraldo', '', PlayerType.AI);
    this.gameService.newGame(playerOne, playerTwo);
    this.router.navigateByUrl('board');
  }
  // set settings to true. settings div will appear
  goToSettings() {
    this.showSettings = true;
  }
  goToTutorial() {
    this.showTutorial = true;
  }
  // settings & Tutorial is now closed
  goBack() {
    this.showSettings = false;
    this.showTutorial = false;
  }

}
