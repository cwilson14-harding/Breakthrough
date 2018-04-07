import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MusicService} from "../music.service";

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
  sliderVolume;
  volume = false;
  forfeit = false;

  constructor(public audio: MusicService) {
    this.audioElement = audio.getAudio();
    this.sliderVolume = 1;
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
    console.log('volumeUpdated');
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

  goBack() {
    this.showSettings = true;
    this.volume = false;
    this.forfeit = false;
  }

}
