import { Component, OnInit } from '@angular/core';
import {AuthService} from '../core/auth.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
