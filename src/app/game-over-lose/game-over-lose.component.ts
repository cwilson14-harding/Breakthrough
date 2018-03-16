import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../core/auth.service';

@Component({
  selector: 'app-game-over-lose',
  templateUrl: './game-over-lose.component.html',
  styleUrls: ['./game-over-lose.component.scss']
})
export class GameOverLoseComponent implements OnInit {

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
