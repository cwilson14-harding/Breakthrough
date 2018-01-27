
type Coordinate = [number, number];
export class Board {

  // Properties
  private board: number[][];
  private readonly BOARD_SIZE: number = 8;
  private playerTurn = 1;
  // methods
  constructor() {
    this.newGame();
  }
  newGame() {
    // Initialize the board
    this.board = [];
    // Fill the board array with zeros.
    for (let r = 0; r < this.BOARD_SIZE; r++){
      this.board[r] = [];
      for (let c = 0; c < this.BOARD_SIZE; c++){
        if (r <= 1) {
          this.board[r][c] = 1;
        } else if (r >= this.BOARD_SIZE - 2) {
          this.board[r][c] = 2;
        } else {
          this.board[r][c] = 0;
        }
      }
    }
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
    return !(location[0] < 0 || location[1] < 0 ||
      location[0] >= this.BOARD_SIZE || location[1] >= this.BOARD_SIZE)
  }
  movePiece(c1: Coordinate, c2: Coordinate): boolean {
    if (this.isMoveValid(c1,c2))
    {
      let piece: number = this.board[c1[0]][c1[1]];
      this.board[c1[0]][c1[1]] = 0;
      this.board[c2[0]][c2[1]] = piece;

      // Change the turn.
      this.playerTurn = (this.playerTurn == 1) ? 2 : 1;

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
          case 1: playerOneFound = true; break;
          case 2: playerTwoFound = true; break;
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
  getBoardState() {
    return this.board;
  }
}
