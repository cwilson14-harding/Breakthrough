import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import {ChatComponent} from '../chat/chat.component';

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
  lastMove: string;
}

@Injectable()
export class AuthService {
  currUserName: any;
  currAvatar: any;
  user: Observable<User>;
  game: Observable<Game>;
  avaliable: Observable<User[]>;
  open;
  gameRef;
  joinerId;
  creatorId;
  gameId: string;
  userId: string;
  password = 'E3UdZuQ@02ixfa3J##us4ZbY29Azh8Iiwv46gsbBU#o%4XMqIfrW$EqW7fYU^#b3';
  anonymousInfo;

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

  createGame() {
    const gamesRef = this.db.collection('games');
    const userDoc = this.db.collection('users').doc(this.userId);
    const userInfo = userDoc.valueChanges();
    userInfo.subscribe(res => {
      this.currUserName = res['displayName'];
      this.currAvatar = res['pic'];
      this.creatorId = this.userId;
      gamesRef.doc(this.userId).set({
        creatorId: this.userId,
        creatorName: this.currUserName,
        gameId: this.userId, // TODO: gameId = userId, should be random number.
        joinerId: '',
        joinerName: '',
        pic: this.currAvatar,
        state: 'open',
        type: 'multi'
      });
    });
  }

  getCreatorId() {
    return this.creatorId;
  }
  getDisplayName() {
    return this.currUserName;
  }

  anonymousLogin() {
    // firebase.auth().signInAnonymously();
    this.afAuth.auth.signInAnonymously();
  }

  createAccountWithEmail(email, wins, losses) {
    // firebase.auth().createUserWithEmailAndPassword(email, this.password).then((credential) => {
    // this.updateUserData(credential.user);
    // });
    firebase.auth().createUserWithEmailAndPassword(email, this.password).catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        alert('This email is already in use. Try logging in.');
      } else if (errorCode === 'auth/invalid-email') {
        alert('The email address provided is not valid.');
      } else {
        console.log('account created successfully');
      }
    }).then(() => {
      const currUserId = this.getCurrentUser();
      this.db.collection('users').doc(currUserId).set({
        email: email,
        losses: losses,
        wins: wins
      }).then(() => {
        this.router.navigate(['email-user-info']);
      });
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

  getCurrentUser(): string {
    const currentUser = this.afAuth.auth.currentUser;
    return currentUser.uid;
  }

  getAnonymousInfo(id) {
    this.anonymousInfo = this.db.doc('/users/' + id).valueChanges();
    return this.anonymousInfo;
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 1000000) + 1;
  }


  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    // According to the documentation this line should set the login window to the user's preferred browser language.
    firebase.auth().useDeviceLanguage();
    return this.oAuthLogin(provider);

    /*console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    let unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        let credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.getAuthResponse().id_token);
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential).catch(function(error) {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          // The email of the user's account used.
          let email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          let credential = error.credential;
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
    function isUserEqual(googleUser, firebaseUser) {
      if (firebaseUser) {
        let providerData = firebaseUser.providerData;
        for (let i = 0; i < providerData.length; i++) {
          if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
            // We don't need to reauth the Firebase connection.
            return true;
          }
        }
      }
      return false;
    }
    */
  }

  joinGame(userId: string, displayName: string, gameId: string) { // gameId, creatorId
    this.db.collection('games').doc(gameId).update({
      joinerId: userId,
      joinerName: displayName,
      state: 'closed'
    });
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  loginUserWithEmail(email) {
    firebase.auth().signInWithEmailAndPassword(email, this.password).catch(function(error) {
      // Handle errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    switch (errorCode) {
      case(errorCode === 'auth/invalid-email'): {
        alert('The email address provided is invalid.');
        break;
      }
      case(errorCode === 'auth/user-not-found'): {
        alert('The user does not exist. Try creating an account.');
        break;
      }
      default: console.log('account created successfully!');
      break;
    }
    });
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
    const uid = Math.random().toString();
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${uid}`);

    const data: User = {
      uid: uid,
      email: user.email,
      photoURL: '',
      displayName: user.email,
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
    this.open = this.db.collection('games', ref => ref.where('isOpen', '==',
      true)).valueChanges();
    return this.open;
  }
}
  // Calling this function will get the gameId. The gameId is == to the currentUser's unique identifier.
  // The gameId is created in the createGame function.
  /*getGameId() {
    this.gameRef = this.db.collection('games', ref => ref.where('creatorId', '==',
      'gameId'));
    // Current user is whatever user is logged in at the time. This is part of Firebase.
    const currentUser = this.afAuth.auth.currentUser;
    const currentUserId = currentUser.uid;
    console.log(currentUserId);
  }
}*/
