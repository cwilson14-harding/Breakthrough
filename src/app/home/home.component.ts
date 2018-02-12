import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { trigger, transition, useAnimation, state, animate, style } from '@angular/animations';
import { bounce } from 'ng-animate';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(100)'})),
      transition('void => *', [
        style({transform: 'translateX(-50%)'}),
        animate(700)
      ]),
      transition('* => void', [
        animate(300, style({transform: 'translateX(10%)'}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  state = 'inactive';
  myStyle: object = {};
  myParams: object = {};
  width = 100;
  height = 100;
  constructor(private router: Router, public auth: AuthService) {

  }

  toggleState() {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }

  ngOnInit() {
    this.myStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': 1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    };
    const colorPalette: string[] = ['#18DD00', '#E1C829', '#2FB5F3', '#FC82C3', '#1E023F'];
    this.myParams = {
      particles: {
        number: {
          value: 200,
        },
        color: {
          value: '#ff0000'
        },
        shape: {
          type: 'triangle',
        },
        line_linked: {
          // Neon color palette: http://www.colourlovers.com/palette/2652343/*Neon-Palette*
          color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
          opacity: .6,
          width: 2
        }
      }
    };
  }


  facebookLogin() {
    this.auth.facebookLogin();
    this.router.navigateByUrl('login');
  }
  gameBoard() {
    this.router.navigateByUrl('board');
  }
  googleLogin() {
    this.auth.googleLogin();
    this.router.navigateByUrl('login');
  }
  intro() {
    this.router.navigateByUrl('intro');
  }
  multiPlayer() {
    this.router.navigateByUrl('multi-player');
  }
  // In progress code. Working on play pause for music on the home page.
  playPauseBackgroundMusic(data: string, event: KeyboardEvent){
    let audio = document.getElementById("audioPlayer");
    let pauseMusic: boolean = false;
    let playMusic: boolean = true;

    if(event.keyCode == 32 && playMusic == true){
      pauseMusic = true;
      playMusic = false;
    }
  }
  singlePlayer() {
    this.router.navigateByUrl('/single-player');
  }

  tutorial() {
    this.router.navigateByUrl('tutorial');
  }
}
