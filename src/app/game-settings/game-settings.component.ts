import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MusicService} from '../music.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import {GameService} from '../game.service';
import {Router} from '@angular/router';
import {AuthService} from '../core/auth.service';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent implements OnInit {
  @Output() showChatClicked = new EventEmitter<any>();
  @Output() hideLegendClicked = new EventEmitter<any>();
  showSettings = true;
  showChat = true;
  showLegend = true;
  audioElement: HTMLAudioElement;
  sliderVolume = 1;
  volume = false;
  forfeit = false;
  leaveGame = false;
  currUser;
  currUserName;
  currUserPic;
  currGameId;

  constructor(public audio: MusicService, public db: AngularFirestore, public auths: AuthService, public auth: AngularFireAuth, private gameService: GameService,
              public router: Router) {
    this.audioElement = audio.getAudio();
    this.sliderVolume = this.audioElement.volume;

    this.currUserName = this.gameService.localPlayer.name;
    this.currUserPic = this.gameService.localPlayer.imageUrl;

    this.currUser = this.auths.getCurrentUser();
    this.currGameId = this.gameService.gameId;
  }

  ngOnInit() {
  }

  showHideChat() {
    this.showChatClicked.emit(null);
    this.showChat = !this.showChat;
  }

  showHideLegend() {
    this.hideLegendClicked.emit(null);
    this.showLegend = !this.showLegend;
  }

  changeVolumeLevel(newValue) {
    this.sliderVolume = newValue;
    this.audioElement.volume = this.sliderVolume;
  }

  showVolume() {
    this.volume = true;
    this.showSettings = false;
    this.forfeit = false;
  }

  forfeitGame() {
    this.forfeit = true;
    this.showSettings = false;
    this.volume = false;
  }

  quitGame() {
    this.leaveGame = true;
    if (this.currGameId) {
      this.db.collection('games').doc(this.currGameId).update({
        forfeit: true
      });
    }
    this.router.navigate(['game-over-lose', this.currUserName, this.currUserPic]);
  }

  goBack() {
    this.showSettings = true;
    this.volume = false;
    this.forfeit = false;
  }

}
