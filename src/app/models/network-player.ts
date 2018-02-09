import {Player} from './player';
import {Coordinate} from './game-core/coordinate';
import {GameBoardComponent} from '../game-board/game-board.component';
import {Game} from '../core/auth.service';
import {AngularFirestoreDocument} from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';

export class NetworkPlayer implements Player {
  board: GameBoardComponent;
  private resolve: Function;
  private reject: Function;
  private subscription: Subscription;

  constructor(private game: AngularFirestoreDocument<Game>) {}

  getMove(board: GameBoardComponent): Promise<[Coordinate, Coordinate]> {
    return new Promise<[Coordinate, Coordinate]>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.board = board;

      // Send new move.
      this.game.update({
        playerTurn: this.board.board.playerTurn
      });

      /* TODO: Fix network listener not working?
      // Wait for a new one.
      this.subscription = this.game.valueChanges().subscribe(game => {
        this.board.board.playerTurn = game.playerTurn.valueOf();
        console.log('move made!');
        this.resolve();
        this.subscription.unsubscribe();
      });*/
    });
  }
}
