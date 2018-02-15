import {Component, NgModule, OnInit} from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import {NgxSlideshowModule} from 'ngx-slideshow';
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

  constructor(public auth: AuthService, public db: AngularFirestore, private router: Router) {
  }

  ngOnInit() {
    const Messenger = function (el) {
      'use strict';
      const m = this;

      m.init = function () {
        m.codeletters = '&#*+%?£@§$';
        m.message = 0;
        m.current_length = 0;
        m.fadeBuffer = false;
        m.messages = [ 'The board is setup with pieces filling the first two rows for, <div>each player. Choose which player will go first. Each player can make one move per turn.'
        ];

        setTimeout(m.animateIn, 100);
      };

      m.generateRandomString = function (length) {
        let random_text = '';
        while (random_text.length < length) {
          random_text += m.codeletters.charAt(Math.floor(Math.random() * m.codeletters.length));
        }

        return random_text;
      };

      m.animateIn = function () {
        if (m.current_length < m.messages[m.message].length) {
          m.current_length = m.current_length + 2;
          if (m.current_length > m.messages[m.message].length) {
            m.current_length = m.messages[m.message].length;
          }

          const message = m.generateRandomString(m.current_length);
          $(el).html(message);

          setTimeout(m.animateIn, 20);
        } else {
          setTimeout(m.animateFadeBuffer, 20);
        }
      };

      m.animateFadeBuffer = function () {
        if (m.fadeBuffer === false) {
          m.fadeBuffer = [];
          for (let i = 0; i < m.messages[m.message].length; i++) {
            m.fadeBuffer.push({c: (Math.floor(Math.random() * 12)) + 1, l: m.messages[m.message].charAt(i)});
          }
        }

        let do_cycles = false;
        let message = '';

        for (let i = 0; i < m.fadeBuffer.length; i++) {
          const fader = m.fadeBuffer[i];
          if (fader.c > 0) {
            do_cycles = true;
            fader.c--;
            message += m.codeletters.charAt(Math.floor(Math.random() * m.codeletters.length));
          } else {
            message += fader.l;
          }
        }

        $(el).html(message);

        if (do_cycles === true) {
          setTimeout(m.animateFadeBuffer, 50);
        } else {
          setTimeout(m.cycleText, 1500);
        }
      };

      m.cycleText = function () {
        m.message = m.message + 1;
        if (m.message >= m.messages.length) {
          m.message = 0;
        }

        m.current_length = 0;
        m.fadeBuffer = false;
        $(el).html('');

        setTimeout(m.animateIn, 200);
      };

      m.init();
    }

    console.clear();
    const messenger = new Messenger($('#messenger'));
  }
}
