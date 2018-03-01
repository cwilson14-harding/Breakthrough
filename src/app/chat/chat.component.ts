import { Component, OnInit } from '@angular/core';
import{AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from "rxjs/Observable";
import {AuthService, Game, User} from "../core/auth.service";
import {auth} from "firebase/app";
import {AngularFireAuth} from "angularfire2/auth";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],

})
export interface Conversations{
  gameId: string;
  player1DisplayName: string;
  player1Id: string;
  player2DisplayName?: string;
  player2Id: string;
}
export class ChatComponent implements OnInit {
  messagesCollection: AngularFirestoreCollection<any[]>;
  messages: Observable<any[]>;
  showStyle = false;
  chatMessages: any;

  constructor(public db: AngularFirestore, public auth: AuthService) {
    this.chatMessages = this.db.collection('chats').valueChanges();
  }

  ngOnInit() {
    this.getChatData();
  }

  getChatData() {
    this.messagesCollection = this.db.collection<any>('conversations');
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
