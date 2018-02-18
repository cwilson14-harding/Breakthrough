import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multi-setup',
  templateUrl: './multi-setup.component.html',
  styleUrls: ['./multi-setup.component.scss']
})
export class MultiSetupComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToBoard(){
    this.router.navigateByUrl(('game-board'));
  }

}
