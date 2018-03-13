import {Component, Injectable, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {AuthService, Game} from '../core/auth.service';
import {GameService} from '../game.service';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],

})
export class ChatComponent implements OnInit {
  chatRoomsCollection: AngularFirestoreCollection<any>; // Removed array brackets Don't know if this will break stuff. // I wasn't able to add a message to type any[]
  currentUserName: any;
  game: AngularFirestoreDocument<Game>;
  games: any;
  gameId: any;
  messages: Observable<any[]>;
  showStyle = false;
  chatMessages: any;

  constructor(public db: AngularFirestore, private gameService: GameService, public afAuth: AngularFireAuth,
              public auth: AuthService) {
    this.chatMessages = this.db.collection('chats').valueChanges();
    this.games = this.db.collection('games').valueChanges();
    this.currentUserName = this.auth.getDisplayName();
  }

  ngOnInit() {
    this.getChatData();
  }

  getChatData() {
    this.chatRoomsCollection = this.db.collection<any>('chat-rooms');
    this.messages = this.chatRoomsCollection.valueChanges();
  }

  sendMessage(message, gameId) {
    const chatRoomsDoc = this.chatRoomsCollection.doc(gameId);
    const chatRoomsSubCollection = chatRoomsDoc.collection('messages');
    chatRoomsSubCollection.add(message);
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
    this.sendMessage(message, this.auth.getCreatorId());
  }

}
