import {Player} from './player';
import {Coordinate} from './game-core/coordinate';
import {GameBoardComponent} from '../game-board/game-board.component';
import {Game} from '../core/auth.service';
import {AngularFirestoreDocument} from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';
import {Move} from './move';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export class NetworkPlayer implements Player {
  board: GameBoardComponent;
  private resolve: Function;
  private reject: Function;
  private sub;
  isNetworkOut = false;

  constructor(private game: AngularFirestoreDocument<Game>) {}

  getMove(board: GameBoardComponent): Promise<Move> {
    // Send the last move to the database.


    // Get the new move back.
    return new Promise<Move>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.board = board;

      // Send new move.
      if (this.board.board.lastMove) {
        this.sendMove(this.board.board.lastMove).then(() => {
          this.makeRemoteMove();
        });
      } else {
        // Called on first move when the remote player is first.
        this.makeRemoteMove();
      }
    });
  }

  sendWinningMove(move: Move, winnerName: string) {
    this.game.update({
      lastMove: move.toString(),
      winner: winnerName
    });
  }

  private sendMove(move: Move): Promise<void> {
   // this.checkConnection();
    return this.game.update({
      lastMove: move.toString()
    });
  }

  private makeRemoteMove() {

    // Set a timeout: If the user doesn't get a move after 60 seconds, then either the wifi has gone out.
    setTimeout(() => {
      // alert('The WiFi Connection has been lost, unfortunately the Game is Over');
      this.isNetworkOut = true;
    }, 60000);

    // Wait for a new move.
    this.sub = this.game.valueChanges().subscribe(data => {
      // Get the move.
      if (data['lastMove']) {
        const c1: Coordinate = new Coordinate(+data['lastMove'][0], +data['lastMove'][1]);
        const c2: Coordinate = new Coordinate(+data['lastMove'][2], +data['lastMove'][3]);
        const move: Move = new Move(c1, c2);

        // The first move retrieved will always be the last move made, so make sure we get a valid one back.
        if (this.board.board.isMoveValid(move)) {
          this.sub.unsubscribe();
          this.resolve(move);
        }
      }
    });
  }

  // checks to see if there is wifi
  checkConnection() {
    if (navigator.onLine) {
      // alert('You have a connection');
    }
    else {
      this.isNetworkOut = true;
      // alert('connection has been lost, the game is now over!');
    }
  }
}
