import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  availableUsers: any;
  showSettings = false;
  showTutorial = false;

  constructor(public auth: AuthService, private db: AngularFirestore, private router: Router) {
    this.onlineUsers();
  }

  ngOnInit() {
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
