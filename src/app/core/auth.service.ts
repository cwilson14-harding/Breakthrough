import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import * as firebase from "firebase/app";
import { user } from '../models/user';
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthService {

  user: Observable<user>;
  avaliable: Observable<user[]>;
  open;
  gamesRef;


  constructor(public afAuth: AngularFireAuth, public db: AngularFirestore) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.db.doc<user>(`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null);
        }
      });
  }

  getCurrentUser() {
    let currentUser = this.afAuth.auth.currentUser;
    return currentUser.uid;
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }
  oAuthLogin(provider){
    this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      });
  }
  updategameTypeMulti(user) {
    const userRef: AngularFirestoreDocument<user> = this.db.doc(`users/${user.uid}`);
    userRef.update({gameType: 'multi', isOnline: true});
  }
  updategameTypeSingle(user) {
    const userRef: AngularFirestoreDocument<user> = this.db.doc(`users/${user.uid}`);
    userRef.update({gameType: 'single'});
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<user> = this.db.doc(`users/${user.uid}`);

    const data: user = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      isOnline: user.isOnline = false,
      gameType: user.gameType = ''
    };
    return userRef.set(data);
  }

  viewOnlineUsers() {
    this.avaliable = this.db.collection('users', ref => ref.where('isOnline', '==', true)).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as user;
        data.uid = a.payload.doc.id;
        return data;
      });
    });
    return this.avaliable;
  }
  viewOpenGames() {
    this.open = this.db.collection('games', ref => ref.where('state', '==', 'open')).valueChanges();
    return this.open;
  }
  generateRandomNumber() {
    return Math.floor(Math.random() * 1000000) + 1;
  }
  createGame(user) {
    let randomNum = this.generateRandomNumber().toString();
    this.db.collection('games').doc(randomNum).set({
      creator: user.uid,
      creatorName: user.displayName,
      joiner: '',
      joinerName: '',
      state: 'open',
      gameId: randomNum
    });
  }
  joinGame(user, gameId, creatorId) {
    if (user.uid == creatorId) {
        alert('You Cant join your own game');
    } else {
      this.db.collection('games').doc(gameId).update({
        joiner: user.uid,
        joinerName: user.displayName,
        state: 'closed'
      });
    }
  }
}
