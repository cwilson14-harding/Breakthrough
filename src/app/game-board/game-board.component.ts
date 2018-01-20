import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {


  boardCells: Observable<any[]>;

  constructor(private db: AngularFirestore) {
    this.boardCells = db.collection('board').valueChanges();
  }

  ngOnInit() {

  }

  makeMove(id, isOn) {
    // Update isOn here.
    this.db.collection('board').doc(id).update({isOn: !isOn});
  }


}
