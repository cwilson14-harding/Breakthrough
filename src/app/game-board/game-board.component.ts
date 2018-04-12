import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Coordinate} from '../models/game-core/coordinate';
import {AuthService, Game, User} from '../core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import {Player} from '../models/player';
import {LocalPlayer} from '../models/local-player';
import {AIPlayerMCTSDefensive} from '../models/ai-player-mcts-def';
import { GameService } from '../game.service';
import {PlayerData, PlayerType} from '../player-data';
import {Board} from '../models/board';
import {NetworkPlayer} from '../models/network-player';
import {Move} from '../models/move';
import {Router, ActivatedRoute} from '@angular/router';
import {AIPlayerRandom} from '../models/ai-player-random';
import {AIPlayerMCTSRandom} from '../models/ai-player-mcts-random';
import {ChatComponent} from '../chat/chat.component';
import {HostListener} from '@angular/core';
import {MusicService} from '../music.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {
  // variables for the game Gui
  gameId: string;
  creatorName;
  creatorPic;
  creatorId;
  joinerName;
  joinerPic;
  joinerId;
  isLoading = true;
  gameSettings = false;
  showGame = true;
  sliderVolume;
  volume = false;
  audioElement: HTMLAudioElement;

  winnerName;
  gameIsOver = false;

  // other variables
  board: Board;
  game: AngularFirestoreDocument<Game>;
  games: any;
  player1: Player;
  player2: Player;
  user: Observable<User>;
  gameReference: AngularFirestoreDocument<any>;
  connectionLost = false;
  didForfeit = false;
  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.browserClosed();
    this.router.navigateByUrl('main-menu');
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    return false;
  }
  browserClosed() {
    // TODO: CONFIRM before forfeit
    // this.router.navigateByUrl('game-over');
    return this.gameReference.update({
      state: 'STATE.FORFEIT'
    });
  }


  constructor(public db: AngularFirestore, private router: Router, public auth: AuthService,
              private gameService: GameService, public chat: ChatComponent, public audio: MusicService, public route: ActivatedRoute) {
    audio.setAudio('assets/music/Garoad - VA-11 HALL-A - Second Round - 26 Those Who Dwell in Shadows.mp3');
    this.board = new Board();
    this.board.newGame();

    // Get the game reference if multiplayer.
    if (this.gameService.gameId !== '') {
      this.game = this.db.collection('games').doc<Game>(this.gameService.gameId);
    }

    // Get the player data.
    const p1 = this.gameService.playerOne;
    const p2 = this.gameService.playerTwo;

    // Create the player objects.
    switch (p1.type) {
      case PlayerType.AIRandom: this.player1 = new AIPlayerRandom(); break;
      case PlayerType.AIMCTSDef: this.player1 = new AIPlayerMCTSDefensive(); break;
      case PlayerType.AIMCTSRandom: this.player1 = new AIPlayerMCTSRandom(); break;
      case PlayerType.Local: this.player1 = new LocalPlayer(1); break;
      case PlayerType.Network: this.player1 = new NetworkPlayer(this.game); break;
    }
    switch (p2.type) {
      case PlayerType.AIRandom: this.player2 = new AIPlayerRandom(); break;
      case PlayerType.AIMCTSDef: this.player2 = new AIPlayerMCTSDefensive(); break;
      case PlayerType.AIMCTSRandom: this.player2 = new AIPlayerMCTSRandom(); break;
      case PlayerType.Local: this.player2 = new LocalPlayer(2); break;
      case PlayerType.Network: this.player2 = new NetworkPlayer(this.game); break;
    }

    // Get the move from the first player.
    this.getMove();

    this.audioElement = audio.getAudio();
    this.sliderVolume = 1;

  }
  ngOnInit() {

    setTimeout(() => {
        this.isLoading = false;
      }, 2000);

    this.gameReference = this.db.collection<any>('games').doc(this.gameService.gameId);
    // this.gameId = this.route.snapshot.params['id'];
    this.creatorPic = this.route.snapshot.params['id2'];
    this.joinerPic = this.route.snapshot.params['id3'];
    this.gameReference.snapshotChanges().subscribe(data => {
      this.joinerName = data.payload.get('joinerName');
      this.joinerId = data.payload.get('joinerId');
      // this.joinerPic = data.payload.get('joinerPic');
      this.creatorName = data.payload.get('creatorName');
      this.creatorId = data.payload.get('creatorId');
      // this.creatorPic = data.payload.get('creatorPic');
    });
  }
  /* movePiece: function(){}
     Moves a piece from one coordinate to the other if the move was valid.
     Returns a boolean that is true if the move was made, or false if the move was not valid.
  */
  getMove() {
    const currentPlayer = this.currentPlayer;

    // Connection lost
    if (this.currentPlayer instanceof NetworkPlayer) {

      // this.db.collection('games').doc(this.gameService.gameId).valueChanges().subscribe(data => {
      //   if (data['forfeit'] === true) {
      //     this.didForfeit = true;
      //     setTimeout(() => {
      //       this.router.navigate(['main-menu']);
      //     }, 2000);
      //   }
      // });

      setTimeout(() => {
        // alert('The WiFi Connection has been lost, unfortunately the Game is Over');
        this.connectionLost = true;
      }, 60000);
      setTimeout(() => {
        this.router.navigateByUrl('main-menu');
      }, 63000);
    }

    if (currentPlayer) {
      const movePromise: Promise<Move> = currentPlayer.getMove(this);

      // connection lost
      if (this.currentPlayer instanceof NetworkPlayer) {
        // check for the connection
        if (navigator.onLine) {
          // alert('You have a connection');
        } else {
          // alert('connection has been lost, the game is now over!');
          this.connectionLost = true;
          setTimeout(() => {
            this.router.navigateByUrl('main-menu');
          }, 3000);
        }
      }

      movePromise.then((move: Move) => {
        // Make the move on the game board.
        this.board.makeMove(move);

        // Reset highlighting
        this.board.clearHighlighting();
        this.board.boardClass[move.from.row][move.from.column] += ' lastMove';
        this.board.boardClass[move.to.row][move.to.column] += ' lastMove';

        // Check if the game is over.
        const winner: number = this.board.isGameFinished();
        if (winner) {
          const winnerData: PlayerData = (winner === 1) ? this.gameService.playerOne : this.gameService.playerTwo;

          // Send the winning move if multiplayer.
          if (this.currentPlayer instanceof NetworkPlayer) {
            (this.currentPlayer as NetworkPlayer).sendWinningMove(this.board.lastMove, winnerData.name);
            // TODO: Update leaderboard.
            this.game.valueChanges().subscribe( data => {
              const creatorName = data['creatorName'];
              const creatorId = data['creatorId'];
              const joinerName = data['joinerName'];
              const joinerId = data['joinerId'];
              if (winnerData.name === creatorName) {
                this.db.collection('users').doc(creatorId).update({
                  wins: +1
                });
                this.db.collection('users').doc(joinerId).update({
                  losses: +1
                });
              } else if (winnerData.name === joinerName) {
                this.db.collection('users').doc(joinerId).update({
                  wins: +1
                });
                this.db.collection('users').doc(creatorId).update({
                  losses: +1
                });
              }
            });
          }

          // Show the game over.
          setTimeout(() => {
            this.gameIsOver = true;
            this.winnerName = winnerData.name;

            // Route to game-over based on if this player won or lost
            if (winnerData.type === PlayerType.Local) {
              this.router.navigateByUrl('game-over-win');
            } else {
              this.router.navigateByUrl('game-over-lose');
            }
          }, 3000);
        } else {
          this.getMove();
        }
      }, () => {
        alert('Move rejected');
      });
    }
  }
  get currentPlayer(): Player {
    if (this.board.playerTurn === 1) {
      return this.player1;
    } else if (this.board.playerTurn === 2) {
      return this.player2;
    } else {
      return undefined;
    }
  }
  newGameClicked() {
    // Initialize variables.
    this.board.newGame();

    if (this.player1 instanceof LocalPlayer) {
      this.player1 = new LocalPlayer(1);
    } else if (this.player1 instanceof AIPlayerMCTSDefensive) {
      this.player1 = new AIPlayerMCTSDefensive();
    } else if (this.player1 instanceof  AIPlayerMCTSRandom) {
      this.player1 = new AIPlayerMCTSRandom();
    } else if (this.player1 instanceof AIPlayerRandom) {
      this.player1 = new AIPlayerRandom();
    }

    if (this.player2 instanceof LocalPlayer) {
      this.player2 = new LocalPlayer(2);
    } else if (this.player2 instanceof AIPlayerMCTSDefensive) {
      this.player2 = new AIPlayerMCTSDefensive();
    } else if (this.player2 instanceof  AIPlayerMCTSRandom) {
      this.player2 = new AIPlayerMCTSRandom();
    } else if (this.player2 instanceof AIPlayerRandom) {
      this.player2 = new AIPlayerRandom();
    }

    // Start the game.
    this.getMove();
  }

  selectRowCol(target: [number, number]) {
    const coord: Coordinate = new Coordinate(target[0], target[1]);
    this.selectPiece(coord);
  }

  selectPiece(target: Coordinate) {
    const currentPlayer = this.currentPlayer;
    this.board.clearHighlighting();
    if (currentPlayer instanceof LocalPlayer) {
      const localPlayer: LocalPlayer = currentPlayer as LocalPlayer;
      localPlayer.selectPiece(target);
      this.board.selectedCoordinate = localPlayer.selectedCoordinate;

      if (localPlayer.selectedCoordinate !== undefined) {
        this.board.boardClass[localPlayer.selectedCoordinate.row][localPlayer.selectedCoordinate.column] += ' selected';
        for (const coord of this.board.findAvailableMoves(localPlayer.selectedCoordinate)) {
          this.board.boardClass[coord.row][coord.column] += ' potentialMove';
        }
      }
    }

    // Ignore if a non-local player.
  }
  showChatClicked() {
    const div = document.getElementById('chatContainer');
    if (div.style.display !== 'none') {
      div.style.display = 'none';
    } else {
      div.style.display = 'block';
      document.getElementById('messageBox').focus();
    }
  }

  hideLegendClicked() {
    const div = document.getElementById('legend');
    if (div.style.display !== 'none') {
      div.style.display = 'none';
    } else {
      div.style.display = 'block';
      document.getElementById('legend').focus();
    }
  }



  forfeitClicked() {
    this.router.navigateByUrl('game-over-lose'); // TODO: change to lose once testing complete
  }

  getCurrentGame(user, game) {
    if (user.displayName === game.creatorName) {
      alert('This is your game.');
    } else {
      alert("This is " + game.creatorName + "'s game."); // added 's. is accurate?
    }
  }
  goToGameSettings() {
    this.gameSettings = true;
    this.showGame = false;
  }
  goBack() {
    this.gameSettings = false;
    this.showGame = true;
    // this.volume = false;
  }
  showVolume() {
    this.gameSettings = false;
    this.volume = true;
  }
  changeVolumeLevel(newValue) {
    console.log('volumeUpdated');
    this.sliderVolume = newValue;
    this.audioElement.volume = this.sliderVolume;
  }
  logOff(user) {
    // this.updateUserStatus(user);
    this.auth.logout();
    this.router.navigateByUrl('home');
  }
}
