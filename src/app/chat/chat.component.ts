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
  messagesCollection: AngularFirestoreCollection<any>;
  messages: Observable<IMessage[]>;
  game: AngularFirestoreDocument<Game>;
  currentUserName: string;

  constructor(public db: AngularFirestore, private gameService: GameService, public afAuth: AngularFireAuth,
              public auth: AuthService) {
    this.currentUserName = (gameService.playerOne.type === PlayerType.Local) ? gameService.playerOne.name : gameService.playerTwo.name;
  }

  ngOnInit() {
    // Get the messages list for this game.
    this.messagesCollection = this.db.collection<any>('chat-rooms').doc(this.gameService.gameId).collection('messages');

    // Subscribe to the messages list.
    this.messages = this.messagesCollection.valueChanges();
  }

  sendMessage(message) {
    this.messagesCollection.add(message);
  }

  newMessage() {
    // Get what is inside of the message box. This value will be stored inside of the message property inside of the Message interface.
    const messageBox: HTMLInputElement = document.getElementById('messageBox') as HTMLInputElement;

    // Get the person who sent the message.
    const messageSender = this.currentUserName;

    // Get the time when the message was sent.
    const time = Date.now();

    // Create a message object.
    const message: IMessage = {
      message: messageBox.value,
      sender: messageSender,
      time: time
    };

    // Send the message.
    this.sendMessage(message);

    // Clear the text box.
    messageBox.value = '';
  }

}

interface IMessage {
  message: string;
  sender: string;
  time: any;
}
