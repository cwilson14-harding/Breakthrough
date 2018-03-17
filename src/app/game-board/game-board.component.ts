import {Component, OnInit, EventEmitter} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
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
import {Router} from '@angular/router';
import {HostListener} from '@angular/core';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import {AIPlayerRandom} from '../models/ai-player-random';
import {AIPlayerMCTSRandom} from '../models/ai-player-mcts-random';
import {ChatComponent} from '../chat/chat.component';
import {auth} from 'firebase/app';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {
  board: Board;
  game: AngularFirestoreDocument<Game>;
  games: any;
  currentUserName: any;
  playBackgroundMusic: boolean;
  player1: Player;
  player2: Player;
  user: Observable<User>;
  constructor(public db: AngularFirestore, private router: Router, public auth: AuthService,
              public afAuth: AngularFireAuth, private gameService: GameService, public chat: ChatComponent) {
    this.board = new Board();
    this.board.newGame();

    this.currentUserName = this.afAuth.auth.currentUser.displayName;
    // this.board = db.collection('board').valueChanges();
    // Compare the user.uid field with the game.creatorId field.
    // this.games = this.db.collection('games', ref => ref.where('creatorName', '==', this.currentUserName));
    this.games = this.db.collection('games').valueChanges();
    if (this.gameService.gameId !== '') {
      this.game = this.db.collection('games').doc<Game>(this.gameService.gameId);
    }

    const p1 = this.gameService.playerOne;
    const p2 = this.gameService.playerTwo;

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

    this.getMove();

  }
  /* movePiece: function(){}
     Moves a piece from one coordinate to the other if the move was valid.
     Returns a boolean that is true if the move was made, or false if the move was not valid.
  */
  getMove() {
    const currentPlayer = this.currentPlayer;
    if (currentPlayer) {
      const movePromise: Promise<Move> = currentPlayer.getMove(this);

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
          }

          // Show the game over.
          setTimeout(() => {
            // this.router.navigateByUrl(('game-over'));
            // TODO: Go to game over screen.
            alert(winnerData.name + ' [' + winner + '] has won!');
            this.router.navigateByUrl('main-menu');
          }, 1000);
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
  showChatClicked(Null: null) {
    const div = document.getElementById('chatContainer');
    if (div.style.display !== 'none') {
      div.style.display = 'none';
    } else {
      div.style.display = 'block';
    }
  }
  getCurrName() {
    // this.currentUserName = this.afAuth.auth.currentUser.displayName;
    // alert(this.currentUserName);
    this.games = this.db.collection('games', ref => ref.where('creatorName', '==', this.currentUserName));
  }

  /*sendChatMessage() {
    interface IMessage {
      message: string;
      sender: string;
      time: any;
    }
    // Get what is inside of the message box. This value will be stored inside of the message property inside of the Message interface.
    const messageBoxValue = ((document.getElementById('messageBox') as HTMLInputElement).value);
    // Get the person who sent the message.
    const messageSender = this.currentUserName;
    // Get the time when the message was sent.
    const time = Date.now();

    const message: IMessage = {
      message: messageBoxValue,
      sender: messageSender,
      time: time
    };

    // Create a message object.
    this.chat.newMessage(message, this.gameService.gameId);
    // TODO Clear the chat box;
  }*/

  getCurrentGame(user, game) {
    if (user.displayName === game.creatorName) {
      alert('This is your game.');
    } else {
      alert('This is ' + game.creatorName + ' game.');
    }
  }
  forfeitClicked(Null: null) {
    // TODO: CONFIRM before forfeit
    // this.router.navigateByUrl(('game-over'));
    this.router.navigateByUrl(('main-menu'));
  }

  ngOnInit() {}
}
