import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
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
}
