import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {

  start: boolean = false;
  rogue = true;
  logo = false;
  white = false;

  constructor(public router: Router) { }

  ngOnInit() {
    // Start after 1 second + 1 second of startDelay
    setTimeout(() => this.start = true, 100);
    this.onLogoComplete();
  }
  onComplete () {
    console.log('#TYPING ANIMATION COMPLETE');
      setTimeout(() => {
        this.rogue = false;
        this.logo = true;
      }, 1000);
    // this.router.navigateByUrl('Home');
  }

  onLogoComplete() {
    setTimeout(() => {
      this.router.navigateByUrl('intro');
    }, 5000);
  }

  toHomePage() {
    this.router.navigateByUrl('home');
  }

}
