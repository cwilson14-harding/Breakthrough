import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../core/auth.service';

@Component({
  selector: 'app-game-over-win',
  templateUrl: './game-over-win.component.html',
  styleUrls: ['./game-over-win.component.scss']
})
export class GameOverWinComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

returnToLeaderboard() {
  this.router.navigateByUrl(('multiPlayerLobby'));
}

  returnToMenu(){
    this.router.navigateByUrl(('main-menu'));
  }
}
