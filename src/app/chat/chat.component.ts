import {Component, Injectable, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {AuthService, Game} from '../core/auth.service';
import {GameService} from '../game.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {PlayerType} from '../player-data';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],

})
export class ChatComponent implements OnInit {
  chatRoomsDoc: AngularFirestoreDocument<any>;
  chatRoomsSubCollection: AngularFirestoreCollection<any>;
  currentUserName: any;
  game: AngularFirestoreDocument<Game>;
  games: any;
  gameId: any;

  constructor(public db: AngularFirestore, private gameService: GameService, public afAuth: AngularFireAuth,
              public auth: AuthService) {
    this.games = this.db.collection('games').valueChanges();
    this.currentUserName = (gameService.playerOne.type === PlayerType.Local) ? gameService.playerOne.name : gameService.playerTwo.name;
  }

  ngOnInit() {
    const chatRoomsCollection: AngularFirestoreCollection<any> = this.db.collection<any>('chat-rooms');
    this.chatRoomsDoc = chatRoomsCollection.doc(this.gameService.gameId);
    this.chatRoomsSubCollection = this.chatRoomsDoc.collection('messages');
  }

  sendMessage(message, gameId) {
    this.chatRoomsSubCollection.add(message);
  }

  newMessage() {
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
    // Create a message object.
    const message: IMessage = {
      message: messageBoxValue,
      sender: messageSender,
      time: time
    };
    // Send the message.
    // TODO Clear the chat box;
    this.sendMessage(message, this.gameService.gameId);
  }

}
