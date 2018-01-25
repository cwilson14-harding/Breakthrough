import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

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

}
