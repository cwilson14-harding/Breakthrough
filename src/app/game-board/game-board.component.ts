import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Board} from '../models/board';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  board = new Board();
  boardCells: Observable<any[]>;


  constructor(private db: AngularFirestore) {
    this.boardCells = db.collection('board').valueChanges();
  }

  ngOnInit() {
    //document.body.innerHTML ="<div style='float:left;'><div id='board'></div> <button (click)='move()'>Make Move</button><br/><br/> <b>From:</b> <select id='fromCol'> <option value='0'>A</option> <option value='1'>B</option> <option value='2'>C</option> <option value='3'>D</option> <option value='4'>E</option> <option value='5'>F</option> <option value='6'>G</option> <option value='7'>H</option> </select> <select id='fromRow'> <option value='0'>1</option> <option value='1'>2</option> <option value='2'>3</option> <option value='3'>4</option> <option value='4'>5</option> <option value='5'>6</option> <option value='6'>7</option> <option value='7'>8</option> </select><br/><br/> <b>To:</b> <select id='toCol'> <option value='0'>A</option> <option value='1'>B</option> <option value='2'>C</option> <option value='3'>D</option> <option value='4'>E</option> <option value='5'>F</option> <option value='6'>G</option> <option value='7'>H</option> </select> <select id='toRow'> <option value='0'>1</option> <option value='1'>2</option> <option value='2'>3</option> <option value='3'>4</option> <option value='4'>5</option> <option value='5'>6</option> <option value='6'>7</option> <option value='7'>8</option> </select> <p id='status'></p></div> <div style='float: left;' id = 'log'> </div>";
    //this.redraw();
  }
  getCell(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;

    alert(value);
  }

  boardToString(board: number[][]) {
    let result = '';
    for (const row of board) {
      for (const col of row) {
        result += ' ' + col + ' ';
      }
      result += '<br>';
    }
    return result;
  }
  redraw() {
    let htmlboard = document.getElementById('board');
    htmlboard.innerHTML = this.boardToString(this.board.getBoardState());
  }
  move() {
    let fromRow = document.getElementById("fromRow");
    let toRow = document.getElementById("toRow");
    let fromCol = document.getElementById("fromCol");
    let toCol = document.getElementById("toCol");
    let status = document.getElementById("status");
    let log = document.getElementById("log");

    // if (this.board.movePiece([+fromRow.value, +fromCol.value], [+toRow.value, +toCol.value])) {
    //   this.redraw();
    //
    //   status.innerText = 'Moved from ' + this.getSelectedText(fromCol) + this.getSelectedText(fromRow)
    //     + ' to ' + this.getSelectedText(toCol) + this.getSelectedText(toRow) + '.';
    //   log.innerHTML += status.innerText + '<br>';
    //
    //   let winner = this.board.isGameFinished();
    //   if (winner != 0) {
    //     status.innerHTML += '<br>Player ' + winner + ' won!';
    //   }
    // } else {
    //   status.innerText = 'Invalid move.';
    // }
  }
  getSelectedText(node) {
    return node.options[node.selectedIndex].text
  }
  // makeMove(id, isOn) {
  //   // Update isOn here.
  //   this.db.collection('board').doc(id).update({isOn: !isOn});
  // }


}
