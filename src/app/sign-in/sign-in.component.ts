import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {AuthService} from '../core/auth.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {MusicService} from "../music.service";
import { AngularFireAuth } from 'angularfire2/auth';
declare var $: any;

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
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
export class SignInComponent implements OnInit, AfterViewInit {
  btnCreateAccount: any;
  btnLogin: any;
  txtEmail;
  height = 100;
  myParams: object = {};
  myStyle: object = {};
  state = 'inactive';
  width = 100;
  emailError = false;
  createAccountError = false;
  showLogin = true;
  isEmailInUse = false;
  isEmailCorrect = false;
  errorMessage: string;
  errorCode;
  isError = false;

  constructor(private router: Router, public auth: AuthService, public afs: AngularFirestore, public audio: MusicService,
              public afAuth: AngularFireAuth) {
    audio.setAudio('assets/music/Garoad - VA-11 HALL-A - Second Round - 16 JC Elton\'s.mp3')
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
    background.mouseParallax({moveFactor: 5});
  }
  createAccount() {
    // TODO: If an account already exists under the inputed email, alert them that they have made an account
    this.txtEmail = document.getElementById('inputEmail');
    const email = this.txtEmail.value;
    const wins = 0;
    const losses = 0;
    this.btnCreateAccount = document.getElementById('createAccount');
    this.auth.createAccountWithEmail(email, wins, losses).catch(error => {
     // alert(error.code);
      if (error.code === 'auth/invalid-email' ) {
        // alert('this email is not valid');
        this.isEmailCorrect = true;
        this.isEmailInUse = false;
        this.showLogin = false;
        this.emailError = false;
        this.createAccountError = true;
      } else if (error.code === 'auth/email-already-in-use') {
        // alert('email is in use already');
        this.isEmailCorrect = false;
        this.isEmailInUse = true;
        this.showLogin = false;
        this.emailError = false;
        this.createAccountError = true;
      }
   }).then(next => {
     if (this.createAccountError === true) {
       // show error
     } else {
       this.afs.collection('users').doc(this.auth.getCurrentUser()).set({
         email: email,
         losses: losses,
         wins: wins
       }).then(() => this.router.navigateByUrl('email-user-info'));
     }
    });
    // Update the user info.
  }
  signInWithEmail() {
    this.txtEmail = document.getElementById('inputEmail');
    const email = this.txtEmail.value;
    this.btnLogin = document.getElementById('loginButton');

    this.auth.loginUserWithEmail(email).catch(error => {
      this.createAccountError = false;
      this.showLogin = false;
      this.emailError = true;
      this.isEmailCorrect = false;
      this.isEmailInUse = false;
    }).then(next => {
      if (this.emailError === true) {
        // alert('not going on.. email wrong');
      } else {
        // this.router.navigateByUrl('main-menu');
        // alert(this.auth.getCurrentUser());
        this.router.navigate(['main-menu']); // , this.auth.getCurrentUser()
      }
    });

    //   .catch((error) => {
    //     this.errorCode = error.code;
    //     this.errorMessage = error.message;
    //     switch (this.errorCode) {
    //       case(this.errorCode === 'auth/invalid-email'): {
    //         this.errorMessage = 'The email address provided is invalid.';
    //         this.isError = true;
    //         break;
    //       }
    //       case(this.errorCode === 'auth/user-not-found'): {
    //         this.errorMessage = 'The user does not exist. Try creating an account.';
    //         this.isError = true;
    //         break;
    //       }
    //     }
    //   }).then(next => {
    //   if (this.isError) {
    //     alert('There is an error');
    //   } else {
    //     alert('No error, you have logged in correctly!');
    //   }
    // });
    // TODO: If the email isn't in the database, DONT push to this page
  }

  goBack() {
    this.router.navigateByUrl('home');
    this.auth.logout();
  }

  backToLogin() {
    this.emailError = false;
    this.createAccountError = false;
    this.showLogin = true;
    this.isEmailInUse = false;
    this.isEmailCorrect = false;
  }
}
