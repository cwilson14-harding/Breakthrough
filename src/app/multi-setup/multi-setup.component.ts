import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlayerData, PlayerType} from '../player-data';
import {GameService} from '../game.service';
import {MatButtonToggle} from '@angular/material/button-toggle';
import {AuthService} from '../core/auth.service';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-multi-setup',
  templateUrl: './multi-setup.component.html',
  styleUrls: ['./multi-setup.component.scss']
})
export class MultiSetupComponent implements OnInit {

  constructor(private router: Router, private gameService: GameService, public route: ActivatedRoute,
              public auth: AuthService, public db: AngularFirestore) { }

  gameId;
  creatorName;
  creatorId;
  joinerId;
  joinerName;
  creatorWins;
  creatorLosses;
  joinerWins;
  joinerLosses;
  creatorPic = '';
  joinerPic = '';
  player1 = false;
  player2 = false;
  playerOrderGroup: string;
  gameNotJoined = false;

  ngOnInit() {
    this.gameId = this.route.snapshot.params['id'];
    this.getGameInfo();

    // If no joiner after 45 seconds, the game will be closed by default
    // if (this.joinerName === undefined) {
    //   setTimeout(() => {
    //     this.closeGame();
    //   }, 45000);
    // }

    // alert(this.joinerName);
    //
    // if (this.joinerName !== undefined) {
    //   setTimeout(() => {
    //     this.goToBoard();
    //   }, 3000);
    // }
  }

  getGameInfo() {
    this.db.collection('games').doc(this.gameId).valueChanges().subscribe(data => {
      this.joinerName = data['joinerName'];
      this.joinerId = data['joinerId'];
      this.creatorName = data['creatorName'];
      this.creatorId = data['creatorId'];
      this.creatorWins = data['creatorWins'];
      this.creatorLosses = data['creatorLosses'];
      this.joinerWins = data['joinerWins'];
      this.joinerLosses = data['joinerLosses'];
      this.creatorPic = data['creatorPic'];
      this.joinerPic = data['joinerPic'];

      if (this.auth.getCurrentUser() === this.creatorId) {
        this.player1 = true;
        this.player2 = false;
        // document.getElementById('playerOrderGroup').removeAttribute('disabled');
      } else if (this.auth.getCurrentUser() === this.joinerId) {
        this.player2 = true;
        this.player1 = false;
      }

       if (this.joinerName !== '') {
      //   // document.getElementById('playButton').removeAttribute('disabled');
         this.goToBoard();
      //   // alert(this.joinerName);
       }
    });
  }

  goToBoard() {
    let playerOne: PlayerData;
    let playerTwo: PlayerData;

    // Determine who is local and who is remote.
    const isJoining = (this.joinerId === this.auth.getCurrentUser());
    const creatorType: PlayerType = (isJoining) ? PlayerType.Network : PlayerType.Local;
    const joinerType: PlayerType = (isJoining) ? PlayerType.Local : PlayerType.Network;
    const creatorPlayer = new PlayerData(this.creatorName, '', creatorType);
    const joinerPlayer = new PlayerData(this.joinerName, '', joinerType);

    // Determine the starting player if random.
    if (this.playerOrderGroup === 'rand') {
      this.playerOrderGroup = ['p1', 'p2'][Math.floor(Math.random() % 2)];
    }

    // Set up the game data and player order for who is going first.
    if (this.playerOrderGroup === 'p1') {
      playerOne = creatorPlayer;
      playerTwo = joinerPlayer;
    } else {
      playerOne = joinerPlayer;
      playerTwo = creatorPlayer;
    }

    // Set the game data.
    this.gameService.newGame(playerOne, playerTwo, this.gameId);

    // Start the game.
    // TODO: Move to a button on the host's screen.
    this.router.navigate(['board', this.gameId, this.creatorPic, this.joinerPic]);
  }

  returnToMenu() {
    this.router.navigateByUrl('main-menu'); // TODO: sometimes returns to main menu?
  }

  closeGame() {
    alert('game is closing due to inactivity');
    this.gameNotJoined = true;
    this.db.collection('games').doc(this.gameId).update({
      isOpen: false
    }).then(next => this.router.navigateByUrl('main-menu'));
  }

}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// import { Component, OnInit, Input } from '@angular/core';
// import {ActivatedRoute, Router} from '@angular/router';
// import {PlayerData, PlayerType} from '../player-data';
// import {GameService} from '../game.service';
// import {AuthService} from '../core/auth.service';
// import {AngularFirestore} from 'angularfire2/firestore';
// // import {MatButtonToggleModule} from '@angular/material/button-toggle';
// @Component({
//   selector: 'app-multi-setup',
//   templateUrl: './multi-setup.component.html',
//   styleUrls: ['./multi-setup.component.scss']
// })
// export class MultiSetupComponent implements OnInit {
//
//   constructor(private router: Router, private gameService: GameService, public route: ActivatedRoute,
//               public auth: AuthService, public db: AngularFirestore) { }
//
//   gameId;
//   creatorName;
//   creatorId;
//   joinerId;
//   creatorPic = 'pic';
//   joinerPic = 'pic';
//   joinerName;
//   player1 = false;
//   player2 = false;
//
//   ngOnInit() {
//     this.gameId = this.route.snapshot.params['id'];
//     this.getGameInfo();
//   }
//
//   getGameInfo() {
//     this.db.collection('games').doc(this.gameId).valueChanges().subscribe(data => {
//       this.joinerName = data['joinerName'];
//       this.joinerId = data['joinerId'];
//       this.creatorName = data['creatorName'];
//       this.creatorId = data['creatorId'];
//
//       if (this.auth.getCurrentUser() === this.creatorId) {
//         this.player1 = true;
//         this.player2 = false;
//       }
//       else if (this.auth.getCurrentUser() === this.joinerId) {
//         this.player2 = true;
//         this.player1 = false;
//       }
//
//       if (this.joinerName !== '') {
//         this.goToBoard();
//       }
//     });
//   }
//
//   goToBoard() {
//     // TODO: Set player order.
//     // TODO: Change remote player (relative to self, who is local) to PlayerType.Network and finish NetworkPlayer implementation.
//     const playerOne = new PlayerData('Creator', '', PlayerType.Local);
//     const playerTwo = new PlayerData('Joiner', '', PlayerType.Local);
//     this.gameService.newGame(playerOne, playerTwo, this.gameId); // TODO: Supply game ID.
//     setTimeout(() => {
//       this.router.navigate(['board', this.gameId, this.creatorPic, this.joinerPic]);
//     }, 2000);
//   }
//
//   returnToMenu() {
//     this.router.navigateByUrl('multiPlayerLobby');
//   }
//
// }
