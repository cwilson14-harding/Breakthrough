import { Component, OnInit } from '@angular/core';
import{AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from "rxjs/Observable";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],

})
export class ChatComponent implements OnInit {
  messagesCollection: AngularFirestoreCollection<any[]>;
  messages: Observable<any[]>;
  showStyle:false;

  constructor(public afs: AngularFirestore) {
  }

  ngOnInit() {
    this.getChatData();
  }

  getChatData() {
    this.messagesCollection = this.afs.collection<any>('games');
    this.messages = this.messagesCollection.valueChanges();
  }

  newMessage(message) {
    this.messagesCollection.add(message);
  }
}
