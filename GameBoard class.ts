// Place into TypeScript Playground to test.
// Alaina - added surrounding module and export statements, changed file extension to ts
export module GameCore {
    export type Coordinate = [number, number];
    export class Board {

    /*
    Board -> Array diagram. Array on inside, board notation on outside.
    Art by CJ Wilson.

        0 1 2 3 4 5 6 7
        A B C D E F G H
    8 7 B B B B B B B B
    7 6 B B B B B B B B
    6 5 - - - - - - - -
    5 4 - - - - - - - -
    4 3 - - - - - - - -
    3 2 - - - - - - - -
    2 1 W W W W W W W W
    1 0 W W W W W W W W
    R  0 1 2 3 4 5 6 7 Column
    O  A B C D E F G H
    W
        */

        // Properties
        private board: number[][];
        private readonly BOARD_SIZE: number = 8;
        private playerTurn: number = 1;

        // Methods
        constructor() {
            this.newGame();
        }

        newGame() {
            // Initialize the board
            this.board = [];
            // Fill the board array with zeros.
            for (var r = 0; r < this.BOARD_SIZE; r++){
                this.board[r] = [];
                for (var c = 0; c < this.BOARD_SIZE; c++){
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

        // getTurn
        // Returns whose turn it is (1 or 2).
         getTurn() {
             return this.playerTurn;
         }

        // isMoveValid: function(){}
        // Parameters: location1: [number, number], location2: [number, number]
        // The parameters location1 and location2 are tuples that contains two numbers.
        // These numbers are the x and y coordinates for a potential location.

        // This function checks to see if the piece in location1 is okay to move to location2.
        // Returns: A boolean that determines if it is okay to move.
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

        // isLocationValid: function(){}
        // Parameters: location: [number, number]
        // The parameter location is a tuple that contains two numbers. These numbers are the x and y
        // coordinates for a potential location.

        // The function checks to see if a move is out of bounds. It returns true if the location
        // passed in is in bounds. Otherwise the function returns false.
        isLocationValid(location: Coordinate): boolean {
            return !(location[0] < 0 || location[1] < 0 ||
                location[0] >= this.BOARD_SIZE || location[1] >= this.BOARD_SIZE)
        }

        // findAvailableMoves: function(){}
        // Parameters location:Coordinate
        // Returns: An array of type Coordinate.
        // This function checks to see what moves are available at a location
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

        // movePiece
        // Moves a piece from one coordinate to the other if the move was valid.
        // Returns true if the move was made, or false if it wasn't valid.
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

        // isGameFinished
        // Checks if the game has finished and returns the winner.
        // Returns:
        //      0: Game has not finished.
        //      1: Player 1 has won.
        //      2: Player 2 has won.
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
            let playerOneFound: boolean = false;
            let playerTwoFound: boolean = false;
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

    export class AIPlayer implements Player {
        constructor() {}
        notifyTurnStarted(board: Board) {
            let boardState = board.getBoardState();
            let possibleMoves: [Coordinate, Coordinate][] = [];

            for (let r = 0; r < 8; ++r) {
                for (let c = 0; c < 8; ++c) {
                    let moves: Coordinate[] = board.findAvailableMoves([r, c]);

                    for (let i = 0; i < moves.length; ++i) {
                        possibleMoves.push([[r,c], moves[i]]);
                    }
                }
            }

            if (possibleMoves.length > 0) {
                let index = Math.floor((Math.random() * possibleMoves.length);
                let fromLoc = possibleMoves[index][0];
                let toLoc = possibleMoves[index][1];
                logMove(board.movePiece(fromLoc, toLoc), fromLoc, toLoc, "Geraldo[AI"+((board.getTurn() == 1) ? 2 : 1)+"]");
            }
        }
    }

    interface Player {
        notifyTurnStarted(board: Board);
    }


    let board: Board = new Board();
    let selectedCell: Coordinate = undefined;
    let aiInterval;
    let ai = new AIPlayer();

    function boardToString(board: number[][]) {
        let result: string = "";
        for (let row in board) {
            result += "<div class='row'>";
            for (let col in board[row]) {
                result += "<div id='" + row + "-" + col + "' onclick='guiMove(this);' class='cell noSelect";
                if (board[row][col] == 1) result += " whitePlayer'>X";
                else if (board[row][col] == 2) result += " blackPlayer'>O";
                else result += "'>";
                result += "</div>";
            }
            result += "</div>";
        }
        result += "<br style='clear:both;'/>"
        return result;
    }
    function guiMove(obj: string) {
        let coord = obj.id.split('-');
        let cell: Coordinate = [+coord[0], +coord[1]];
        if (selectedCell == undefined) {
            let moves = board.findAvailableMoves(cell);
            if (moves.length > 0) {
                selectedCell = cell;
                obj.classList.add("selectedCell");
                for (let move of moves) {
                    document.getElementById(move.join('-')).classList.add("possibleMove");
                }
            }
        } else if (cell[0] == selectedCell[0] && cell[1] == selectedCell[1]) {
            selectedCell = undefined;
            removeClass("selectedCell");
            removeClass("possibleMove");
            removeClass("possibleMove");
        } else {
            let success:boolean = board.movePiece(selectedCell, cell);
            logMove(success, selectedCell, cell, "Human[" + ((board.getTurn() == 1) ? 2 : 1) + "]");
            selectedCell = undefined;
            removeClass("selectedCell");
            removeClass("possibleMove");
            removeClass("possibleMove");
            if (success && document.getElementById("human-ai").checked) {
                setTimeout(ai_move, document.getElementById('autoAISpeed').value);
            }
        }
}
function removeClass(c) {
        for (let o of document.getElementsByClassName(c))
                o.classList.remove(c);
    }
    function ai_move() {
        selectedCell = undefined;
        ai.notifyTurnStarted(board);
        if (document.getElementById("autoAI").checked) {
            if (aiInterval != undefined) {
                stopAutoAI(true);
            }
            aiInterval = setInterval(ai_move, document.getElementById('autoAISpeed').value);
        }
}
function stopAutoAI(shouldStop: boolean) {
    if (shouldStop) {
        clearInterval(aiInterval);
        aiInterval = undefined;
    }
    }
    function move() {
        let fromRow = document.getElementById("fromRow");
        let toRow = document.getElementById("toRow");
        let fromCol = document.getElementById("fromCol");
        let toCol = document.getElementById("toCol");

        let location1: Coordinate = [+fromRow.value, +fromCol.value];
        let location2: Coordinate = [+toRow.value, +toCol.value];
        logMove(board.movePiece(location1, location2), location1, location2, "Human[" + ((board.getTurn() == 1) ? 2 : 1) + "]");
        if (document.getElementById("human-ai").checked) {
            setTimeout(ai_move, document.getElementById('autoAISpeed').value);
        }
    }
    function logMove(validMove: boolean, loc1: Coordinate, loc2: Coordinate, name: string) {
        let status = document.getElementById("status");
        let log = document.getElementById("log");
        if (validMove) {
            redraw();

            log.style.display = "block";
            status.innerText = name + "  moved from " + numberToLetter(loc1[1]) + (loc1[0] + 1)
                + " to " + numberToLetter(loc2[1]) + (loc2[0] + 1) + ".";
            log.innerHTML += status.innerText + "<br>";

            let winner = board.isGameFinished()
            if (winner != 0) {
                status.innerHTML += "<br>Player " + winner + " won!";
            }
        } else {
            status.innerText = "Invalid move.";
        }
    }
    function numberToLetter(n: number): string {
        switch (n) {
            case 0: return 'A';
            case 1: return 'B';
            case 2: return 'C';
            case 3: return 'D';
            case 4: return 'E';
            case 5: return 'F';
            case 6: return 'G';
            case 7: return 'H';
            default: return '!';
        }
    }
    function getSelectedText(node) {
        return node.options[node.selectedIndex].text
    }
    function redraw() {
        let htmlboard = document.getElementById("board");
        htmlboard.innerHTML = boardToString(board.getBoardState());

}
function resetGame() {
    stopAutoAI(true);
    let log = document.getElementById("log");
    log.style.display = "none";
    log.innerText = "";
    document.getElementById("status").innerText = "";
    board = new Board();
    redraw();
}
    document.body.innerHTML = "<div style='float:left;width:256px;'><div id='board'></div><br/> <button onclick='move();'>Make Move</button> <button onclick='ai_move();'>AI Move</button> <button onclick='resetGame();'>Reset Game</button><br/><label class='noSelect'><div><input id='autoAI' name='controlType' type='radio'/>Automatic AI</label><br/><label><input id='human-ai' onchange='stopAutoAI(true);' type='radio' name='controlType' checked/>Human-AI rounds</label><br/><label><input onchange='stopAutoAI(true);' id='manualControl' type='radio' name='controlType' />Manual control</label></div><br/><label class='noSelect'>Speed: <input id='autoAISpeed' type='text' size='3' maxlength='5' value='250'/>ms</label><br/><br/> <b>From:</b> <select id='fromCol'> <option value='0'>A</option> <option value='1'>B</option> <option value='2'>C</option> <option value='3'>D</option> <option value='4'>E</option> <option value='5'>F</option> <option value='6'>G</option> <option value='7'>H</option> </select> <select id='fromRow'> <option value='0'>1</option> <option value='1'>2</option> <option value='2'>3</option> <option value='3'>4</option> <option value='4'>5</option> <option value='5'>6</option> <option value='6'>7</option> <option value='7'>8</option> </select><br/><br/> <b>To:</b> <select id='toCol'> <option value='0'>A</option> <option value='1'>B</option> <option value='2'>C</option> <option value='3'>D</option> <option value='4'>E</option> <option value='5'>F</option> <option value='6'>G</option> <option value='7'>H</option> </select> <select id='toRow'> <option value='0'>1</option> <option value='1'>2</option> <option value='2'>3</option> <option value='3'>4</option> <option value='4'>5</option> <option value='5'>6</option> <option value='6'>7</option> <option value='7'>8</option> </select> <p id='status'></p></div> <div id = 'log'> </div>";
    document.body.innerHTML += "<style>.row{clear:both;}.cell{text-align: center;float:left; margin:1px; padding:6px;width:18px;height:18px;background-color:lightblue;}#board{background-color:lightslategrey;width:fit-content;}.whitePlayer{background-color:lightGreen;}.blackPlayer{background-color:indianred;}.selectedCell{background-color:lightgoldenrodyellow;} .cell:hover{background-color:yellow;}.noSelect {-webkit-touch-callout: none;-webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}.possibleMove{background-color: gold;}#log{float: left;overflow:auto;max-height: 95%;margin-left: 48px;padding: 6px;border: 1px;border-color: black;border-style: solid;background-color: lightblue; display:none;}</style>"
    redraw();
}
