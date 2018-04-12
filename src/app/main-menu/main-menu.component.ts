import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router, NavigationExtras, ExtraOptions, ParamMap} from '@angular/router';
import {PlayerData, PlayerType} from '../player-data';
import { GameService } from '../game.service';
import {MusicService} from "../music.service";
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, AfterViewInit {
  userName;
  userWins;
  userLosses;
  userPic;
  userUid;
// this.userUid, this.userPic, this.userWins, this.userLosses

  availableUsers: any;
  showSettings = false;
  state = 'inactive';
  myStyle: object = {};
  myParams: object = {};
  width = 100;
  height = 100;
  showTutorial = false;
  constructor(public auth: AuthService, private db: AngularFirestore, private router: Router, private gameService: GameService,
  public audio: MusicService) {
    audio.setAudio('assets/music/Garoad - VA-11 HALL-A - Second Round - 16 JC Elton\'s.mp3');
    this.onlineUsers();
  }

  ngOnInit() {
    const currUserId = this.auth.getCurrentUser();
    if (currUserId) {
      this.db.collection('users').doc(currUserId).snapshotChanges().subscribe(data => {
        this.userUid = data.payload.get('uid');
        this.userName = data.payload.get('displayName');
        this.userPic = data.payload.get('pic');
        this.userWins = data.payload.get('wins');
        this.userLosses = data.payload.get('losses');
      });
    }

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
          color: '#2FB5F3', // colorPalette[Math.floor(Math.random() * colorPalette.length)],
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

  loginGoogle() {
    this.auth.googleLogin();
  }

  logOff(user) {
    // this.updateUserStatus(user);
    this.auth.logout();
    this.router.navigateByUrl('home');
  }

  // updateUserStatus(user) {
  //   this.auth.updateUserStatus(user);
  // }

  onlineUsers() {
    this.availableUsers = this.auth.viewOnlineUsers();
  }

  startGame(uid, name) {
    alert('Starting a game with ' + name);
  }

  toHome() {
    this.router.navigateByUrl('home');
  }
  goToMulti() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'id': this.userName,
        'id2': this.userUid,
        'id3': this.userPic,
        'id4': this.userWins,
        'id5': this.userLosses
      }
    };
   // alert(userId);
   this.router.navigate(['multiPlayerLobby', this.userName, this.userUid, this.userPic, this.userWins, this.userLosses]);
   //  this.router.navigateByUrl('multiPlayerLobby' + this.userName);
    this.auth.updateGameTypeMulti(this.userUid);
  }

  createRandomId() {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  playGame() {
    this.router.navigateByUrl("single-setup");

    //const playerOne = new PlayerData('Rogue Entertainment', '', PlayerType.Local);
    //const playerTwo = new PlayerData('Jack', '', PlayerType.AIMCTSRandom); // AIMCTSDef
    //const currUserId = this.auth.getCurrentUser();
    //const gameId = this.createRandomId().toString();
    //this.gameService.newGame(playerOne, playerTwo, gameId);
    //// this.router.navigateByUrl('single-setup');

    //this.db.collection('users').doc(currUserId).valueChanges().subscribe(data => {
      //const creatorPic = data['pic'];
      //const creatorName = data['displayName'];
      //const joinerPic = 'assets/avatars/virusAvatar.png';

      //this.db.collection('games').doc(gameId).set({
        //gameId: gameId,
        //gameType: 'single',
        //isOpen: false,
        //state: 'STATE.OPEN',
        //creatorPic: creatorPic,
        //creatorId: currUserId,
        //creatorName: creatorName,
        //joinerPic: 'assets/avatars/virusAvatar.png',
        //joinerName: 'A.I.',
      //}).then(next => this.router.navigate(['board', gameId, creatorPic, joinerPic])); // 'singlePlayer'
    //});

///////////////////////

    // this.db.collection('users').doc(currUserId).update({
    //   currGameType: 'single'
    // }).then(next => this.router.navigate(['board', 'singlePlayer']));
    // TODO: Navigate with the Game ID: Create a Game for the single player in the DB so we can track wins/losses
  }
  // set settings to true. settings div will appear
  goToSettings() {
    this.showSettings = true;
  }
  goToTutorial() {
    this.showTutorial = true;
  }
  // settings & Tutorial is now closed
  goBack() {
    this.showSettings = false;
    this.showTutorial = false;
  }

}
