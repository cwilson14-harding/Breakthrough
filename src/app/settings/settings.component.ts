import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import {MatSlider } from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  showSettings = true;
  changeAvatar = false;
  credits = false;
  volume = false;
  avatar1Selected = false;
  avatar2Selected = false;
  avatar3Selected = false;
  currentPic;

  constructor(public auth: AuthService, public db: AngularFirestore, private router: Router) {
  }
  ngOnInit() {
  }
  logOff() {
    this.auth.logout();
    this.router.navigateByUrl('home');
  }
  showVolume() {
    this.showSettings = false;
    this.changeAvatar = false;
    this.volume = true;
    this.credits = false;
  }
  showCredits() {
    this.showSettings = false;
    this.changeAvatar = false;
    this.volume = false;
    this.credits = true;
  }
  showChangeAvatar() {
    this.showSettings = false;
    this.changeAvatar = true;
    this.volume = false;
    this.credits = false;
  }
  goBack() {
    this.showSettings = true;
    this.changeAvatar = false;
    this.credits = false;
    this.volume = false;
  }
  goToIntro() {
    this.auth.logout().then(() => this.router.navigateByUrl('intro'));
  }
  logout() {
    this.auth.logout().then(() => this.router.navigateByUrl('home'));
  }
  circleSelected() {
    this.avatar1Selected = true;
    this.avatar2Selected = false;
    this.avatar3Selected = false;
  }
  virusSelected() {
    this.avatar1Selected = false;
    this.avatar2Selected = true;
    this.avatar3Selected = false;
  }
  virus2Selected() {
    this.avatar1Selected = false;
    this.avatar2Selected = false;
    this.avatar3Selected = true;
  }
  selectAvatar() {
    if (this.avatar1Selected === true) {
      this.currentPic = 'assets/avatars/circle.png';
    } else if (this.avatar2Selected === true) {
      this.currentPic = 'assets/avatars/virus.png';
    } else if (this.avatar3Selected === true) {
      this.currentPic = 'assets/avatars/virus2.png';
    }
    this.db.collection('users').doc(this.auth.getCurrentUser()).update({
      pic: this.currentPic
    }).then(() => {
      this.changeAvatar = false;
      this.showSettings = true;
    });
  }
}
