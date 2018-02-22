import { Component, OnInit, Input, Output } from '@angular/core';
import { GameBoardComponent } from '../game-board/game-board.component';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
@Output() newGameClicked = new EventEmitter<any>();
@Output() showChatClicked = new EventEmitter<any>();
@Output() forfeitClicked = new EventEmitter<any>();
playBackgroundMusic: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  newGame() {
    this.newGameClicked.emit(null);
  }

  showHideChat() {
    this.showChatClicked.emit(null);
  }

  forfeitGame() {
    this.forfeitClicked.emit(null);
  }
  playPauseBackgroundMusic(){
    const audio = document.getElementById('audioPlayer') as any;
    const playPauseButton = document.getElementById('musicControlButton');
    if(this.playBackgroundMusic === true){
      if(playPauseButton.textContent == "PAUSE MUSIC"){
        playPauseButton.textContent = "PLAY MUSIC";
      }
      this.playBackgroundMusic = false;
      audio.pause();
    }
    else if(this.playBackgroundMusic === false){
      if(playPauseButton.textContent == "PLAY MUSIC"){
        playPauseButton.textContent = "PAUSE MUSIC";
      }
      this.playBackgroundMusic = true;
      audio.play();
    }
  }
}
