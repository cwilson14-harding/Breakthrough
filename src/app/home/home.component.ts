import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce } from 'ng-animate';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, public auth: AuthService) { }


  ngOnInit() {
  }

  singlePlayer() {
    this.router.navigateByUrl('/single-player');
  }
  multiPlayer() {
    this.router.navigateByUrl('multi-player');
  }
  tutorial() {
    this.router.navigateByUrl('tutorial');
  }
  intro() {
    this.router.navigateByUrl('intro');
  }
  gameBoard() {
    this.router.navigateByUrl('board');
  }
  googleLogin() {
    this.auth.googleLogin();
    this.router.navigateByUrl('login');
  }

}
