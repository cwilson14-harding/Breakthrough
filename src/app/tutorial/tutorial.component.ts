import {Component, NgModule, OnInit} from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import {NgxSlideshowModule} from 'ngx-slideshow';
import {TextAnimator} from '../text-animator';
declare var $: any;

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
@NgModule({
  imports: [NgxSlideshowModule]
})
export class TutorialComponent implements OnInit {
  textAnimator: TextAnimator;

  constructor(public auth: AuthService, public db: AngularFirestore, private router: Router) {

  }

  ngOnInit() {
      this.textAnimator = new TextAnimator();
      this.textAnimator.start(document.getElementById('messenger'),
        'The game starts with two players and the first two rows filled with their pieces.',
        100);
      this.textAnimator = new TextAnimator();
      this.textAnimator.start(document.getElementById('messenger2'),
        'A player can move one piece forward or diagonally forward, once per turn.',
        100);
      this.textAnimator = new TextAnimator();
      this.textAnimator.start(document.getElementById('messenger3'),
        'A player can capture an opponent\'s piece if and only if the opponent is in a forward diagonal space.',
        100);
      this.textAnimator = new TextAnimator();
      this.textAnimator.start(document.getElementById('messenger4'),
        'The main objective of the game is to get one of your pieces into the opponent\'s home row.',
        100);
      this.textAnimator = new TextAnimator();
      this.textAnimator.start(document.getElementById('messenger5'),
        'The only other way to win is to capture all of your opponent\'s pieces.',
        100);
  }
}
