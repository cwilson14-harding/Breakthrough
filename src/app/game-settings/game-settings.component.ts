import {Component, EventEmitter, OnInit, Output} from '@angular/core';

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

  constructor() { }

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

}
