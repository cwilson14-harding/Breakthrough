import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../core/auth.service';
import {GameService} from '../game.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  gameReference;
  joinerPic;
  creatorPic;

  @Input()
  state: number;
  @Input()
  boardClass: string;
  @Input()
  legend: string;
  get row(): number {
    return +this.legend[0] + 1;
  }
  get column(): string {
    switch (this.legend[1]) {
      case '0': return 'A';
      case '1': return 'B';
      case '2': return 'C';
      case '3': return 'D';
      case '4': return 'E';
      case '5': return 'F';
      case '6': return 'G';
      case '7': return 'H';
    }
  }
  constructor(public auth: AuthService, public db: AngularFirestore, public gameService: GameService, public route: ActivatedRoute) { }

  ngOnInit() {
  }

}
