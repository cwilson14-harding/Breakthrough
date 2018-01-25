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
  animals;

  constructor(public auth: AuthService, private db: AngularFirestore, private router: Router) {
    this.onlineUsers();
  }

  ngOnInit() {
    this.animals = this.db.collection('animals').valueChanges();
  }

  loginGoogle() {
    this.auth.googleLogin();
  }

  logOff(user) {
    this.updateUserStatus(user);
    this.auth.logout();
  }

  updateUserStatus(user) {
    this.auth.updateUserStatus(user);
  }

  onlineUsers() {
    this.availableUsers = this.auth.viewOnlineUsers();
  }

  startGame(uid, name) {
    alert('Starting a game with ' + name);
  }

  addFrog() {
    this.animals = this.db.collection('animals').add({type: 'frog', legCount: 4, body: {color: 'green', eyes: 2}});
  }

  toHome() {
    this.router.navigateByUrl('');
  }

  playGame() {
    this.router.navigateByUrl('board');
  }

}
