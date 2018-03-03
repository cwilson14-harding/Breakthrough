import {Component, Injectable, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Game} from '../core/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],

})
export class ChatComponent implements OnInit {
  chatRoomsCollection: AngularFirestoreCollection<any>; // Removed array brackets Don't know if this will break stuff.
                                                        // I wasn't able to add a message to type any[]
  messages: Observable<any[]>;
  showStyle = false;
  chatMessages: any;

  constructor(public db: AngularFirestore) {
    this.chatMessages = this.db.collection('chats').valueChanges();
  }

  ngOnInit() {
    this.getChatData();
  }

  getChatData() {
    this.chatRoomsCollection = this.db.collection<any>('chat-rooms');
    this.messages = this.chatRoomsCollection.valueChanges();
  }

  newMessage(message, gameId) {
    const chatRoomsDoc = this.chatRoomsCollection.doc(gameId);
    const chatRoomsSubCollection = chatRoomsDoc.collection('messages');
    chatRoomsSubCollection.add(message);
  }
}
