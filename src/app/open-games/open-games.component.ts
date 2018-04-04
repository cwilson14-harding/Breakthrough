import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-open-games',
  templateUrl: './open-games.component.html',
  styleUrls: ['./open-games.component.scss']
})
export class OpenGamesComponent implements OnInit {

  openGames;

  constructor(public db: AngularFirestore) {
    this.openGames = this.db.collection('games').valueChanges();
  }

  ngOnInit() {
  }

}
