import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import { user } from '../models/user';
import { game } from '../models/game';
import {Coordinate} from '../models/game-core/coordinate';
import { AuthService } from '../core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import {Player} from '../models/player';
import {LocalPlayer} from '../models/local-player';
import {AIPlayer} from '../models/ai-player';
import { GameService } from '../game.service';
import {PlayerType} from '../player-data';
import {Board} from '../models/board';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {

  user: Observable<user>;
  game: Observable<game>;
  games: any;
  currentUserName: any;
  player1: Player;
  player2: Player;
  board: Board = new Board();

  constructor(public db: AngularFirestore, public auth: AuthService, public afAuth: AngularFireAuth, private gameService: GameService) {
    this.currentUserName = this.afAuth.auth.currentUser.displayName;
    // this.board = db.collection('board').valueChanges();
    // Compare the user.uid field with the game.creatorId field.
    // this.games = this.db.collection('games', ref => ref.where('creatorName', '==', this.currentUserName));
    this.games = this.db.collection('games').valueChanges();

    const p1 = gameService.playerOne;
    const p2 = this.gameService.playerTwo;

    switch (p1.type) {
      case PlayerType.AI: this.player1 = new AIPlayer(); break;
      case PlayerType.Local: this.player1 = new LocalPlayer(1); break;
      case PlayerType.Network: this.player1 = new LocalPlayer(1); break; // TODO: Change to NetworkPlayer
    }

    switch (p2.type) {
      case PlayerType.AI: this.player2 = new AIPlayer(); break;
      case PlayerType.Local: this.player2 = new LocalPlayer(2); break;
      case PlayerType.Network: this.player2 = new LocalPlayer(2); break; // TODO: Change to NetworkPlayer
    }

  }

  /* movePiece: function(){}
     Moves a piece from one coordinate to the other if the move was valid.
     Returns a boolean that is true if the move was made, or false if the move was not valid.
  */
  getMove() {
    this.board.clearHighlighting();
    const currentPlayer = this.currentPlayer;
    if (currentPlayer !== undefined) {
      const movePromise: Promise<[Coordinate, Coordinate]> = currentPlayer.getMove(this);

      movePromise.then((move: [Coordinate, Coordinate]) => {
        this.board.makeMove(move);
        this.getMove();
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

  newGame() {
    // Initialize variables.
    this.board.newGame();

    if (this.player1 instanceof LocalPlayer) {
      this.player1 = new LocalPlayer(1);
    } else if (this.player1 instanceof AIPlayer) {
      this.player1 = new AIPlayer();
    }

    if (this.player2 instanceof LocalPlayer) {
      this.player2 = new LocalPlayer(2);
    } else if (this.player2 instanceof AIPlayer) {
      this.player2 = new AIPlayer();
    }

    // Start the game.
    this.getMove();
  }

  selectPiece(target: Coordinate) {
    const currentPlayer = this.currentPlayer;
    this.board.clearHighlighting();
    if (currentPlayer instanceof LocalPlayer) {
      const localPlayer: LocalPlayer = currentPlayer as LocalPlayer;
      localPlayer.selectPiece(target);
      this.board.selectedCoordinate = localPlayer.selectedCoordinate;

      if (localPlayer.selectedCoordinate !== undefined) {
        this.board.boardClass[localPlayer.selectedCoordinate[0]][localPlayer.selectedCoordinate[1]] = 'selected';
        for (const coord of this.board.findAvailableMoves(localPlayer.selectedCoordinate)) {
          this.board.boardClass[coord[0]][coord[1]] = 'potentialMove';
        }
      }
    }

    // Ignore if a non-local player.
  }

  getCurrName() {
    // this.currentUserName = this.afAuth.auth.currentUser.displayName;
    // alert(this.currentUserName);
    this.games = this.db.collection('games', ref => ref.where('creatorName', '==', this.currentUserName));
  }

  getCurrentGame(user, game) {
    if (user.displayName === game.creatorName) {
      alert('This is your game.');
    } else {
      alert('This is ' + game.creatorName + ' game.');
    }
  }

  ngOnInit() {
    this.newGame();
  }
}
