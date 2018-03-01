import {Component, Injectable, OnInit} from '@angular/core';
import{AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from "rxjs/Observable";
import {Game} from "../core/auth.service";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],

})
export class ChatComponent implements OnInit {
  messagesCollection: AngularFirestoreCollection<any[]>;
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
    this.messagesCollection = this.db.collection<any>('games');
    this.messages = this.messagesCollection.valueChanges();
  }


  createChatDocument(game: Game){
    this.db.collection("conversations").add({
      gameId: game.gameId,
      player1DisplayName: game.creatorName,
      player1Id: game.creatorId,
      player2DisplayName: game.joinerName,
      player2Id: game.joinerId
    })
  }

  newMessage(message) {
    this.messagesCollection.add(message);
  }
}
