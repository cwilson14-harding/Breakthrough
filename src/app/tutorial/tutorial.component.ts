import {Component, NgModule, OnInit} from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import {NgxSlideshowModule} from 'ngx-slideshow';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
@NgModule({
  imports: [NgxSlideshowModule]
})
export class TutorialComponent implements OnInit {

  constructor(public auth: AuthService, public db: AngularFirestore, private router: Router) { }

  ngOnInit() {
  }

}
