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
    this.textAnimator =  new TextAnimator();
    this.textAnimator.start(document.getElementById('messenger'),
      'This is a test message. It\'s really really really really really really really really really really really really really really really really really really really really really really really really long.',
      500);
  }
}
