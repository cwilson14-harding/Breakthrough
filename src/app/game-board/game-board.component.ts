import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Coordinate} from "../models/game-core/coordinate";

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  private board: number[][];
  private readonly BOARD_SIZE: number = 8;
  private playerTurn = 1;
  private selectedCoordinate: Coordinate = undefined;


  constructor(private db: AngularFirestore) {
    //this.board = db.collection('board').valueChanges();
  }

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    // Initialize the board
    this.board = [];
    // Fill the board array with zeros.
    for (let r = 0; r < this.BOARD_SIZE; r++) {
      this.board[r] = [];
      for (let c = 0; c < this.BOARD_SIZE; c++) {
        if (r <= 1) {
          this.board[r][c] = 1;
        } else if (r >= this.BOARD_SIZE - 2) {
          this.board[r][c] = 2;
        } else {
          this.board[r][c] = 0;
        }
      }
    }

    // Initialize variables.
    this.selectedCoordinate = undefined;
    this.playerTurn = 1;
  }

  isMoveValid(location1: Coordinate, location2: Coordinate): boolean {
    // Verify that both locations given are valid.
    if (!this.isLocationValid(location1) || !this.isLocationValid(location2) || this.isGameFinished() != 0) {
      return false;
    }

    // Find the piece at the given starting location.
    let piece = this.board[location1[0]][location1[1]];
    let row: number;

    // Verify that the starting piece exists and that it's the player's turn.
    // If so, find the row we need to be moving to.
    if (piece == 0 || piece != this.playerTurn) {
      return false;
    }
    else if (piece == 1) {
      row = location1[0] + 1;
    }
    else {
      row = location1[0] - 1;
    }

    // Verify that we are moving to the next row.
    if (location2[0] != row) {
      return false;
    }

    // Check to see if the move is within range and direction of piece.
    if (Math.abs(location2[1] - location1[1]) > 1) {
      return false;
    }

    // If we are moving forwards, check to see if the space ahead is clear.
    if (location1[1] == location2[1] && this.board[row][location2[1]] != 0) {
      return false;
    }

    // We are moving diagonally, check to see if the space is clear of our own pieces.
    return (this.board[row][location2[1]] != piece);
  }

  isLocationValid(location: Coordinate): boolean {
    return (location !== undefined && location[0] >= 0 && location[1] >= 0 &&
      location[0] < this.BOARD_SIZE && location[1] < this.BOARD_SIZE)
  }

  selectPiece(target: Coordinate) {
    if (this.selectedCoordinate !== undefined && this.selectedCoordinate[0] == target[0] && this.selectedCoordinate[1] == target[1]) {
      this.selectedCoordinate = undefined;
    } else if (this.board[target[0]][target[1]] == this.playerTurn) {
      this.selectedCoordinate = target;
    }
  }

  movePiece(target: Coordinate): boolean {
    this.selectPiece(target);
    if (this.isMoveValid(this.selectedCoordinate, target)) {
      let piece: number = this.board[this.selectedCoordinate[0]][this.selectedCoordinate[1]];
      this.board[this.selectedCoordinate[0]][this.selectedCoordinate[1]] = 0;
      this.board[target[0]][target[1]] = piece;

      // Change the turn.
      this.playerTurn = (this.playerTurn == 1) ? 2 : 1;

      // Deselect the piece.
      this.selectedCoordinate = undefined;

      return true;
    }
    return false;
  }

  isGameFinished(): number {
    // Check for a home row victory.
    for (let c = 0; c < this.BOARD_SIZE; ++c) {
      // Check for player 2 (black) on player 1's home row.
      if (this.board[this.BOARD_SIZE - 1][c] == 1) {
        return 1;
      }

      // Check for player 1 (white) on player 2's home row.
      if (this.board[0][c] == 2) {
        return 2;
      }
    }

    // Search the board to find if each player has a piece or not.
    let playerOneFound = false;
    let playerTwoFound = false;
    for (let r = 0; r < this.BOARD_SIZE && (!playerOneFound || !playerTwoFound); ++r) {
      for (let c = 0; c < this.BOARD_SIZE && (!playerOneFound || !playerTwoFound); ++c) {
        switch (this.board[r][c]) {
          case 1:
            playerOneFound = true;
            break;
          case 2:
            playerTwoFound = true;
            break;
        }
      }
    }

    // Check if one side has run out of pieces.
    if (playerOneFound && playerTwoFound) {
      return 0;
    } else if (playerOneFound) {
      return 1;
    } else {
      return 2;
    }

  }
  // findAvailableMoves: function(){}
  // Parameters location:Coordinate
  // Returns: An array of type Coordinate.
  // This function checks to see what moves are available at a location
  // findAvailableMoves():Coordinate[] {
  //   return this.findAvailableMoves(this.selectedCoordinate);
  // }

  findAvailableMoves(location: Coordinate):Coordinate[] {
    // When an empty array is returned that means there are no available moves from the
    // location passed into the function.
    if (!this.isLocationValid(location) || this.board[location[0]][location[1]] == 0) {
      return [];
    }

    let availableMoves: Coordinate[] = [];
    // Find the next row to move to.
    let row: number;
    if (this.board[location[0]][location[1]] == 1) {
      row = location[0] + 1;
    }
    else {
      row = location[0] - 1;
    }
    // Testing if the diagonals or center moves are valid.
    // During this for loop all available moves are pushed to the availableMoves array.
    for (let count: number = -1; count <= 1; count++){
      let column: number = location[1] + count;
      let location2:Coordinate = [row, column];
      if (this.isMoveValid(location, location2)) {
        availableMoves.push(location2);
      }
    }
    return availableMoves;
  }


  getBoardState() {
    return this.board;
  }
}
