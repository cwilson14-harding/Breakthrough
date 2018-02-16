import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';

export interface User {
  displayName?: string;
  email: string;
  gameType: string;
  isOnline: boolean;
  photoURL?: string;
  uid: string;
  wins: number;
  losses: number;
}
export interface Game {
  creatorId: string;
  creatorName: string;
  gameId: string;
  joinerId: string;
  joinerName: string;
  playerTurn: number;
  state: string;
  winner: string;
}

@Injectable()
export class AuthService {

  user: Observable<User>;
  game: Observable<Game>;
  avaliable: Observable<User[]>;
  open;
  gameRef;
  joinerId;
  gameId: string;


  constructor(public afAuth: AngularFireAuth, public db: AngularFirestore, public router: Router) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
  }
  /* createGame: function(){}
     Parameters: user
     createGame calls the generateRandomNumber function to get a unique gameId. It then accesses the database, and sets
     the document name to this random number, and it sets all of the parameters defined in the game interface.
  */
  createGame(user: User): [string, Promise<void>] {
    this.gameId = this.generateRandomNumber().toString();

    return [this.gameId, this.db.collection('games').doc(user.uid).set({
      creatorId: user.uid,
      creatorName: user.displayName,
      joinerId: '',
      joinerName: '',
      state: 'open',
      gameId: user.uid,
      playerTurn: 1,
      winner: 0
    })];
  }
  anonymousLogin(){
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }
  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    // According to the documentation this line should set the login window to the user's preferred browser language.
    firebase.auth().useDeviceLanguage();
    return this.oAuthLogin(provider);
  }

  getCurrentGame(game) {
    const currentGame = this.db.collection('games').doc(game.gameId);
    alert(currentGame);
  }

  getCurrentUser() {
    const currentUser = this.afAuth.auth.currentUser;
    return currentUser.uid;
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    // According to the documentation this line should set the login window to the user's preferred browser language.
    firebase.auth().useDeviceLanguage();
    return this.oAuthLogin(provider);
  }

  joinGame(user, game) { // gameId, creatorId
    this.gameId = game.gameId;
    this.db.collection('games').doc(game.gameId).update({
      joinerId: user.uid,
      joinerName: user.displayName,
      state: 'closed'
    });
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  oAuthLogin(provider) {
    this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      });
  }
  updateGameTypeMulti(user) {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);
    userRef.update({gameType: 'multi', isOnline: true});
  }

  updategameTypeSingle(user) {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);
    userRef.update({gameType: 'single'});
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      isOnline: user.isOnline = false,
      gameType: user.gameType = '',
      wins: user.wins = 0,
      losses: user.losses = 0
    };
    return userRef.set(data);
  }

  /* viewOnlineUsers: function(){}
     Parameters: none
  */
  viewOnlineUsers() {
    this.avaliable = this.db.collection('users', ref => ref.where('isOnline', '==',
      true)).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as User;
        data.uid = a.payload.doc.id;
        return data;
      });
    });
    return this.avaliable;
  }

  /* viewOpenGames: function(){}
     Parameters: none
     This function queries the database and returns all games where the state property is equal to open.
  */
  viewOpenGames() {
    this.open = this.db.collection('games', ref => ref.where('state', '==',
      'open')).valueChanges();
    return this.open;
  }
  // Calling this function will get the gameId. The gameId is == to the currentUser's unique identifier.
  // The gameId is created in the createGame function.
  getGameId() {
    this.gameRef = this.db.collection('games', ref => ref.where('creatorId', '==',
      'gameId'));
    // Current user is whatever user is logged in at the time. This is part of Firebase.
    const currentUser = this.afAuth.auth.currentUser;
    const currentUserId = currentUser.uid;
    console.log(currentUserId);
  }
}
