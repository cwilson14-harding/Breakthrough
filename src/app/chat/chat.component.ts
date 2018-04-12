import {Component, Injectable, Input, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {AuthService, Game} from '../core/auth.service';
import {GameService} from '../game.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {PlayerType} from '../player-data';
import {MusicService} from '../music.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})

export class ChatComponent implements OnInit {
  messagesCollection: AngularFirestoreCollection<any>;
  messages: IMessage[] = [];
  game: AngularFirestoreDocument<Game>;

  @Input()
  currentUserName: string;

  tauntCount = 34;
  chatbox: HTMLElement;

  constructor(private db: AngularFirestore, private gameService: GameService, public auth: AuthService, private musicService: MusicService) {
  }

  ngOnInit() {
    this.chatbox = document.getElementById('chatbox');

    // Check if this is a networked game.
    if (this.gameService.gameId) {
      // Get the messages list for this game.
      this.messagesCollection = this.db.collection<any>('chat-rooms').doc(this.gameService.gameId).collection('messages');

      // Subscribe to the messages list.
      this.messagesCollection.valueChanges().subscribe(messages => {
        // Clear the display list of messages.
        this.messages = [];

        // Parse through the new list of messages and add each one to the display list.
        for (const data of messages) {
          const message: IMessage = {
            message: data['message'],
            senderName: data['senderName'],
            senderId: data['senderId'],
            time: new Date(data['time'])
          };

          // Add this message to the list of messages.
          this.messages.push(message);
        }

        // Sort the list of messages by time sent.
        this.messages.sort((a, b) => {
          if (a.time > b.time) {
            return 1;
          } else if (a.time < b.time) {
            return -1;
          } else {
            return 0;
          }
        });

        if (this.messages.length > 0) {
          this.onMessageAdded(this.messages[this.messages.length - 1]);
        }

      });
    }
  }

  onMessageAdded(message: IMessage) {
    // Check if we need to play a taunt.
    const number = parseInt(message.message, 10);
    if (number.toString() === message.message) {
      if ((number > 0 && number <= this.tauntCount) || number === 300 || number === 420) {
        this.musicService.playSoundEffect('assets/taunts/' + number + '.mp3');
      }
    }

    // Scroll to the bottom of the chatbox.
    setTimeout(() => this.chatbox.scrollTop = this.chatbox.scrollHeight, 5);

  }

  sendMessage(message) {
    if (this.gameService.gameId) {
      // Send online message.
      this.messagesCollection.add(message);
    } else {
      // Send offline message.
      this.messages.push(message);
      this.onMessageAdded(message);
    }
  }

  private makeMessage(message: string): IMessage {
    return {
      message: message,
      senderName: this.currentUserName,
      senderId: this.auth.getCurrentUser(),
      time: Date.now()
    };
  }

  newMessage() {
    // Get what is inside of the message box. This value will be stored inside of the message property inside of the Message interface.
    const messageBox: HTMLInputElement = document.getElementById('messageBox') as HTMLInputElement;

    // Don't allow a message to be sent if blank.
    if (messageBox.value.trim()) {

      // Create a message object.
      const message: IMessage = this.makeMessage(messageBox.value.trim());

      // Send the message.
      this.sendMessage(message);

      // Clear the text box.
      messageBox.value = '';
    }
  }

}

interface IMessage {
  message: string;
  senderName: string;
  senderId: string;
  time: any;
}
