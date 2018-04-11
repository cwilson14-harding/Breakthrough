import {Component, Input, OnInit} from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import {MatSlider } from '@angular/material';
import {MusicService} from "../music.service";

declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  audioElement: HTMLAudioElement;
  showSettings = true;
  changeAvatar = false;
  credits = false;
  volume = false;
  avatar1Selected = false;
  avatar2Selected = false;
  avatar3Selected = false;
  avatar4Selected = false;
  avatar5Selected = false;
  currentPic;
  sliderVolume;
  showIntroVid = false;
  movieTimeout: number;

  @Input()
  music: any;

  constructor(public auth: AuthService, public db: AngularFirestore, private router: Router, public audio: MusicService) {
    this.audioElement = audio.getAudio();
    this.sliderVolume = 1;

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
    this.showIntroVid = false;
  }
  showCredits() {
    this.showSettings = false;
    this.changeAvatar = false;
    this.volume = false;
    this.credits = true;
    this.showIntroVid = false;
  }
  showChangeAvatar() {
    this.showIntroVid = false;
    this.showSettings = false;
    this.changeAvatar = true;
    this.volume = false;
    this.credits = false;
  }
  goBack() {
    this.showIntroVid = false;
    this.showSettings = true;
    this.changeAvatar = false;
    this.credits = false;
    this.volume = false;
    this.audioElement.play();
    clearTimeout(this.movieTimeout);
  }
  goToIntro() {
    this.audioElement.pause();
    this.showIntroVid = true;
    this.showSettings = false;
    this.changeAvatar = false;
    this.credits = false;
    this.volume = false;

    // after the video, go back to the settings home
    this.movieTimeout = setTimeout(() => {
      this.goBack();
    }, 16500);

  }
  logout() {
    this.auth.logout().then(() => this.router.navigateByUrl('home'));
  }
  circleSelected() {
    this.avatar1Selected = true;
    this.avatar2Selected = false;
    this.avatar3Selected = false;
    this.avatar4Selected = false;
    this.avatar5Selected = false;
  }
  virusSelected() {
    this.avatar1Selected = false;
    this.avatar2Selected = true;
    this.avatar3Selected = false;
    this.avatar4Selected = false;
    this.avatar5Selected = false;
  }
  virus2Selected() {
    this.avatar1Selected = false;
    this.avatar2Selected = false;
    this.avatar3Selected = true;
    this.avatar4Selected = false;
    this.avatar5Selected = false;
  }
  cyberPunkBoySelected() {
    this.avatar1Selected = false;
    this.avatar2Selected = false;
    this.avatar3Selected = false;
    this.avatar4Selected = true;
    this.avatar5Selected = false;
  }
  cyberPunkGirlSelected() {
    this.avatar1Selected = false;
    this.avatar2Selected = false;
    this.avatar3Selected = false;
    this.avatar4Selected = false;
    this.avatar5Selected = true;
  }
  selectAvatar() {
    if (this.avatar1Selected === true) {
      this.currentPic = 'assets/avatars/cyberPunkFigure3.png';
    } else if (this.avatar2Selected === true) {
      this.currentPic = 'assets/avatars/cyberPunkFigure.png';
    } else if (this.avatar3Selected === true) {
      this.currentPic = 'assets/avatars/cyberPunkFigure4.png';
    } else if (this.avatar4Selected === true) {
      this.currentPic = 'assets/avatars/cyberpunk boy.png';
    } else if (this.avatar5Selected === true) {
      this.currentPic = 'assets/avatars/cyberpunk girl.png';
    }
    this.db.collection('users').doc(this.auth.getCurrentUser()).update({
      pic: this.currentPic
    }).then(() => {
      this.changeAvatar = false;
      this.showSettings = true;
    });
  }
  changeVolumeLevel(newValue) {
    console.log('volumeUpdated');
    this.sliderVolume = newValue;
    this.audioElement.volume = this.sliderVolume;
  }
}
