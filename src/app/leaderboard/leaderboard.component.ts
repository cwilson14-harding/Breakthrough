import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { AuthService } from '../core/auth.service';
=======
import {AuthService} from '../core/auth.service';
>>>>>>> 75fcdd1c7eae6490fce9c309c34bb68cf6e3679a

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
