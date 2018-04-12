import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { trigger, transition, useAnimation, state, animate, style } from '@angular/animations';
import { bounce } from 'ng-animate';
import {AfterViewInit} from '@angular/core';
import {MusicService} from '../music.service';
declare var $: any;

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
export class HomeComponent implements OnInit, AfterViewInit {
  height = 100;
  myParams: object = {};
  myStyle: object = {};
  state = 'inactive';
  width = 100;
  constructor(private router: Router, public auth: AuthService, public audio: MusicService) {
    audio.setAudio('assets/music/Garoad - VA-11 HALL-A - Second Round - 16 JC Elton\'s.mp3');
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
    // const colorPalette: string[] = ['#18DD00', '#E1C829', '#2FB5F3', '#FC82C3', '#1E023F'];
    this.myParams = {
      particles: {
        number: {
          value: 85,
        },
        color: {
          value: '#ff0000'
        },
        shape: {
          type: 'triangle',
        },
        line_linked: {
          // Neon color palette: http://www.colourlovers.com/palette/2652343/*Neon-Palette*
          color: '#2FB5F3', // colorPalette[Math.floor(Math.random() * colorPalette.length)]
          opacity: .6,
          width: 2
        }
      }
    };
  }

  ngAfterViewInit() {
    // Initialize parallax background.
    // https://www.jqueryscript.net/animation/Interactive-Mouse-Hover-Parallax-Effect-with-jQuery-Mouse-Parallax.html
    const background = $('.backImg');
    background.mouseParallax({ moveFactor: 5 });
  }

  anonymousLogin() {
    this.auth.anonymousLogin();
    this.router.navigateByUrl('guest-info');
  }

  gameBoard() {
    this.router.navigateByUrl('board');
  }
  intro() {
    this.router.navigateByUrl('intro');
  }
  multiPlayer() {
    this.router.navigateByUrl('multi-player');
  }

  singlePlayer() {
    this.router.navigateByUrl('single-setup');
  }
  signInWithEmail() {
    this.router.navigateByUrl('/sign-in');
  }

  tutorial() {
    this.router.navigateByUrl('tutorial');
  }
  exitToDesktop() {
    window.close();
  }
}
