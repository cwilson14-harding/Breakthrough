import { Component, OnInit } from '@angular/core';
import {AuthService} from '../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  currentUserId: string;
  overallLeaders;

  constructor(public auth: AuthService, public db: AngularFirestore) { }

  ngOnInit() {
    this.currentUserId = this.auth.getCurrentUser();
    this.getOverallLeaders();
  }

  getOverallLeaders() {
    this.overallLeaders = this.db.collection('users', ref => ref.where('wins', '>', 0).orderBy('wins', 'desc').limit(4)).valueChanges();
  }
}
